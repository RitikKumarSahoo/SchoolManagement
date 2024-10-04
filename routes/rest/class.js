const Class = require("../../models/class");
const User = require("../../models/user");
const School = require("../../models/school");
const Attendance = require("../../models/attendance");
//get all students for specific class

module.exports = {
  //get all classes assigned to teacher
  /**
   * @api {get} /class/getallassignclass Get All Assigned Classes
   * @apiName GetAllAssignedClasses
   * @apiGroup Class
   *
   * @apiHeader {String} Authorization Bearer token for teacher access.
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error (false).
   * @apiSuccess {Object[]} assignedClasses List of classes assigned to the teacher.
   * @apiSuccess {String} assignedClasses._id Class ID.
   * @apiSuccess {String} assignedClasses.name Name of the class.
   * @apiSuccess {String} assignedClasses.section Section of the class.
   * @apiSuccess {Number} assignedClasses.academicYear Academic year of the class.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "assignedClasses": [
   *     {
   *       "_id": "60d5f60c9b4d7635e8aebaf6",
   *       "name": "Class 10",
   *       "section": "A",
   *       "academicYear": 2024
   *     },
   *     {
   *       "_id": "60d5f60c9b4d7635e8aebaf7",
   *       "name": "Class 12",
   *       "section": "B",
   *       "academicYear": 2024
   *     }
   *   ]
   * }
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "You are not teacher"
   * }
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "No assigned classes found for this teacher"
   * }
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "Error": "Internal server error"
   * }
   *
   */
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
