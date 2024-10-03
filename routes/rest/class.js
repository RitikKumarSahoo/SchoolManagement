const Class = require("../../models/class");
const User = require("../../models/user");
const School = require("../../models/school");
const Attendance = require("../../models/attendance");
//get all students for specific class

module.exports = {
  //get all classes assigned to teacher
  async getAllAssignedClasses(req, res) {
    try {
      const { id, loginType } = req.user;

      if (!(loginType === "teacher")) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not teacher" });
      }
      console.log(id, loginType);

      const attendanceRecords = await Attendance.find({
        _teacher: id,
        _school: req.user._school,
      }).populate("_class", "_id name section academicYear");

      if (attendanceRecords.length === 0) {
        return res.status(404).json({
          error: true,
          message: "No assigned classes found for this teacher",
        });
      }

      const assignedClasses = attendanceRecords.map((record) => record._class);
      return res.status(200).json({
        error: false,
        assignedClasses,
      });
    } catch (error) {
      return res.status(400).json({ error: true, Error: error.message });
    }
  },
};
