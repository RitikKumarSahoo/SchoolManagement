const Leave = require("../../models/leave");
const User = require("../../models/user/index");
const Settings = require("../../models/settings")
const moment = require("moment")

module.exports = {

  /**
 * @api {get} /remainingleave Get Teacher Remaining Leave
 * @apiName GetRemainingLeave
 * @apiGroup Leave
 * @apiPermission Teacher
 * 
 * @apiDescription Retrieve the remaining leave for the logged-in teacher.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {Object} user User object containing remaining leave details.
 * @apiSuccess {Object} user.remainingLeave Leave details.
 * @apiSuccess {Number} user.remainingLeave.CL Casual Leave .
 * @apiSuccess {Number} user.remainingLeave.PL Privilege Leave.
 * @apiSuccess {Number} user.remainingLeave.SL Sick Leave .
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "error": false,
 *       "user": {
 *         "remainingLeave": {
 *           "CL": 2,
 *           "PL": 7,
 *           "SL": 6
 *         }
 *       }
 *     }
 *
 * @apiErrorExample {json} Unauthorized (Not a Teacher):
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": true,
 *       "reason": "You are not teacher"
 *     }
 *
 * @apiErrorExample {json} Internal Server Error:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": true,
 *       "Error": "Some internal error message"
 *     }
 */

  async remainingLeave(req, res) {
    const { _id, loginType } = req.user
    try {
      if (loginType !== "teacher") {
        return res.status(400).json({ error: true, reason: "You are not teacher" })
      }
      const user = await User.findOne({ _id: req.user._id }).select("remainingLeave").exec()

      return res.status(200).json({ error: false, user })
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message })
    }
  },

  /**
   * @api {post} /leavestatus/:id Update Leave Status
   * @apiName UpdateLeaveStatus
   * @apiGroup Leave
   * @apiPermission Admin
   *
   * @apiDescription Update the status of a leave request. Only admins can perform this action.
   *
   * @apiParam {String} id Leave request ID.
   *
   * @apiBody {String} status Status of the leave request. Must be one of "approved", "rejected", or "cancelled".
   *
   * @apiExample {json} Request Example:
   *     PUT /leave/12345
   *     {
   *       "status": "approved"
   *     }
   *
   * @apiSuccessExample {json} Success Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "leave": {
   *         "_id": "673356750726b5a7972c4516",
   *         "_school": "670cc3c55aa29e2e31348c7e",
   *         "_teacher": "670cf24bdbb09a7c2b2af9a0",
   *         "leaveType": "SL",
   *         "startDate": "2024-11-06T00:00:00.000Z",
   *         "endDate": "2024-11-15T00:00:00.000Z",
   *         "reason": "All Test",
   *         "status": "approved",
   *         "appliedDate": "2024-11-12T13:21:57.549Z",
   *         "createdAt": "2024-11-12T13:21:57.550Z",
   *         "updatedAt": "2024-11-13T08:05:01.360Z",
   *         "__v": 0
   *       }
   *     }
   *
   * @apiErrorExample {json} Error Response (Not Admin):
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You are not admin"
   *     }
   *
   * @apiErrorExample {json} Error Response (Invalid Status):
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "message": "Invalid leave type. Must be one of approved, rejected, or cancelled"
   *     }
   */

  async leaveStatus(req, res) {
    try {
      const { loginType, _school } = req.user;
      const { id } = req.params;
      const { status } = req.body;

      if (loginType !== "admin") {
        return res
          .status(400)
          .json({ error: true, reason: "You are not admin" });
      }
      if (status === undefined || status === "" || status === null) {
        return res
          .status(400)
          .json({ error: false, reason: `Field 'status' is required` });
      }

      const leave = await Leave.findOne({ _id: id });
      if (leave === null) {
        return res.status(400).json({ error: true, reason: "Leave not found" });
      }

      if (!["approved", "rejected", "cancelled"].includes(status)) {
        return res.status(400).json({
          error: true,
          message:
            "Invalid leave type. Must be one of approved, rejected, or cancelled",
        });
      }

      leave.status = status;
      await leave.save();

      return res.status(200).json({ error: false, leave });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },
  /**
   * @api {get} /leave/:id Retrieve Leave by ID
   * @apiName GetLeave
   * @apiGroup Leave
   * @apiVersion 1.0.0
   *
   * @apiParam {String} id Leave unique ID.
   *
   * @apiSuccessExample {json} Success Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "leave": {
   *         "_id": "6724d6a7eaa09a9de7c7e922",
   *         "_school": "671a88862e586338c6c94516",
   *         "_teacher": "671f435dadf7c71b57b7927d",
   *         "startDate": "2024-11-10T00:00:00.000Z",
   *         "endDate": "2024-11-12T00:00:00.000Z",
   *         "reason": "due to health issue",
   *         "status": "pending",
   *         "appliedDate": "2024-11-01T13:24:55.270Z",
   *         "isHalfDay": true,
   *         "__v": 0
   *       }
   *     }
   *
   * @apiErrorExample {json} Leave Not Found:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "leave not found"
   *     }
   *
   * @apiErrorExample {json} Server Error:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "Error": "error message"
   *     }
   */
  async get(req, res) {
    try {
      const { id } = req.params;
      const leave = await Leave.findOne({ _id: id });

      if (leave === undefined)
        return res.status(400).json({ error: true, reason: "leave not found" });

      return res.status(200).json({ error: false, leave });
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },
  /**
   * @api {post} /leaves Get all leaves
   * @apiName GetAllLeaves
   * @apiGroup Leave
   * @apiPermission admin, teacher
   *
   * @apiDescription This endpoint retrieves a paginated list of leave records. Admins can view all leaves within their school, while teachers can view only their own leave records.
   *
   * @apiHeader {String} Authorization Bearer token required for authentication.
   *
   * @apiBody {Number} [pageNumber=1] Page number for pagination (optional).
   * @apiBody {Number} [pageSize=10] Number of records per page (optional).
   *
   * @apiError (400) PermissionError No permission to access leaves.
   * @apiError (500) ServerError Internal server error.
   *
   * @apiSuccessExample {json} Success Response (admin):
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "leaves": [
   *         {
   *           "_id": "64a67f5a9a3c45e1d2c7b1e5",
   *           "_teacher": "64a678f7e6c9b0b7f0e8d456",
   *           "_school": "64a6715a9f1b24b8d2c7a5e7",
   *           "createdAt": "2024-11-01T10:00:00.000Z"
   *         },
   *         ...
   *       ],
   *       "totalLeaves": 50
   *     }
   *
   * @apiSuccessExample {json} Success Response (teacher):
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "leaves": [
   *         {
   *           "_id": "64a67f5a9a3c45e1d2c7b1e5",
   *           "_teacher": "64a678f7e6c9b0b7f0e8d456",
   *           "_school": "64a6715a9f1b24b8d2c7a5e7",
   *           "createdAt": "2024-11-01T10:00:00.000Z"
   *         }
   *       ],
   *       "totalLeaves": 10
   *     }
   *
   * @apiErrorExample {json} Error Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "No permission"
   *     }
   *
   * @apiErrorExample {json} Server Error Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": "Internal server error message"
   *     }
   */
  async allLeaves(req, res) {
    try {
      let { pageNumber = 1, pageSize = 10 } = req.body;
      const { loginType, _school, id } = req.user;

      const skipNumber = (pageNumber - 1) * pageSize;

      if (loginType === "admin") {
        const leaves = await Leave.find({ _school })
          .sort({ createdAt: -1 })
          .skip(skipNumber)
          .limit(Number(pageSize))
          .populate({ path: '_teacher', select: "firstName lastName phone email" })
          .exec();
        const totalLeaves = await Leave.countDocuments({ _school });

        return res.status(200).json({ error: false, leaves, totalLeaves });
      }

      if (loginType === "teacher") {
        const leaves = await Leave.find({ _school, _teacher: id })
          .sort({ createdAt: -1 })
          .skip(skipNumber)
          .limit(Number(pageSize))
          .populate({ path: '_teacher', select: "firstName lastName phone email" })
          .exec();
          
        const totalLeaves = await Leave.countDocuments({
          _school,
          _teacher: id,
        });
        return res.status(200).json({ error: false, leaves, totalLeaves });
      }

      return res.status(400).json({ error: true, reason: "No permission" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  /**
   * @api {post} /leave/find Find Teacher Leaves
   * @apiName FindTeacherLeaves
   * @apiGroup Leave
   * @apiPermission Teacher
   *
   * @apiDescription This endpoint allows teachers to retrieve their leave requests with optional filtering by leave type, reason, or status.
   *
   * @apiBody {String} [searchText] Optional search text to filter leaves based on leave type, reason, or status.
   * @apiBody {Number} [pageNumber=1] The page number for pagination.
   * @apiBody {Number} [pageSize=10] The number of records per page for pagination.
   *
   * @apiError {Boolean} error Indicates if there was an error (true if there was an error).
   * @apiError {String} reason The reason for the error.
   *
   * @apiErrorExample {json} Unauthorized Access
   *     HTTP/1.1 403 Forbidden
   *     {
   *       "error": true,
   *       "reason": "Unauthorized access. Only teachers can view this data."
   *     }
   *
   * @apiErrorExample {json} No Leaves Found
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": true,
   *       "reason": "No leaves found"
   *     }
   *
   * @apiErrorExample {json} Server Error
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "reason": "Error message"
   *     }
   */

  async find(req, res) {
    try {
      const { loginType, _school, _id: userId } = req.user;
      let { searchText = "", pageNumber = 1, pageSize = 10 } = req.body;

      // Validate pageNumber and pageSize
      pageNumber = parseInt(pageNumber, 10);
      pageSize = parseInt(pageSize, 10);

      if (isNaN(pageNumber) || pageNumber < 1 || isNaN(pageSize) || pageSize < 1) {
        return res
          .status(400)
          .json({ error: true, reason: "Invalid page number or page size" });
      }

      const skipNumber = (pageNumber - 1) * pageSize;

      let query = { _school };

      if (loginType === "teacher") {
        query._teacher = userId;
      }
      else if (loginType !== "admin") {
        return res
          .status(400)
          .json({ error: true, reason: "You do not have permission" });
      }

      if (searchText.trim()) {
        const searchRegex = new RegExp(searchText.trim(), "i");
        query.$or = [
          { leaveType: { $regex: searchRegex } },
          { reason: { $regex: searchRegex } },
          { status: { $regex: searchRegex } },
        ];
      }

      const leaves = await Leave.find(query)
        .skip(skipNumber)
        .limit(pageSize)
        .exec();

      return res.status(200).json({ error: false, leaves });
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message });
    }
  },


  /**
   * @api {post} /teacher/leave Apply Leave
   * @apiDescription Allows teachers to apply for leave by providing the necessary details.
   * @apiVersion 1.0.0
   * @apiGroup Leave
   *
   * @apiHeader {String} Authorization Bearer token for authentication
   *
   * @apiParam {String} leaveType Type of leave (CL, PL, SL).
   * @apiParam {Date} startDate Start date of the leave (required).
   * @apiParam {Date} endDate End date of the leave (required).
   * @apiParam {String} reason Reason for the leave (required).
   * @apiParam {Boolean} isHalfDay Indicates if the leave is a half day.
   *
   * @apiSuccessExample {json} Success Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "error": false,
   *       "message": "Leave applied successfully",
   *       "leave": {
   *         "_id": "leaveId",
   *         "_school": "schoolId",
   *         "_teacher": "teacherId",
   *         "leaveType": "CL",
   *         "startDate": "2024-11-01T00:00:00Z",
   *         "endDate": "2024-11-05T00:00:00Z",
   *         "reason": "Family function",
   *         "isHalfDay": false,
   *         "appliedDate": "2024-10-25T00:00:00Z"
   *       }
   *     }
   *
   * @apiErrorExample {json} Bad Request Response (Missing startDate):
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "startDate is required"
   *     }
   *
   * @apiErrorExample {json} Bad Request Response (Invalid leaveType):
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "message": "Invalid leave type. Must be one of CL, PL, or SL"
   *     }
   *
   * @apiErrorExample {json} Internal Server Error Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "message": "Error message describing the problem"
   *     }
   *
   * @apiExample {http} Example Request:
   *     POST /api/leaves/apply
   *     Authorization: Bearer <token>
   *     {
   *       "leaveType": "CL",
   *       "startDate": "2024-11-01",
   *       "endDate": "2024-11-05",
   *       "reason": "Family function",
   *       "isHalfDay": false
   *     }
   */



  async applyLeave(req, res) {
    try {
      const { leaveType, startDate, endDate, reason } = req.body;
      const { id: teacherId, loginType, _school } = req.user;

      if (loginType !== "teacher") {
        return res.status(403).json({ error: true, message: "Access restricted to teachers only." });
      }

      if (!leaveType || !startDate || !endDate || !reason) {
        return res.status(400).json({ error: true, message: "Missing required fields." });
      }

      if (!["PL", "CL", "SL"].includes(leaveType)) {
        return res.status(400).json({ error: true, message: "Invalid leave type." });
      }

      const start = moment(startDate, "DD/MM/YYYY");
      const end = moment(endDate, "DD/MM/YYYY");
      const today = moment();

      console.log(start, end);

      if (!start.isValid() || !end.isValid()) {
        return res.status(400).json({ error: true, message: "Invalid date format. Use DD/MM/YYYY." });
      }

      if (start.isBefore(today, "day")) {
        return res.status(400).json({ error: true, message: "Cannot apply for past dates." });
      }
      if (start.isAfter(end)) {
        return res.status(400).json({ error: true, message: "Start date cannot be after end date." });
      }

      const teacher = await User.findOne({ _id: teacherId });
      if (!teacher) {
        return res.status(404).json({ error: true, message: "Teacher not found." });
      }

      const settings = await Settings.findOne({ _school });
      if (!settings) {
        return res.status(404).json({ error: true, message: "School settings not found." });
      }

      const { holidays, leave } = settings;
      const holidayDates = holidays.map((h) => moment(h.date, "DD/MM/YYYY").format("YYYY-MM-DD"));

      const leaveQuota = leave.find((l) => l.type === leaveType)?.days || 0;
      const remainingLeave = teacher.remainingLeave?.[leaveType] || 0;

      if (remainingLeave <= 0) {
        return res.status(400).json({
          error: true,
          message: `No remaining ${leaveType} leave available.`,
        });
      }

      // Check for overlapping leaves
      const overlappingLeaves = await Leave.findOne({
        _teacher: teacherId,
        $or: [
          { startDate: { $lte: end.toDate() }, endDate: { $gte: start.toDate() } },
        ],
      });

      if (overlappingLeaves) {
        return res.status(400).json({
          error: true,
          message: "You have already applied for leave during this period.",
        });
      }

      let validLeaveDays = 0;

      for (let date = moment(start); date.isSameOrBefore(end); date.add(1, "days")) {
        const isSunday = date.isoWeekday() === 7;
        const isHoliday = holidayDates.includes(date.format("YYYY-MM-DD"));

        if (!isSunday && !isHoliday) {
          validLeaveDays++;
        }
      }

      if (validLeaveDays === 0) {
        return res.status(400).json({
          error: true,
          message: "All selected dates are Sundays or holidays. No valid leave days.",
        });
      }

      if (validLeaveDays > remainingLeave) {
        return res.status(400).json({
          error: true,
          message: `Insufficient leave. You have ${remainingLeave} ${leaveType} days remaining.`,
        });
      }

      const newLeave = new Leave({
        _teacher: teacherId,
        _school,
        leaveType,
        startDate: start.toDate(),
        endDate: end.toDate(),
        reason,
        appliedDate: new Date(),
        totalLeaves: validLeaveDays, // Include total leave days
      });

      await newLeave.save();

      teacher.remainingLeave[leaveType] -= validLeaveDays;
      await teacher.save();

      return res.status(201).json({
        error: false,
        message: "Leave applied successfully.",
        leaveDetails: {
          _id: newLeave._id,
          _teacher: newLeave._teacher,
          _school: newLeave._school,
          leaveType: newLeave.leaveType,
          startDate: newLeave.startDate,
          endDate: newLeave.endDate,
          reason: newLeave.reason,
          appliedDate: newLeave.appliedDate,
          totalLeaves: newLeave.totalLeaves,
        },
        remainingLeave: teacher.remainingLeave,
      });
    } catch (error) {
      console.error("Error in applyLeave:", error);
      return res.status(500).json({ error: true, message: "Internal server error." });
    }
  },


  /**
   * @api {post} /leave/get Get Leaves
   * @apiDescription Fetches leave applications for teachers or all teachers by admin. Teachers can filter their leaves based on leave type and status, while admins can view leaves for specific teachers or filter by leave type and status.
   * @apiVersion 1.0.0
   * @apiGroup Leave
   *
   * @apiHeader {String} Authorization Bearer token for authentication
   *
   * @apiParam {String} [leaveType] Filter leaves by leave type (e.g., CL, SL, PL).
   * @apiParam {String} [status] Filter leaves by status (e.g., pending, approved, etc.).
   * @apiParam {String} [teacherId] Filter by a specific teacher's ID (Admin Only).
   * @apiParam {Boolean} [isHalfDay] Filter by HalfDay
   *
   *
   * @apiSuccessExample {json} Success Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "leaves": [
   *         {
   *           "_id": "leaveId",
   *           "_school": "schoolId",
   *           "_teacher": "teacherId",
   *           "leaveType": "CL",
   *           "startDate": "2024-11-01T00:00:00Z",
   *           "endDate": "2024-11-05T00:00:00Z",
   *           "reason": "Family function",
   *           "status": "approved",
   *           "appliedDate": "2024-10-25T00:00:00Z",
   *           "approvedBy": "approverId"
   *         }
   *         // More leave objects...
   *       ]
   *     }
   *
   * @apiErrorExample {json} Bad Request Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You do not have permission"
   *     }
   *
   * @apiErrorExample {json} Internal Server Error Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "message": "Error message describing the problem"
   *     }
   *
   */

  async getLeaves(req, res) {
    try {
      const { _school, loginType, _id } = req.user;
      const { leaveType, status, teacherId, isHalfDay } = req.body;

      if (!(loginType === "admin" || loginType === "teacher")) {
        return res
          .status(400)
          .json({ error: true, reason: "You do not have permission" });
      }

      let query = { _school };
      if (loginType === "teacher") {
        query._teacher = _id;
        if (leaveType !== undefined) query.leaveType = leaveType;
        if (status !== undefined) query.status = status;
        if (isHalfDay !== undefined) query.isHalfDay = isHalfDay;
      }

      if (loginType === "admin") {
        if (leaveType !== undefined) query.leaveType = leaveType;
        if (status !== undefined) query.status = status;
        if (teacherId !== undefined) query._teacher = teacherId;
        if (isHalfDay !== undefined) query.isHalfDay = isHalfDay;
      }

      const leaves = await Leave.find(query);

      return res.status(200).json({ error: false, leaves });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
