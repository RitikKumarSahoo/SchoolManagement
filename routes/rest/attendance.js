const User = require("../../models/user");
const School = require("../../models/school");
const Class = require("../../models/class");
const Attendance = require("../../models/attendance");
const moment = require("moment");
module.exports = {
  // get all students for a specific class that the assigned teacher
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

  // admin assign class to teacher
  async assignClass(req, res) {
    try {
      const { _class, _teacher, _school } = req.body;
      const { id } = req.user;

      const admin = await User.findOne({
        _id: id,
        loginType: "admin",
      });

      if (!admin) {
        return res
          .status(403)
          .json({ error: true, message: "You are not an admin" });
      }

      // Check if the teacher exists
      const teacher = await User.findOne({
        _id: _teacher,
        loginType: "teacher",
      });

      if (!teacher) {
        return res
          .status(404)
          .json({ error: true, message: "Teacher not found" });
      }
      //  Check already assign or not
      const attendance = await Attendance.findOne({
        _class,
        _school,
      });

      if (!attendance) {
        attendance = new Attendance({
          _class,
          _school,
          _teacher,
        });
        await attendance.save();
        return res.status(201).json({
          error: false,
          message: "Class successfully assigned to teacher",
          attendance,
        });
      }
      if (attendance._teacher && attendance._teacher.toString() === _teacher) {
        return res.status(409).json({
          error: true,
          message: "This class is already assigned to this teacher",
        });
      }
      attendance._teacher = _teacher;
      await attendance.save();

      return res.status(200).json({
        error: false,
        message: "Class successfully assigned to teacher",
        attendance,
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  // mark attendance
  // async markAttendance(req, res) {
  //   try {
  //     const { _class, studentId } = req.body;
  //     const { id } = req.user;

  //     // check user is teacher or not
  //     const teacher = await User.findOne({
  //       _id: id,
  //       loginType: "teacher",
  //     });
  //     if (teacher === null) {
  //       return res
  //         .status(400)
  //         .json({ error: true, reason: "you are not teacher" });
  //     }
  //     console.log("teacher----", teacher);

  //     // check teacher is assigned to  class or not
  //     const TeacherAssignClass = await Attendance.findOne({
  //       _school: teacher._school,
  //       _class,
  //       _teacher: id,
  //     });
  //     if (TeacherAssignClass === null) {
  //       return res
  //         .status(400)
  //         .json({ error: true, reason: "You are not assigned to this class" });
  //     }
  //     console.log("TeacherAssignClass--------", TeacherAssignClass);

  //     // find the specific student assigned to the class
  //     const student = await User.findOne({
  //       _id: studentId,
  //       _class,
  //       loginType: "student",
  //       _school: teacher._school,
  //     });

  //     if (student === null) {
  //       return res.status(400).json({
  //         error: true,
  //         reason: "Student is not assigned to this class",
  //       });
  //     }
  //     console.log("student----", student);

  //     //   Check if the student is already marked present for today
  //     const today = moment().startOf("day");

  //     const isAlreadyPresent = await Attendance.findOne({
  //       presentIds: studentId,
  //       _class,
  //       date: { $gte: today.toDate() },
  //       _school: teacher._school,
  //     });
  //     console.log("isAlreadypresent", isAlreadyPresent);
  //     if (isAlreadyPresent) {
  //       return res.status(400).json({
  //         error: true,
  //         reason: "Student has already been marked",
  //       });
  //     }

  //     const response = new Attendance.save({
  //       _school: teacher._school,
  //       _class,
  //       _teacher: req.user.id,
  //       presentIds: [studentId],
  //       date: moment().toDate(),
  //     });
  //     await response.save();
  //     return res.status(200).json({ error: false, response });
  //   } catch (error) {
  //     return res.status(400).json({ error: true, reason: error.message });
  //   }
  // },
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

      // Get today's date without the time
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

        //  Increment totalClassTill for this class only once
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

  // check by admin
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
};
