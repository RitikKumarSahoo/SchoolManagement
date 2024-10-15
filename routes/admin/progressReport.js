const ProgressReport = require("../../models/progressReport");
const User = require("../../models/user");
const School = require("../../models/school"); // Assuming you have a School model
const Class = require("../../models/class");   // Assuming you have a Class model
const csv = require('csv-parser');
const { Readable } = require('stream');


// const upload = multer({ storage: multer.memoryStorage() });

module.exports = {
  // Route to upload CSV file and generate progress report 
   
  /**
   * Uploads a CSV file containing student marks and generates a progress report
   * for each student in the specified class and section.
   * 
   * The CSV file must contain the following columns:
   * - S.No
   * - Roll No
   * - Term (midterm or final)
   * - Student Name
   * - DOB
   * - Class
   * - Section
   * - Academic Year
   * - Subject marks (e.g. English, Math, etc.)
   * 
   * The route requires the following body parameters:
   * - schoolId: the ID of the school
   * - academicYear: the academic year for which the report is requested
   * - className: the name of the class
   * - section: the section of the class
   * 
   * The route returns a JSON response with a success message if the reports are
   * generated successfully, or an error message if there is an issue with the
   * file or data.
   * 
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} - The response object
   */
  async post(req,res){
    try {
      // Ensure a file is uploaded
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }
  
      // Extract user details from JWT token (you'll need to implement this)
      const { id, loginType } = req.user;
  
      // Validate user role: ensure they are an admin or teacher
      if (loginType !== "admin" && loginType !== "teacher") return res.status(403).json({ error: "Unauthorized. Only admins or teachers can upload progress reports." });
      
  
      const { schoolId, academicYear, className, section } = req.body;
      const progressReports = [];
      const rollNoArray = [];
      const rollWiseSubjects = [];
  
      // Create a readable stream from the uploaded file buffer
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null); // End the stream
  
      bufferStream
        .pipe(csv())
        .on("headers", (csvHeaders) => {
          // Filter out unnecessary headers
          this.subjects = csvHeaders.filter(
            (header) => !["S.No", "Roll No", "Term", "Student Name", "DOB", "Class", "Section", "Academic Year"].includes(header)
          );
        })
        .on("data", (row) => {
          // Collect roll numbers and roll-wise subjects
          rollNoArray.push(row["Roll No"]);
          rollWiseSubjects.push({
            rollNo: row["Roll No"],
            subjects: this.subjects.map((subject) => ({
              subject,
              marks: parseInt(row[subject], 10),
            })),
            term: row["Term"],
            totalMarks: this.subjects.reduce((acc, subject) => acc + (parseInt(row[subject]) || 0), 0),
          });
        })
        .on("end", async () => {
          try {
            // Find the school and class IDs based on names
            const school = await School.findOne({ _id: schoolId });
            const classData = await Class.findOne({ name: className });
  
            if (!school || !classData) {
              return res.status(404).json({ message: "School or class not found." });
            }
  
            // Find the students based on Roll No, School ID, Class, and Section
            const students = await User.find({
              rollNo: { $in: rollNoArray },
              _school: school._id,
              _class: classData._id,
              section,
            });
  
            if (students.length > 0) {
              for (const student of students) {
                // Loop through roll-wise subjects to find corresponding subject object
                for (const subjectObj of rollWiseSubjects) {
                  if (subjectObj.rollNo === student.rollNo) {
                    
                    // Check if a progress report for this student, academic year, and term already exists
                    const existingReport = await ProgressReport.findOne({
                      _user: student._id,
                      academicYear,
                      termType: subjectObj.term.toLowerCase(),
                      _class: classData._id,
                      section,
                    });
  
                    // If the progress report already exists for this academic year and term, skip this student
                    if (existingReport) {
                      console.log(`Skipping student ${student.rollNo} for term ${subjectObj.term} as the report already exists.`);
                      continue; // Skip to the next student if report exists
                    }
  
                    // Create a new progress report for this term
                    const newProgressReport = {
                      _school: school._id,
                      _user: student._id,
                      academicYear,
                      termType: subjectObj.term.toLowerCase(),
                      _class: classData._id,
                      section,
                      subjects: subjectObj.subjects,
                      totalMarks: subjectObj.totalMarks,
                      totalOutOf: this.subjects.length * 100,
                    };
  
                    // Push new progress report to array
                    progressReports.push(newProgressReport);
                  }
                }
              }
  
              // Save progress reports to the database
              if (progressReports.length > 0) {
                await ProgressReport.insertMany(progressReports);
                res.status(200).json({ message: "Progress reports generated successfully!" });
              } else {
                res.status(404).json({ message: "No new progress reports to generate. All reports already exist for the given students." });
              }
            } else {
              res.status(404).json({ message: "No matching students found." });
            }
          } catch (error) {
            console.error(`Error saving progress reports: ${error.message}`);
            res.status(500).json({ error: "Error processing the data", details: error.message });
          }
        });
    } catch (error) {
      res.status(500).json({ error: "Error processing the file", details: error.message });
    }
  },

