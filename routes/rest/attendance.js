const User = require("../../models/user");
const School = require("../../models/school");
const Class = require("../../models/class");
const Attendance = require("../../models/attendance");
const CheckIn = require("../../models/teachersCheckin");
const moment = require("moment");
const attendance = require("../../models/attendance");

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

  //student attendance percentage
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

  // student view their attendance
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
};
