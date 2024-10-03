const ProgressReport = require("../../../models/progressReport");
const User = require("../../../models/user");
const csv = require('csv-parser');
const fs = require('fs');


module.exports = {
  // Route to upload CSV file and generate progress report

  async post(req, res) {
    try {
      // Extract user details from JWT token
      const { id, loginType } = req.user;

      // Validate user role: ensure they are an admin or teacher
      if (loginType !== 'admin' && loginType !== 'loginType') {
        return res.status(403).json({ error: 'Unauthorized. Only admins or teachers can upload progress reports.' });
      }

      const { schoolId, academicYear, className, section } = req.body;
      const filePath = req.file.path;
      const progressReports = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (csvHeaders) => {
          // Filter out S.No from the headers
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
              // Save progress reports to the database
              if (progressReports.length > 0) {
                await ProgressReport.insertMany(progressReports);
                res.status(200).json({ message: 'Progress reports generated successfully!' });
              } else {
                res.status(404).json({ message: 'No valid student data found in the CSV file.' });
              }
            });
        });
    } catch (error) {
      res.status(500).json({ error: 'Error processing the file', details: error.message });
    }
  },
async get(req, res) {
  try {
    // Validate if the request is from an admin user
    if (!req.user || req.user.loginType !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { schoolId, academicYear, className, section } = req.body;
    const progressReports = await ProgressReport.find({ _school: schoolId, academicYear, class: className, section });
    res.json({ progressReports });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving progress reports', details: error.message });
  }
},




};

