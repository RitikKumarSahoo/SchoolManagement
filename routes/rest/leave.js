const Leave = require("../../models/leave");
const User = require("../../models/user/index");

module.exports = {
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
