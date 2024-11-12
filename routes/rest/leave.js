const Leave = require("../../models/leave");
const User = require("../../models/user/index");

module.exports = {
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
          .exec();
        const totalLeaves = await Leave.countDocuments({ _school });

        return res.status(200).json({ error: false, leaves, totalLeaves });
      }

      if (loginType === "teacher") {
        const leaves = await Leave.find({ _school, _teacher: id })
          .sort({ createdAt: -1 })
          .skip(skipNumber)
          .limit(Number(pageSize))
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
   * @apiGroup Leaves
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
      const { loginType, _school } = req.user;
      let { searchText, pageNumber = 1, pageSize = 10 } = req.body;

      if (!(loginType === "teacher")) {
        return res
          .status(403)
          .json({ error: true, reason: "you are not teacher" });
      }

      const skipNumber = (pageNumber - 1) * pageSize;

      let query = {
        _teacher: req.user._id,
        _school,
      };

      if (searchText) {
        const searchRegex = new RegExp(searchText.trim(), "i");
        query.$or = [
          { leaveType: { $regex: searchRegex } },
          { reason: { $regex: searchRegex } },
          { status: { $regex: searchRegex } },
        ];
      }

      const [leaves] = await Promise.all([
        Leave.find(query).skip(skipNumber).limit(Number(pageSize)).exec(),
      ]);

      if (leaves.length === 0) {
        return res.status(404).json({ error: true, reason: "Not found" });
      }

      return res.status(200).json({ error: false, leaves });
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message });
    }
  },

  /**
   * @api {post} /teacher/leave Apply Leave
   * @apiDescription Allows teachers to apply for leave by providing the necessary details.
   * @apiVersion 1.0.0
   * @apiGroup Leaves
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
      const { leaveType, startDate, endDate, reason, isHalfDay } = req.body;
      const { loginType, _school } = req.user;

      if (loginType !== "teacher")
        return res
          .status(400)
          .json({ error: true, reason: "you are not teacher" });

      if (startDate === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "startDate is required" });
      }
      if (endDate === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "endDate is required" });
      }
      if (reason === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "reason is required" });
      }

      if (!(leaveType === undefined || isHalfDay === undefined)) {
        return res.status(400).json({
          error: true,
          reason: "'leaveType' or 'isHalfDay' is required",
        });
      }
      if (leaveType)
        if (!["PL", "CL", "SL"].includes(leaveType)) {
          return res.status(400).json({
            error: true,
            message: "Invalid leave type. Must be one of CL, PL, or SL",
          });
        }

      const leave = new Leave({
        _school,
        _teacher: req.user._id,
        leaveType,
        startDate,
        endDate,
        reason,
        isHalfDay,
        appliedDate: new Date(),
      });

      await leave.save();
      return res
        .status(201)
        .json({ error: false, message: "Leave applied successfully", leave });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * @api {post} /leave/get Get Leaves
   * @apiDescription Fetches leave applications for teachers or all teachers by admin. Teachers can filter their leaves based on leave type and status, while admins can view leaves for specific teachers or filter by leave type and status.
   * @apiVersion 1.0.0
   * @apiGroup Leaves
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
