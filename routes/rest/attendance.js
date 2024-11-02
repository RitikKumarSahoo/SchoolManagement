const User = require("../../models/user");
const School = require("../../models/school");
const Class = require("../../models/class");
const Attendance = require("../../models/attendance");
const CheckIn = require("../../models/teachersCheckin");
const Settings = require("../../models/settings");
const moment = require("moment");

module.exports = {
  /**
   * @api {post} /class/students Get Class Students
   * @apiName Get Class Students
   * @apiGroup Class
   *
   * @apiHeader {String} Authorization Bearer token for access.
   *
   * @apiParam {String} classname The name of the class.
   * @apiParam {String} section The section of the class. Example: "A".
   * @apiParam {String} academicYear The academic year for the class. Example: "2024".
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "students": [
   *     {
   *       "_id": "670cf6badbb09a7c2b2af9b2",
   *       "firstName": "Pratik",
   *       "lastName": "Sahu",
   *       "email": "pk2181121@gmail.com",
   *       "phone": "09981240192",
   *       "gender": "Male",
   *       "currentYear": "2024"
   *     }
   *   ],
   *   "classId": "670cf194dbb09a7c2b2af991"
   * }
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "You are not teacher"
   * }
   */

  async getClassStudentsForAttendance(req, res) {
    try {
      const { classname, section, academicYear, schoolId } = req.body;
      const { loginType, isSuperAdmin } = req.user;

      if (
        !(
          loginType === "teacher" ||
          loginType === "admin" ||
          isSuperAdmin === true
        )
      ) {
        return res.status(400).json({
          error: true,
          reason: "you do not have permission to access",
        });
      }

      const classExist = await Class.findOne({
        name: classname,
        section,
        academicYear,
        _school: isSuperAdmin === true ? schoolId : req.user._school,
      });
      if (classExist === null) {
        return res.status(400).json({ error: true, reason: "class not found" });
      }

      const students = await User.find({
        _class: classExist._id,
        loginType: "student",
        _school: isSuperAdmin === true ? schoolId : req.user._school,
      })
        .select("_id RollNo name gender phone firstName lastName email")
        .lean();

      const totalStudents = await students.countDocuments();

      return res
        .status(200)
        .json({
          error: false,
          students,
          totalStudents,
          classId: classExist._id,
        });
    } catch (error) {
      return res.status(400).json({ error: true, reason: error });
    }
  },

  /**
   *
   * @api {post} /markattendance  Mark Student Attendance
   * @apiName MarkAttendance
   * @apiGroup Attendance
   *
   * @apiHeader {String} Authorization Bearer token for teacher access.
   *
   * @apiParam {String} _class The ID of the class for which attendance is being marked.
   * @apiParam {String} [studentIds] The ID of the students:array format(presentIds)
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "message": "Student has been marked present",
   *   "attendanceRecord":[
   *   {
   *     "_id": "60c72b2f9b1e8a3b4c3e4f6c",
   *     "rollNo":"1",
   *     "isPresent": true,
   *     "presentIds": ["60c72b2f9b1e8a3b4c3e4f6b",]
   *   },
   *  {
   *     "_id": "60c72b2f9b1e8a3b4c3e4fcd",
   *     "rollNo":"2",
   *     "isPresent": false,
   *     "presentIds": ["60c72b2f9b1e8a3b4c3e4f6b"]
   *   }
   *   ]
   * "date": "2024-10-26T18:30:00.000Z"
   * }
   *
   */
  async markAttendance(req, res) {
    try {
      const { _class, studentIds } = req.body;
      const { id, loginType } = req.user;

      if (!(loginType === "teacher" || loginType === "admin")) {
        return res.status(200).json({
          error: true,
          reason: "you do not have permission to take attendance",
        });
      }
      const classExist = await Class.findOne({ _id: _class });
      if (classExist === null) {
        return res.status(400).json({ error: true, reason: "class not found" });
      }

      const today = moment().startOf("day");

      let attendance = await Attendance.findOne({
        _class,
        date: {
          $gte: today.toDate(),
          $lte: moment(today).endOf("day").toDate(),
        },
      });

      const classStudents = await User.find({ _class }).select("_id rollNo");

      const attendanceRecord = classStudents.map((student) => ({
        _id: student._id,
        rollNo: student.rollNo,
        isPresent: studentIds.includes(student._id.toString()),
      }));

      if (attendance !== null) {
        attendance.presentIds = studentIds;
        await attendance.save();
      } else {
        attendance = await Attendance.create({
          _school: req.user._school,
          _class,
          _teacher: id,
          presentIds: studentIds,
          date: today.toDate(),
        });

        classExist.totalClassTill += 1;
        await classExist.save();
      }

      return res
        .status(200)
        .json({ error: false, attendanceRecord, date: attendance.date });
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

      const student = await User.findOne({
        _id: id,
        loginType: { $in: ["student", "admin"] },
      });
      if (!student) {
        return res.status(403).json({ error: true, reason: "no permission" });
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
   * @api {put} /attendance/update Update Attendance
   * @apiName UpdateAttendance
   * @apiGroup Attendance
   * @apiPermission admin, teacher
   *
   * @apiDescription Allows both teachers and admins to update attendance for a class.
   * The update can be for the current day or a previous day. The action can either add a student to the present list or remove them.
   *
   * @apiHeader {String} Authorization Bearer token.
   *
   * @apiParam {String} _class The ID of the class.
   * @apiParam {String} studentId The ID of the student whose attendance is being updated.
   * @apiParam {String} action The action to perform, either "add" (to mark as present) or "remove" (to mark as absent).
   * @apiParam {String} [date] The date for which attendance is being updated (optional, defaults to today).
   *
   * @apiExample {json} Request Example:
   *     {
   *       "_class": "652def8a7a39a61056fb8654",
   *       "studentId": "652dc8b95a36b92434b54e88",
   *       "action": "add",
   *       "date": "2024-10-01"
   *     }
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error (false means success).
   * @apiSuccess {String} message The success message describing the action performed.
   * @apiSuccess {Object} attendance The updated attendance record.
   *
   * @apiSuccessExample {json} Success Response:
   *     {
   *       "error": false,
   *       "message": "Attendance for October 1st 2024 successfully updated. Student added to attendance",
   *       "attendance": {
   *         "_id": "652def8a7a39a61056fb8654",
   *         "_class": "652def8a7a39a61056fb8654",
   *         "presentIds": ["652dc8b95a36b92434b54e88"],
   *         "date": "2024-10-01T00:00:00.000Z",
   *         "_school": "652ce46b5b9634070e541dbc"
   *       }
   *     }
   *
   * @apiError {Boolean} error Indicates whether there was an error (true means failure).
   * @apiError {String} reason A description of the error that occurred.
   *
   * @apiErrorExample {json} Error Response (Student Not Assigned):
   *     {
   *       "error": true,
   *       "reason": "Student is not assigned to this class"
   *     }
   *
   * @apiErrorExample {json} Error Response (Unauthorized User):
   *     {
   *       "error": true,
   *       "reason": "You are not authorized to update attendance"
   *     }
   *
   * @apiErrorExample {json} Error Response (Invalid Action):
   *     {
   *       "error": true,
   *       "reason": "Invalid action provided. Use 'add' or 'remove'"
   *     }
   */

  async updateAttendance(req, res) {
    try {
      const { _class, studentId, action, date } = req.body;
      const { id } = req.user;

      // Check if the user is a teacher
      const teacher = await User.findOne({
        _id: id,
        loginType: { $in: ["teacher", "admin"] },
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

  /**
   * @api {post} attendance/checkin Check In
   * @apiName CheckIn
   * @apiGroup Attendance
   * @apiVersion 1.0.0
   *
   * @apiDescription Allows a teacher to check in at the school if they are within a 5km radius.
   * If they have already checked in today, they will not be allowed to check in again.
   *
   * @apiHeader {String} Authorization Bearer token of the teacher.
   *
   * @apiParam {Number[]} coordinates The current location of the teacher in the format [longitude, latitude].
   *
   * @apiSuccess {Boolean} error Indicates if there was an error.
   * @apiSuccess {String} message Success or error message.
   * @apiSuccess {Object} checkIn The check-in object containing details of the check-in.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "message": "Checked in successfully",
   *       "checkIn": {
   *         "_school": "school_id",
   *         "teachers": [
   *           {
   *             "_teacher": "teacher_id",
   *             "time": "2024-10-08T10:00:00.000Z",
   *             "remark": "Checked in successfully"
   *           }
   *         ],
   *         "checkinDate": "2024-10-08T10:00:00.000Z"
   *       }
   *     }
   *
   * @apiError TeacherNotFound The teacher was not found in the system.
   * @apiError SchoolNotFound The school associated with the teacher was not found.
   * @apiError OutOfRadius The teacher is outside the 5km radius from the school.
   * @apiError AlreadyCheckedIn The teacher has already checked in today.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "message": "You are outside the 5km radius from the school."
   *     }
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "message": "Internal server error."
   *     }
   */

  async checkIn(req, res) {
    const { coordinates } = req.body;
    const teacherId = req.user._id;

    try {
      const teacher = await User.findOne({
        _id: teacherId,
        loginType: "teacher",
      }).populate("_school");

      if (teacher === null) {
        return res
          .status(400)
          .json({ error: true, message: "Teacher not found" });
      }

      const schoolId = teacher._school;
      const checkInRecord = await CheckIn.findOne({
        _school: schoolId,
        checkinDate: {
          $gte: moment().startOf("day").toDate(),
          $lte: moment().endOf("day").toDate(),
        },
      });

      const isWithinDistance = checkInRecord
        ? true
        : await School.findOne({
            _id: schoolId,
            location: {
              $nearSphere: {
                $geometry: { type: "Point", coordinates: coordinates },
                $maxDistance: 5000,
              },
            },
          });

      if (isWithinDistance === null) {
        return res.status(400).json({
          error: true,
          message: "You are outside the 5km radius from the school.",
        });
      }

      if (checkInRecord) {
        const existingTeacherCheckIn = checkInRecord.teachers.find(
          (t) => t._teacher.toString() === teacherId
        );

        if (existingTeacherCheckIn) {
          return res.status(400).json({
            error: true,
            message: "You have already checked in today.",
          });
        }

        // Update the existing check-in record
        checkInRecord.teachers.push({
          _teacher: teacherId,
          time: new Date(),
        });

        await checkInRecord.save();
        return res.status(200).json({
          error: false,
          checkIn: checkInRecord,
        });
      }

      const newCheckIn = await CheckIn.create({
        _school: schoolId,
        teachers: [
          {
            _teacher: teacherId,
            time: new Date(),
          },
        ],
        checkinDate: new Date(),
      });

      return res.status(200).json({
        error: false,
        message: "Checked in successfully.",
        checkIn: newCheckIn,
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * @api {get} /attendance/checkins Get Teacher Check-in Records
   * @apiName GetTeacherCheckIns
   * @apiGroup Attendance
   * @apiPermission Teacher
   * @apiDescription This endpoint returns the check-in attendance records of a teacher, showing which days they were present or absent.
   *
   * @apiHeader {String} Authorization Bearer token for teacher authentication.
   *
   * @apiSuccess {Boolean} error Indicates if the operation was successful (false for success).
   * @apiSuccess {Object[]} attendance Array of attendance records for the teacher.
   * @apiSuccess {String} attendance.date The date of the check-in.
   * @apiSuccess {Boolean} attendance.present Whether the teacher was present on that date.
   * @apiSuccess {String} attendance.time The exact check-in time if the teacher was present, null otherwise.
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "attendance": [
   *         {
   *           "date": "2024-10-01T00:00:00.000Z",
   *           "present": true,
   *           "time": "2024-10-01T09:15:00.000Z"
   *         },
   *         {
   *           "date": "2024-10-02T00:00:00.000Z",
   *           "present": false,
   *           "time": null
   *         },
   *         {
   *           "date": "2024-10-03T00:00:00.000Z",
   *           "present": true,
   *           "time": "2024-10-03T08:45:00.000Z"
   *         }
   *       ]
   *     }
   *
   * @apiError {Boolean} error Indicates if the operation was successful (true for failure).
   * @apiError {String} message Description of the error that occurred.
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "message": "Internal server error."
   *     }
   */

  async getTeacherCheckIns(req, res) {
    const teacherId = req.user._id;

    try {
      const checkIns = await CheckIn.find({
        "teachers._teacher": teacherId,
      }).select("checkinDate teachers");

      const attendanceRecords = checkIns.map((record) => {
        const teacherCheckIn = record.teachers.find(
          (t) => t._teacher.toString() === teacherId
        );

        return {
          date: record.checkinDate,
          present: teacherCheckIn ? true : false,
          time: teacherCheckIn ? teacherCheckIn.time : null,
        };
      });

      return res.status(200).json({
        error: false,
        attendance: attendanceRecords,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  },
};
