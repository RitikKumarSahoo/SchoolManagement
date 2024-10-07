const User = require("../../models/user");
const School = require("../../models/school");
const Class = require("../../models/class");
const Attendance = require("../../models/attendance");
const CheckIn = require("../../models/teachersCheckin");
const moment = require("moment");

module.exports = {
  /**
   *
   * @api {post} /attendance/getstudents Get StudentsForAttendance
   * @apiName GetClassStudentsForAttendance
   * @apiGroup Attendance
   *
   * @apiHeader {String} Authorization Bearer token for teacher access.
   *
   * @apiParam {String} _class The ID of the class for which students are being retrieved.
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error (false for success).
   * @apiSuccess {Object[]} students Array of students in the specified class.
   * @apiSuccess {String} students._id The unique ID of the student.
   * @apiSuccess {String} students.rollNo The roll number of the student.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "students": [
   *     {
   *       "_id": "60c72b2f9b1e8a3b4c3e4f6a",
   *       "rollNo": "001"
   *     },
   *     {
   *       "_id": "60c72b2f9b1e8a3b4c3e4f6b",
   *       "rollNo": "002"
   *     }
   *   ]
   * }
   *
   * @apiError (400) {Boolean} error Indicates whether there was an error (true).
   * @apiError (400) {String} reason The reason for the error (e.g., "You are not teacher", "you are not assigned to this class").
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "You are not teacher"
   * }
   *
   */

  async getClassStudentsForAttendance(req, res) {
    try {
      const { _class } = req.body;
      const { id, loginType } = req.user;

      if (!(loginType === "teacher")) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not teacher" });
      }

      // check teacher is assigned to this class or not
      const assignedClass = await Attendance.findOne({
        _school: req.user._school,
        _class,
        _teacher: id,
      });

      if (assignedClass === null) {
        return res.status(400).json({
          error: true,
          reason: "you are not assigned to this class",
        });
      }

      // fetch students for the specific class
      const students = await User.find({
        _class,
        loginType: "student",
        _school: req.user._school,
      })
        .select("_id rollNo")
        .lean();

      return res.status(200).json({ error: false, students });
    } catch (error) {
      return res.status(400).json({ error: true, reason: error });
    }
  },

  /**
   *
   * @api {post} /attendance/mark  Mark Student Attendance
   * @apiName MarkAttendance
   * @apiGroup Attendance
   *
   * @apiHeader {String} Authorization Bearer token for teacher access.
   *
   * @apiParam {String} _class The ID of the class for which attendance is being marked.
   * @apiParam {String} studentId The ID of the student whose attendance is being marked.
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "message": "Student has been marked present",
   *   "attendance": {
   *     "_id": "60c72b2f9b1e8a3b4c3e4f6c",
   *     "_class": "60c72b2f9b1e8a3b4c3e4f6a",
   *     "date": "2024-10-04T00:00:00.000Z",
   *     "presentIds": ["60c72b2f9b1e8a3b4c3e4f6b"]
   *   }
   * }
   *
   * @apiError (400) {Boolean} error Indicates whether there was an error (true).
   * @apiError (400) {String} reason The reason for the error (e.g., "You are not a teacher", "You are not assigned to this class", "Student is not assigned to this class").
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "You are not a teacher"
   * }
   *
   */
  async markAttendance(req, res) {
    try {
      const { _class, studentId } = req.body;
      const { id } = req.user;

      // Check if the user is a teacher
      const teacher = await User.findOne({
        _id: id,
        loginType: "teacher",
      });
      if (!teacher) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not a teacher" });
      }

      // Check if the teacher is assigned to the class
      const TeacherAssignClass = await Attendance.findOne({
        _school: teacher._school,
        _class,
        _teacher: id,
      });
      if (!TeacherAssignClass) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not assigned to this class" });
      }

      // Check if the student is assigned to the class
      const student = await User.findOne({
        _id: studentId,
        _class,
        loginType: "student",
        _school: teacher._school,
      });

      if (!student) {
        return res.status(400).json({
          error: true,
          reason: "Student is not assigned to this class",
        });
      }

      const today = moment().startOf("day");

      // Find the attendance record for today for this class
      let attendanceRecord = await Attendance.findOne({
        _class,
        date: {
          $gte: today.toDate(),
          $lte: moment(today).endOf("day").toDate(),
        },
        _school: teacher._school,
      });

      if (attendanceRecord) {
        if (attendanceRecord.presentIds.includes(studentId)) {
          return res.status(400).json({
            error: true,
            reason: "Student has already been marked present",
          });
        }

        attendanceRecord.presentIds.push(studentId);
        await attendanceRecord.save();

        return res.status(200).json({
          error: false,
          message: `${studentId} has been marked present`,
          attendance: attendanceRecord,
        });
      } else {
        // If no attendance record exists, create a new one
        attendanceRecord = new Attendance({
          _school: teacher._school,
          _class,
          _teacher: req.user.id,
          presentIds: [studentId],
          date: moment().toDate(),
        });
        await attendanceRecord.save();

        const classRecord = await Class.findOne({ _id: _class });
        if (classRecord) {
          classRecord.totalClassTill += 1;
          await classRecord.save();
        }
        return res.status(200).json({
          error: false,
          message: "Attendance created successfully",
          attendance: attendanceRecord,
        });
      }
    } catch (error) {
      return res.status(400).json({ error: true, reason: error.message });
    }
  },

  /**
   *
   * @api {get} /attendance/absent Get Absent Students
   * @apiName GetAbsentStudents
   * @apiGroup Attendance
   *
   * @apiHeader {String} Authorization Bearer token for admin or teacher access.
   *
   * @apiParam {String} _class The ID of the class for which absent students are being retrieved.
   * @apiParam {String} date The date for which the attendance is checked (in ISO format).
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "absentStudents": [
   *     {
   *       "_id": "60c72b2f9b1e8a3b4c3e4f6b",
   *       "roll": "001"
   *     },
   *     {
   *       "_id": "60c72b2f9b1e8a3b4c3e4f6c",
   *       "roll": "002"
   *     }
   *   ],
   *   "totalAbsent": 2
   * }
   *
   * @apiError (500) {Boolean} error Indicates whether there was an error (true).
   * @apiError (500) {String} Error Detailed error message.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "Error": "Internal Server Error"
   * }
   *
   */
  async getAbsentStudents(req, res) {
    try {
      const { _class, date } = req.body;
      const { id } = req.user; //admin id

      //check admin or not

      const admin = await User.findOne({
        _id: id,
        loginType: { $in: ["teacher", "admin"] },
      });

      if (admin.loginType === "admin") {
        if (admin === null) {
          return res
            .status(400)
            .json({ error: false, reason: "you are not admin" });
        }
      }
      if (admin.loginType === "teacher") {
        if (admin === null) {
          return res
            .status(400)
            .json({ error: false, reason: "you are not teacher" });
        }
      }

      // find attendance for the specific class and date
      const attendanceDate = moment(date).startOf("day");
      console.log("attendanceDate", attendanceDate);

      const attendance = await Attendance.findOne({
        _class,
        date: { $gte: attendanceDate.toDate() },
        _school: req.user._school,
      });
      console.log("Attendance", attendance);

      const students = await User.find({
        _class,
        loginType: "student",
        _school: req.user._school,
      });
      // Identify absent students
      const absentStudents = [];
      students.forEach((student) => {
        if (!attendance.presentIds.includes(student._id)) {
          absentStudents.push({
            _id: student._id,
            roll: student.rollNo,
          });
        }
      });

      return res.status(200).json({
        error: false,
        absentStudents,
        totalAbsent: absentStudents.length,
      });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error });
    }
  },

  /**
   *
   * @api {get} /attendance/percentage Student_Attendance_Percentage
   * @apiName GetStudentAttendancePercentage
   * @apiGroup Attendance
   *
   * @apiParam {String} studentId The ID of the student for whom the attendance percentage is being requested.
   *
   * @apiSuccess {String} student.id The unique ID of the student.
   * @apiSuccess {String} student.name The full name of the student.
   * @apiSuccess {String} student.rollNo The roll number of the student.
   * @apiSuccess {String} student.attendancePercentage The attendance percentage of the student.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "student": {
   *     "id": "60c72b2f9b1e8a3b4c3e4f6b",
   *     "name": "John Doe",
   *     "rollNo": "001",
   *     "attendancePercentage": "75.00%"
   *   }
   * }
   *
   * @apiError (404) {Boolean} error Indicates whether there was an error (true).
   * @apiError (404) {String} message Error message for not found student or class.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Student not found"
   * }
   *
   * @apiError (500) {Boolean} error Indicates whether there was an error (true).
   * @apiError (500) {String} message Detailed error message.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Internal Server Error"
   * }
   *
   */
  async getStudentAttendancePercentage(req, res) {
    try {
      const { studentId } = req.body;

      // Step 1: Find the student in the database
      const student = await User.findOne({
        _id: studentId,
        loginType: "student",
      }).populate("_class");

      if (!student) {
        return res
          .status(404)
          .json({ error: true, message: "Student not found" });
      }

      const studentClass = await Class.findOne({
        _id: student._class,
      });

      if (!studentClass) {
        return res
          .status(404)
          .json({ error: true, message: "Class not found" });
      }

      // Calculate attendance percentage
      const totalClasses = studentClass.totalClassTill;
      const attendedClasses = await Attendance.countDocuments({
        presentIds: student._id,
        _class: student._class,
      });

      if (totalClasses === 0) {
        return res.status(200).json({
          error: false,
          message: "No classes have been held yet.",
          attendancePercentage: "0%",
        });
      }

      const attendancePercentage = (
        (attendedClasses / totalClasses) *
        100
      ).toFixed(2);

      return res.status(200).json({
        error: false,
        student: {
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
          rollNo: student.rollNo,
          attendancePercentage: `${attendancePercentage}%`,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   *
   * @api {get} /attendance/viewattendance View Attendance Records
   * @apiName ViewAttendance
   * @apiGroup Attendance
   *
   * @apiHeader {String} Authorization Bearer token for student access.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "attendanceStatus": [
   *     {
   *       "date": "2024-10-01T00:00:00.000Z",
   *       "isPresent": true
   *     },
   *     {
   *       "date": "2024-10-02T00:00:00.000Z",
   *       "isPresent": false
   *     }
   *   ]
   * }
   *
   * @apiError (403) {Boolean} error Indicates whether there was an error (true).
   * @apiError (403) {String} reason Error message for not being a student.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "You are not a student"
   * }
   *
   * @apiError (404) {Boolean} error Indicates whether there was an error (true).
   * @apiError (404) {String} message Message indicating no attendance records were found.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": false,
   *   "message": "No attendance records found."
   * }
   *
   * @apiError (400) {Boolean} error Indicates whether there was an error (true).
   * @apiError (400) {String} reason Detailed error message.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "Internal Server Error"
   * }
   *
   */
  async viewAttendance(req, res) {
    try {
      const { id } = req.user;

      const student = await User.findOne({ _id: id, loginType: "student" });
      if (!student) {
        return res
          .status(403)
          .json({ error: true, reason: "You are not a student" });
      }

      let attendanceRecords = await Attendance.find({
        _class: student._class,
        _school: student._school,
      });

      attendanceRecords = attendanceRecords.filter((record) => record.date);
      if (!attendanceRecords || attendanceRecords.length === 0) {
        return res
          .status(404)
          .json({ error: false, message: "No attendance records found." });
      }

      const attendanceStatus = attendanceRecords.map((record) => {
        const isPresent = record.presentIds.includes(student._id);
        return {
          date: record.date,
          isPresent,
        };
      });

      return res.status(200).json({
        error: false,
        attendanceStatus,
      });
    } catch (error) {
      return res.status(400).json({ error: true, reason: error.message });
    }
  },

  /**
   * @api {post} /attendance/checkin Teacher Check-In
   * @apiName TeacherCheckIn
   * @apiGroup Attendance
   *
   * @apiHeader {String} Authorization Bearer token for teacher access.
   *
   * @apiParam {Object} location Coordinates of the teacher's check-in location.
   * @apiParam {Date} date The date and time of the check-in.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *   "location": {
   *     "coordinates": [88.4352966284463, 22.574465111576152]
   *   },
   *   "date": "2024-10-01T10:00:00Z"
   * }
   *
   * @apiSuccess {String} message Success message indicating check-in success.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "message": "Check-in successful"
   * }
   *
   * @apiError (404) {Boolean} error Indicates whether there was an error (true).
   * @apiError (404) {String} message Error message for teacher not found.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Teacher not found"
   * }
   *
   * @apiError (400) {Boolean} error Indicates whether there was an error (true).
   * @apiError (400) {String} error Message indicating the teacher is not within the radius.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": "Teacher is not within the 50-meter radius"
   * }
   *
   * @apiError (500) {Boolean} error Indicates whether there was an error (true).
   * @apiError (500) {String} error Message indicating internal server error.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": "Internal server error"
   * }
   *
   */

  async teacherCheckIn(req, res) {
    try {
      const { location, date } = req.body;
      const { id, _school } = req.user;
      // Find the school by id
      const teacher = await User.findOne({ _id: id, loginType: "teacher" });
      if (teacher === null) {
        return res
          .status(404)
          .json({ error: true, message: "Teacher not found" });
      }
      const school = await School.findOne({ _id: _school });

      const schoolLocation = school.location.coordinates;
      console.log("schoolLocation", schoolLocation);

      // Check if the teacher is within a 50-meter radius
      const distanceCheck = await CheckIn.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: schoolLocation },
            distanceField: "dist.calculated",
            maxDistance: 50, // 50 meters
            spherical: true,
          },
        },
        {
          $match: { "location.coordinates": location.coordinates },
        },
      ]);
      console.log(distanceCheck.length);

      if (distanceCheck.length > 0) {
        await CheckIn.create({
          teachers: { _teacher: id, time: moment(date).format("HH:mm:ss") },
          checkInDate: date,
          _school,
        });

        return res.status(200).json({ message: "Check-in successful" });
      } else {
        return res
          .status(400)
          .json({ error: "Teacher is not within the 50-meter radius" });
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async updateAttendance(req, res) {
    try {
      const { _class, studentId, action, date } = req.body;
      const { id } = req.user;

      // Check if the user is a teacher
      const teacher = await User.findOne({
        _id: id,
        loginType: "teacher",
      }).exec();

      if (!teacher) {
        return res.status(400).json({
          error: true,
          reason: "You are not a teacher",
        });
      }

      const targetDate = date
        ? moment(date).startOf("day")
        : moment().startOf("day");

      if (!targetDate.isValid()) {
        return res.status(400).json({
          error: true,
          reason: "Invalid date provided",
        });
      }

      // Find the attendance record for the target date
      let attendanceRecord = await Attendance.findOne({
        _class,
        date: {
          $gte: targetDate.toDate(),
          $lte: moment(targetDate).endOf("day").toDate(),
        },
        _school: teacher._school,
      }).exec();

      if (!attendanceRecord) {
        return res.status(404).json({
          error: true,
          reason: `No attendance record found for ${targetDate.format(
            "MMMM Do YYYY"
          )}`,
        });
      }

      // Check if the student is assigned to the class
      const student = await User.findOne({
        _id: studentId,
        _class,
        loginType: "student",
        _school: teacher._school,
      }).exec();

      if (!student) {
        return res.status(400).json({
          error: true,
          reason: "Student is not assigned to this class",
        });
      }

      if (action === "add") {
        if (attendanceRecord.presentIds.includes(studentId)) {
          return res.status(400).json({
            error: true,
            reason: "Student has already been marked present",
          });
        }

        attendanceRecord.presentIds.push(studentId);
      } else if (action === "remove") {
        if (!attendanceRecord.presentIds.includes(studentId)) {
          return res.status(400).json({
            error: true,
            reason: "Student was not marked present",
          });
        }

        attendanceRecord.presentIds = attendanceRecord.presentIds.filter(
          (id) => id.toString() !== studentId
        );
      } else {
        return res.status(400).json({
          error: true,
          reason: "Invalid action provided. Use 'add' or 'remove'",
        });
      }

      await attendanceRecord.save();

      return res.status(200).json({
        error: false,
        message: `Attendance for ${targetDate.format(
          "MMMM Do YYYY"
        )} successfully updated. Student ${
          action === "add" ? "added to" : "removed from"
        } attendance`,
        attendance: attendanceRecord,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        reason: error.message,
      });
    }
  },
};