/**
 * Retrieves the progress report for a given student by class and academic year.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 * @throws {Error} - If the user is not a student, teacher, or admin
 * @throws {Error} - If the student ID is not provided when the user is a teacher or admin
 * @throws {Error} - If the student ID is invalid or not found
 * @throws {Error} - If the class or academic year is not provided in the query
 * @throws {Error} - If the class name does not match the student's class if the requester is a student
 * @throws {Error} - If there are no progress reports found for the specified class and academic year
 */
async get(req, res) {
  try {
    // Extract user ID and loginType (role) from the token
    const { id, loginType } = req.user;
  
    // Check if the user is a student, teacher, or admin
    const isStudent = loginType === 'student';
    const isAdminOrTeacher = loginType === 'admin' || loginType === 'teacher';
  
    // Validate if the user is allowed to view the report
    let studentIdToSearch;
  
    if (isStudent) {
      // If the user is a student, they can only view their own report
      studentIdToSearch = id;
    } else if (isAdminOrTeacher) {
      // If the user is admin or teacher, they need to provide a studentId in the URL
      studentIdToSearch = req.params.studentId;
      if (!studentIdToSearch) {
        return res.status(400).json({ error: 'Please provide a valid student ID.' });
      }
    } else {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }
  
    // Fetch the student details
    const student = await User.findById(studentIdToSearch).populate('_class');
    
    if (!student) return res.status(404).json({ error: 'Student not found.' });
    
  
    // Extract the class and academicYear from the query
    const { class: requestedClass, academicYear } = req.query;
    
    if (!requestedClass || !academicYear) return res.status(400).json({ error: 'Please provide both class and academic year.' });
    
  
    // Ensure the className matches the student’s class if the requester is a student
    const studentClassName = student._class.name; // Assuming class name is stored in `_class`
    const section = student._class.section
    if (isStudent && studentClassName !== requestedClass) return res.status(400).json({ error: 'You can only view reports for your own class.' });
  
    // Find the progress reports for the student by class and academic year
    const progressReports = await ProgressReport.find({
      _user: studentIdToSearch,
      _class: student._class._id, // Use the student's class ID here
      academicYear,
    });
  
    if (!progressReports || progressReports.length === 0) return res.status(404).json({ message: 'No progress reports found for the specified class and academic year.' });
  
    // Separate midterm and final reports
    const midterm = progressReports.find((report) => report.termType === 'midterm');
    const finalReport = progressReports.find((report) => report.termType === 'final');
  
    // Calculate final grade based on total marks
    const calculateFinalGrade = (totalMarks, totalOutOf) => {
      const percentage = (totalMarks / totalOutOf) * 100;
      if (percentage >= 90) return 'A+';
      if (percentage >= 80) return 'A';
      if (percentage >= 70) return 'B+';
      if (percentage >= 60) return 'B';
      if (percentage >= 50) return 'C';
      if (percentage >= 40) return 'D';
      return 'F';
    };
  
    // Format the student data for the response
    const formattedData = {
      student: {
        name: student.name,
        rollNo: student.rollNo, // Assuming rollNo is a field in the User model
        dob: student.dob, // Assuming dob is a field in the User model
        class: studentClassName,
        section: section,
        academicYear,
      },
      midterm: null,
      finalReport: null,
    };
  
    // Populate midterm if available
    if (midterm) {
      const term1Grade = calculateFinalGrade(midterm.totalMarks, midterm.totalOutOf);
      formattedData.midterm = {
        totalOutOf: midterm.totalOutOf,
        totalMarks: midterm.totalMarks,
        finalGrade: term1Grade,
        subjects: midterm.subjects.map((subject) => ({
          subject: subject.subject,
          totalMarks: 100,
          obtainedMarks: subject.marks,
          status: subject.marks >= 40 ? 'PASS' : 'FAIL',
        })),
      };
    }
  
    // Populate finalReport if available
    if (finalReport) {
      const finalGrade = calculateFinalGrade(finalReport.totalMarks, finalReport.totalOutOf);
      formattedData.finalReport = {
        totalOutOf: finalReport.totalOutOf,
        totalMarks: finalReport.totalMarks,
        finalGrade: finalGrade,
        subjects: finalReport.subjects.map((subject) => ({
          subject: subject.subject,
          totalMarks: 100,
          obtainedMarks: subject.marks,
          status: subject.marks >= 40 ? 'PASS' : 'FAIL',
        })),
      };
    }
  
    // Send the response with both reports or just the midterm report if final report is missing
    if (!finalReport) {
      res.json({ success: true, data: formattedData.midterm });
    } else {
      res.json({ success: true, data: formattedData });
    }
  } catch (error) {
    console.error(`Error retrieving progress report: ${error.message}`);
    res.status(500).json({ error: 'Error retrieving the progress report', details: error.message });
  }
  
  
  
  
},


};

