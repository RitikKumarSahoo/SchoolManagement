const ProgressReport = require("../../models/progressReport");
const User = require("../../models/user");
const csv = require('csv-parser');
const fs = require('fs');


module.exports = {
  // Route to upload CSV file and generate progress report

  /**
   * Uploads a CSV file and generates progress reports for students.
   *
   * Route: POST /progressReport/create-progress-report
   *
   * @param {Object} req.body - Request body containing the following parameters:
   * @param {string} req.body.schoolId - School ID
   * @param {string} req.body.academicYear - Academic year
   * @param {string} req.body.className - Class name
   * @param {string} req.body.section - Section
   * @param {Object} req.file - CSV file to be uploaded
   *
   * @returns {Object} - Response object with a success message or an error message
   */
  async post(req, res) {
    try {
      // Extract user details from JWT token
      const { id, loginType } = req.user;
  
      // Validate user role: ensure they are an admin or teacher
      if (loginType !== 'admin' && loginType !== 'teacher') {
        return res.status(403).json({ error: 'Unauthorized. Only admins or teachers can upload progress reports.' });
      }
  
      const { schoolId, academicYear, className, section } = req.body;
      const filePath = req.file.path;
      const progressReports = [];
  
      const rollNoArray = [];
      const rollWiseSubjects = [];
  
      // Parse CSV rows
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (csvHeaders) => {
          // Filter out unnecessary headers
          const subjects = csvHeaders.filter(
            (header) => !['S.No', 'Roll No', 'Term', 'Student Name', 'Father\'s Name', 'DOB', 'Class', 'Section', 'Academic Year'].includes(header)
          );
  
          // Store subjects for later use
          this.subjects = subjects;
        })
        .on('data', (row) => {
          // Collect roll numbers and roll-wise subjects
          rollNoArray.push(row['Roll No']);
          rollWiseSubjects.push({
            rollNo: row['Roll No'],
            subjects: this.subjects.map((subject) => ({
              subject,
              marks: parseInt(row[subject], 10),
            })),
            term: row['Term'],
            totalMarks: this.subjects.reduce((acc, subject) => acc + (parseInt(row[subject]) || 0), 0),
          });
        })
        .on('end', async () => {
          try {
            // Find the students based on Roll No, School ID, Class, and Section
            const students = await User.find({
              rollNo: { $in: rollNoArray },
              _school: schoolId,
              class: className,
              section,
            });
  
            if (students.length > 0) {
              students.forEach((student) => {
                const subjectObj = rollWiseSubjects.find((obj) => obj.rollNo === student.rollNo);
  
                // Create progress report object for each student
                const progressReport = {
                  _school: schoolId,
                  _user: student._id,
                  academicYear,
                  termType: subjectObj.term.toLowerCase(),
                  class: className,
                  section,
                  subjects: subjectObj.subjects,
                  totalMarks: subjectObj.totalMarks,
                  totalOutOf: this.subjects.length * 100,
                };
  
                // Push progress report to array
                progressReports.push(progressReport);
              });
  
              // Save progress reports to the database
              if (progressReports.length > 0) {
                await ProgressReport.insertMany(progressReports);
                res.status(200).json({ message: 'Progress reports generated successfully!' });
              } else {
                res.status(404).json({ message: 'No valid student data found in the CSV file.' });
              }
            } else {
              res.status(404).json({ message: 'No matching students found.' });
            }
          } catch (error) {
            console.error(`Error saving progress reports: ${error.message}`);
            res.status(500).json({ error: 'Error processing the data', details: error.message });
          }
        });
    } catch (error) {
      res.status(500).json({ error: 'Error processing the file', details: error.message });
    }
  },
/**
 * @api {get} /progress-report 5.0 Get progress report
 * @apiName getProgressReport
 * @apiGroup Progress Report
 * @apiPermission Student
 *
 * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
 *
 * @apiParam {String} class `Query Param` The class of the student
 * @apiParam {String} academicYear `Query Param` The academic year for which the report is requested
 *
 * @apiSuccessExample {type} Success-Response: 200 OK
 * {
 *     success: true,
 *     data: {
 *         student: {
 *             name: String,
 *             class: String,
 *             academicYear: String,
 *         },
 *         term1Report: {
 *             totalOutOf: Number,
 *             totalMarks: Number,
 *             subjects: [
 *                 {
 *                     subject: String,
 *                     totalMarks: Number,
 *                     obtainedMarks: Number,
 *                     status: String
 *                 }
 *             ]
 *         },
 *         finalReport: {
 *             totalOutOf: Number,
 *             totalMarks: Number,
 *             subjects: [
 *                 {
 *                     subject: String,
 *                     totalMarks: Number,
 *                     obtainedMarks: Number,
 *                     status: String
 *                 }
 *             ]
 *         }
 *     }
 * }
 *
 * @apiErrorExample {type} Error-Response: 404 Not Found
 * {
 *     error: 'No progress reports found for the specified class and academic year.'
 * }
 * @apiErrorExample {type} Error-Response: 500 Internal Server Error
 * {
 *     error: 'Error retrieving the progress report',
 *     details: String
 * }
 */
async get(req, res) {
  try {
    // Extract user ID from the token
    const { id } = req.user;

    // Validate that the user is a student
    const student = await User.findById(id);
    if (!student || student.role !== 'student') {
      return res.status(403).json({ error: 'Unauthorized. Only students can view progress reports.' });
    }

    // Extract query parameters for class and academic year
    const { class: requestedClass, academicYear } = req.query;

    if (!requestedClass || !academicYear) {
      return res.status(400).json({ error: 'Please provide both class and academic year.' });
    }

    // Find the progress reports for the student based on class and academic year
    const progressReports = await ProgressReport.find({
      _user: id,
      class: requestedClass,
      academicYear,
    });

    if (!progressReports || progressReports.length === 0) {
      return res.status(404).json({ message: 'No progress reports found for the specified class and academic year.' });
    }

    // Separate midterm and final reports
    const term1Report = progressReports.find((report) => report.termType === 'midterm');
    const finalReport = progressReports.find((report) => report.termType === 'final');

    // Format the student data
    const formattedData = {
      student: {
        name: student.name,
        class: requestedClass,
        academicYear,
      },
      term1Report: null,
      finalReport: null,
    };

    // Populate the term1Report if available
    if (term1Report) {
      formattedData.term1Report = {
        totalOutOf: term1Report.totalOutOf,
        totalMarks: term1Report.totalMarks,
        subjects: term1Report.subjects.map((subject) => ({
          subject: subject.subject,
          totalMarks: 100,
          obtainedMarks: subject.marks,
          status: subject.marks >= 40 ? 'PASS' : 'FAIL',
        })),
      };
    }

    // Populate the finalReport if available
    if (finalReport) {
      formattedData.finalReport = {
        totalOutOf: finalReport.totalOutOf,
        totalMarks: finalReport.totalMarks,
        subjects: finalReport.subjects.map((subject) => ({
          subject: subject.subject,
          totalMarks: 100,
          obtainedMarks: subject.marks,
          status: subject.marks >= 40 ? 'PASS' : 'FAIL',
        })),
      };
    }

    // Check if the final report is not available
    if (!finalReport) {
      // If final report is not available, ensure only midterm data is sent
      res.json({ success: true, data: formattedData.term1Report });
    } else {
      // Send both reports if available
      res.json({ success: true, data: formattedData });
    }
  } catch (error) {
    console.error(`Error retrieving progress report: ${error.message}`);
    res.status(500).json({ error: 'Error retrieving the progress report', details: error.message });
  }
},




};

