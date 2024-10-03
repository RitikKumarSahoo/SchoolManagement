const ProgressReport = require("../../models/progressReport")
const { get } = require("../admin/schedules")
const User = require("../../models/user")
const csv = require('csv-parser');
const fs = require('fs');


module.exports = {
  async post(req, res) {
    try {
      // Extract user details from JWT token
      const { id, loginType } = req.user;

      // Validate user role: ensure they are a teacher
      if (loginType !== 'teacher') {
        return res.status(403).json({ error: 'Unauthorized. Only teachers can upload progress reports.' });
      }

      const { schoolId, academicYear, className, section } = req.body;
      const filePath = req.file.path;
      const progressReports = [];

      // Read CSV file
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (csvHeaders) => {
          // Filter out S.No and unnecessary columns from the headers
          const subjects = csvHeaders.filter(
            (header) => !['S.No', 'Roll No', 'Term', 'Student Name', 'Father\'s Name', 'DOB', 'Class', 'Section', 'Academic Year'].includes(header)
          );

          // Parse CSV rows
          fs.createReadStream(filePath)
            .pipe(csv({ headers: csvHeaders }))
            .on('data', async (row) => {
              try {
                // Find the student based on Roll No, School ID, Class, and Section
                const student = await User.findOne({
                  rollNo: row['Roll No'],
                  _school: schoolId,
                  class: className,
                  section,
                });

                if (student) {
                  // Create progress report object for each student
                  const progressReport = {
                    _school: schoolId,
                    _user: student._id,
                    academicYear,
                    termType: row['Term'].toLowerCase(),
                    class: className,
                    section,
                    subjects: subjects.map((subject) => ({
                      subject,
                      marks: parseInt(row[subject], 10),
                    })),
                    totalMarks: subjects.reduce((acc, subject) => acc + (parseInt(row[subject]) || 0), 0),
                    totalOutOf: subjects.length * 100,
                  };

                  // Push progress report to array
                  progressReports.push(progressReport);
                } else {
                  console.warn(`Student with Roll No ${row['Roll No']} not found for class ${className}, section ${section}.`);
                }
              } catch (error) {
                console.error(`Error finding student with Roll No ${row['Roll No']}: ${error.message}`);
              }
            })
            .on('end', async () => {
              try {
                // Save progress reports to the database
                if (progressReports.length > 0) {
                  await ProgressReport.insertMany(progressReports);
                  res.status(200).json({ message: 'Progress reports generated successfully!' });
                } else {
                  res.status(404).json({ message: 'No valid student data found in the CSV file.' });
                }
              } catch (error) {
                res.status(500).json({ error: 'Error saving progress reports to the database', details: error.message });
              }
            });
        });
    } catch (error) {
      res.status(500).json({ error: 'Error processing the file', details: error.message });
    }
  },





  async get(req, res) {
    try {
      const { id, year, termType } = req.params

      // Validate user
      const user = await User.findById(id)
      if (!user) return res.status(404).send("User not found")

      // Validate if user is teacher or student
      const isTeacher = user.loginType === "teacher"
      const isStudent = user.loginType === "student"

      if (!isTeacher && !isStudent) return res.status(403).send("User is not a teacher or student")


      const school = await School.findOne({ _id: user._school })
      if (!school) return res.status(404).send("School not found")

      const query = { _user: id }
      if (year && termType) {
        query.academicYear = year
        query.termType = termType
      } else if (year) {
        query.academicYear = year
      } else if (termType) {
        const { class: classId } = await get(req, res)
        query._classId = classId
        query.termType = termType
      }

      const progressReports = await ProgressReport.find(query)
      if (!progressReports.length) return res.status(404).send("No progress report exists for this user")

      res.json(progressReports)
    } catch (err) {
      console.log(err)
      res.status(500).send(err.message)
    }
  }
}


