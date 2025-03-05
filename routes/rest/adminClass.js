const User = require("../../models/user");
const School = require("../../models/school");
const Schedule = require("../../models/schedule");
const randomstring = require("randomstring");
const mail = require("../../lib/mail");
const Class = require("../../models/class");
const Attendance = require("../../models/attendance");
module.exports = {
  /**
   * @api {post} /class/create Create a New Class
   * @apiName CreateClass
   * @apiGroup Class
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {String} name Name of the class.
   * @apiParam {String} section Section of the class.
   * @apiParam {String} academicYear Academic year for the class.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "classResponse": {
   *     "_id": "60d5f60c9b4d7635e8aebaf6",
   *     "name": "Class 10",
   *     "section": "A",
   *     "academicYear": 2024,
   *     "_school": "60d5f60c9b4d7635e8aebaf5"
   *   },
   *   "name_section": "Class 10A"
   * }
   *
   * @apiError ClassAlreadyExists Class with the same name and section already exists.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Class with this name and section already exists."
   * }
   *
   * @apiError Unauthorized You are not authorized to create a class.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "You are not admin"
   * }
   *
   * @apiError InternalServerError Internal server error.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "error": "Internal server error"
   * }
   */
  async Post(req, res) {
    try {
      const { name, section, academicYear } = req.body;

      const { id } = req.user;

      //find school from admin
      const user = await User.findOne({
        _id: id,
        isAdmin: true,
      }).select("_school");

      if (user === null) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not admin" });
      }

      // Check if class already exists
      const existingClass = await Class.findOne({
        name,
        section,
        academicYear,
      });
      if (existingClass) {
        return res.status(409).json({
          message: "Class with this name and section already exists.",
        });
      }

      // // check for valid year
      // const isValidAcademicYear = moment(
      //   academicYear,
      //   "YYYY-YYYY",
      //   true
      // ).isValid();
      // if (!isValidAcademicYear) {
      //   return res
      //     .status(400)
      //     .json({ message: "Invalid academic year format. Use YYYY-YYYY." });
      // }

      const classReponse = await Class.create({
        name,
        section,
        academicYear,
        _school: user._school,
      });
      await Attendance.create({
        _school: user._school,
        _class: classReponse._id,
      });

      const name_section = name.trim() + section;
      return res.status(200).json({
        error: false,
        classReponse,
        name_section,
      });
    } catch (error) {
      return res.status(500).json({ error: true, error });
    }
  },

  /**
   * @api {get} /class/find Search Classes
   * @apiName FindClasses
   * @apiGroup Class
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {String} [name] Name of the class to search for.
   * @apiParam {String} [section] Section of the class to search for.
   * @apiParam {String} [academicYear] Academic year to filter classes.
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error (false).
   * @apiSuccess {Array} data Array of classes that match the search criteria.
   * @apiSuccess {Number} classCounts Total number of classes that match the criteria.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "data": [
   *     {
   *       "_id": "60d5f60c9b4d7635e8aebaf7",
   *       "name": "Mathematics",
   *       "section": "A",
   *       "academicYear": "2023-2024"
   *     }
   *   ],
   *   "classCounts": 1
   * }
   *
   * @apiError NotAdmin You are not an admin.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "You are not an admin"
   * }
   *
   * @apiError NoClassesFound No classes found for the given criteria.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "No classes found for the given criteria."
   * }
   *
   * @apiError InternalServerError Internal server error.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "Internal server error"
   * }
   */
  async find(req, res) {
    try {
      const { name, section, academicYear } = req.query;

      const user = await User.findOne({
        _id: req.user.id,
        isAdmin: true,
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: true, message: "You are not an admin" });
      }

      let query = { _school: req.user._school };
      if (academicYear) {
        query.academicYear = academicYear;
      }
      if (name && section) {
        query.name = name;
      }

      const classes = await Class.find(query);
      if (classes.length === 0) {
        return res.status(404).json({
          error: true,
          message: "No classes found for the given criteria.",
        });
      }

      const classCounts = await Class.countDocuments(query).exec();

      return res.status(200).json({
        error: false,
        data: classes,
        classCounts,
      });
    } catch (error) {
      return res.status(400).json({ error: true, reason: error.message });
    }
  },

  /**
   * @api {get} /class/get/:id Get Class by ID
   * @apiName GetClassById
   * @apiGroup Class
   * @apiPermission AuthenticatedUser
   *
   * @apiDescription This endpoint retrieves a class by its ID. Only authenticated users who belong to the same school can access this resource.
   *
   * @apiParam {String} id The unique identifier of the class to retrieve (passed as a URL parameter).
   *
   * @apiSuccess {String} data._id The ID of the class.
   * @apiSuccess {String} data.name The name of the class.
   * @apiSuccess {String} data.section The section of the class.
   * @apiSuccess {Number} data.academicYear The academic year of the class.
   * @apiSuccess {Number} data.totalStudents Total number of students in the class.
   * @apiSuccess {ObjectId} data._schedule Reference to the schedule object.
   * @apiSuccess {ObjectId} data._school Reference to the school object.
   *
   * @apiError (404) {Boolean} error Indicates an error occurred (true means error).
   * @apiError (404) {String} message Error message stating that the class was not found.
   *
   * @apiError (500) {Boolean} error Indicates an error occurred (true means error).
   * @apiError (500) {String} reason Detailed error message for server-side issues.
   *
   * @apiHeader {String} Authorization Bearer token for user authentication.
   *
   */

  async get(req, res) {
    try {
      const classData = await Class.findOne({
        _id: req.params.id,
        _school: req.user._school,
      });

      if (classData === null) {
        return res.status(404).json({
          error: true,
          message: "Class not found",
        });
      }

      return res.status(200).json({
        error: false,
        message: "Class retrieved successfully",
        data: classData,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        reason: error.message,
      });
    }
  },

  /**
   * @api {post} /class/assignclass Assign Class to Teacher
   * @apiName AssignClass
   * @apiGroup Class
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {ObjectId} _class ID of the class to be assigned.
   * @apiParam {ObjectId} _teacher ID of the teacher to whom the class is being assigned.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "message": "Class successfully assigned to teacher",
   *   "attendance": {
   *     "_id": "60d5f60c9b4d7635e8aebaf6",
   *     "_class": "60d5f60c9b4d7635e8aebaf7",
   *     "_school": "60d5f60c9b4d7635e8aebaf5",
   *     "_teacher": "60d5f60c9b4d7635e8aebaf8"
   *   }
   * }
   *
   * @apiError NotAdmin You are not an admin.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "You are not an admin"
   * }
   *
   * @apiError TeacherNotFound The specified teacher does not exist.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Teacher not found"
   * }
   *
   * @apiError ClassAlreadyAssigned This class is already assigned to the specified teacher.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "This class is already assigned to this teacher"
   * }
   *
   * @apiError InternalServerError Internal server error.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Internal server error"
   * }
   */
  async assignClass(req, res) {
    try {
      const { _class, _teacher } = req.body;
      const { id } = req.user;

      const admin = await User.findOne({
        _id: id,
        loginType: "admin",
      });
      console.log("admin------", admin);

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
      console.log("teacher-------", teacher);

      if (!teacher) {
        return res
          .status(404)
          .json({ error: true, message: "Teacher not found" });
      }
      //  Check already assign or not
      const attendance = await Attendance.findOne({
        _class,
        _school: admin._school,
      });

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

  getData(req,res) {
    res.send("<h1>Auto Scaling Demo App </h1> <h4> Message: Success </h4>")
  }
};
