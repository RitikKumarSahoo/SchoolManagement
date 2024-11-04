const moment = require('moment');
const Notice = require("../../models/notice.js");
const agenda = require("../../agenda/index.js");

module.exports = {
  /**
 * @api {post} /admin/notices/allnotices Fetch all notices
 * @apiName FetchNotices
 * @apiGroup Notices
 * @apiDescription Retrieve a list of notices based on the user's role and optional filters. Only active notices are returned.
 * 
 * @apiHeader {String} Authorization User's access token.
 * 
 * @apiParam {String} [type] (Admin only) Filter notices by type ("student", "teacher", or "general").
 * 
 * @apiSuccess {Boolean} error Indicates if there was an error.
 * @apiSuccess {Number} count The total number of notices matching the criteria.
 * @apiSuccess {Object[]} notices List of notice objects.
 * 
 * @apiError {Boolean} error Indicates if there was an error.
 * @apiError {String} reason The reason for the error.
 * 
 * @apiPermission admin
 * @apiPermission teacher
 * @apiPermission student
 *
 * @apiExample {json} Request Example (Admin):
 *     {
 *       "type": "teacher"
 *     }
 * 
 * @apiExample {json} Response Example:
 *     {
 *       "error": false,
 *       "count": 5,
 *       "notices": [
 *         {
 *           "_id": "634d2c347f5b9c23388b5c61",
 *           "title": "Upcoming Exam",
 *           "description": "Exam details for students",
 *           "noticeType": "student",
 *           "isActive": true,
 *           "postedBy": "634b2c238f9a24388b5a1c51",
 *           "expireDate": "2024-12-31T00:00:00.000Z",
 *           "attachments": [],
 *           "postedDate": "2024-10-01T10:30:00.000Z",
 *           "signatureOfTeacherUrl": "https://example.com/signature.png"
 *         },
 *         ...
 *       ]
 *     }
 *
 * @apiErrorExample {json} Error Response (Unauthorized):
 *     {
 *       "error": true,
 *       "reason": "Unauthorized"
 *     }
 */

  async findAllNotices(req, res) {
    try {
      const role = req.user.loginType;
  
      let filter = { isActive: true };  // Only retrieve active notices

      if (role === "teacher") {
        // Teachers can only see "teacher" and "general" notices
        filter.noticeType = { $in: ["teacher", "general"] };
      } else if (role === "student") {
        // Students can only see "student" and "general" notices
        filter.noticeType = { $in: ["student", "general"] };
      } else if (role !== "admin") {
        // Unauthorized access if not admin, teacher, or student
        return res.status(403).json({ error: true, reason: "Unauthorized" });
      }

      // Only for admin, check if a specific type is provided in the body
      const { type } = req.body;
      if (role === "admin" && type && ["student", "teacher", "general"].includes(type)) {
        filter.noticeType = type;  // Override noticeType filter for admin if specific type is given
      }

      const [notices, count] = await Promise.all([
        Notice.find(filter).exec(),
        Notice.countDocuments(filter)
      ]);

      return res.json({ error: false, count, notices });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
},

  /**
 * @api {get} /admin/notice/getNotice/:id Get a specific notice by ID
 * @apiName GetNotice
 * @apiGroup Notice
 * 
 * @apiHeader {String} Authorization User's unique access token.
 * 
 * @apiParam {String} id Notice's unique ID.
 * 
 * @apiDescription This endpoint retrieves a specific notice by its ID. Access is restricted based on the user's role:
 * - Admins can view all types of notices.
 * - Teachers can view notices of type "teacher" and "general".
 * - Students can view notices of type "student" and "general".
 * 
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "error": false,
 *       "notice": {
 *         "_id": "12345",
 *         "title": "Important Update",
 *         "description": "This is an important notice",
 *         "noticeType": "general",
 *         "isUrgent": true,
 *         "postedBy": "67890",
 *         "expireDate": "2024-12-31T23:59:59.999Z",
 *         "attachments": [],
 *         "isActive": true,
 *         "postedDate": "2024-11-04T10:00:00.000Z",
 *         "signatureOfTeacherUrl": ""
 *       }
 *     }
 * 
 * @apiError (Error 400) {Boolean} error Indicates that an error occurred.
 * @apiError (Error 400) {String} reason Reason for the failure, such as "No such Notice!".
 * 
 * @apiError (Error 403) {Boolean} error Indicates that an error occurred.
 * @apiError (Error 403) {String} reason "Unauthorized" - The user does not have permission to view the requested notice.
 * 
 * @apiError (Error 500) {Boolean} error Indicates that an error occurred.
 * @apiError (Error 500) {String} reason The error message.
 * 
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": true,
 *       "reason": "No such Notice!"
 *     }
 */
  async get(req, res) {
    try {
      const role = req.user.loginType;
      const noticeId = req.params.id;
  
      // Define filter based on user role
      let filter = { _id: noticeId };
      if (role === "student") {
        // Students can only view "student" and "general" notices
        filter.noticeType = { $in: ["student", "general"] };
      } else if (role === "teacher") {
        // Teachers can only view "teacher" and "general" notices
        filter.noticeType = { $in: ["teacher", "general"] };
      } else if (role !== "admin") {
        // Any other roles are unauthorized
        return res.status(403).json({ error: true, reason: "Unauthorized" });
      }
  
      // Find the notice with the applied filter
      const notice = await Notice.findOne(filter).exec();
      if (!notice) return res.status(400).json({ error: true, reason: "No such Notice!" });
  
      return res.json({ error: false, notice });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
  },

  /**
 * @api {post} /admin/notice/createnotice Create Notice
 * @apiName CreateNotice
 * @apiGroup Notice
 * @apiDescription This route allows an admin or a teacher to create a notice. Teachers can only post notices for students.
 *
 * @apiHeader {String} Authorization User's access token.
 *
 * @apiParam (Request body) {String} title The title of the notice.
 * @apiParam (Request body) {String} description The description or content of the notice.
 * @apiParam (Request body) {String="student","teacher","general"} noticeType The type of the notice. Teachers can only create student notices.
 * @apiParam (Request body) {Boolean} [isUrgent] Indicates if the notice is urgent.
 * @apiParam (Request body) {Date} [expireDate] The expiration date of the notice.
 * @apiParam (Request body) {Array} [attachments] Array of attachment objects, each containing:
 * - `createdAt` (Date): Date when the attachment was added (optional, defaults to current date if not provided).
 * - `doctype` (String): Type of the document (e.g., PDF, image).
 * - `filename` (String): Name of the attachment file.
 * - `url` (String): URL where the attachment is stored.
 * @apiParam (Request body) {Boolean} [isActive=true] Indicates if the notice is currently active.
 * @apiParam (Request body) {String} [signatureOfTeacherUrl] URL to the teacher's signature (required if posted by a teacher).
 *
 * @apiExample {json} Request-Example:
 *     {
 *       "title": "School Assembly",
 *       "description": "Mandatory attendance for all students.",
 *       "noticeType": "student",
 *       "isUrgent": true,
 *       "expireDate": "2024-11-30T00:00:00Z",
 *       "attachments": [
 *         {
 *           "createdAt": "2024-11-04T10:30:00Z",
 *           "doctype": "pdf",
 *           "filename": "assembly_schedule.pdf",
 *           "url": "https://example.com/assembly_schedule.pdf"
 *         }
 *       ],
 *       "isActive": true,
 *       "signatureOfTeacherUrl": "https://example.com/signature.png"
 *     }
 *
 * @apiError (Error 4xx) 403 Unauthorized Only admins or teachers can create notices.
 * @apiError (Error 4xx) 403 Teachers can only post notices for students.
 * @apiError (Error 5xx) 500 Internal Server Error.
 */
  async post(req, res) {
    try {
      const  role  = req.user.loginType; // Assuming role is provided from JWT payload.
      const {
        title,
        description,
        noticeType,
        isUrgent,
        expireDate,
        attachments,
        isActive,
        signatureOfTeacherUrl,
      } = req.body;

      // Validation for roles
      if (role !== "admin" && role !== "teacher") {
        return res.status(403).json({ error: true, reason: "Unauthorized" });
      }

      // Teachers can only post notices for students.
      if (role === "teacher" && noticeType !== "student") {
        return res
          .status(403)
          .json({ error: true, reason: "Teachers can only post student notices" });
      }

      // Expiration date is required
      // if (!expireDate) {
      //   return res.status(400).json({ error: true, reason: "Expire date is required" });
      // }

      // const postedDate = moment().format('DD/MM/YYYY HH:mm');
      const postedBy = req.user._id; 
      // Create the notice
      const notice = await Notice.create({
        _school: req.user._school,
        title,
        description,
        noticeType,
        isUrgent,
        postedBy,
        expireDate,
        attachments,
        isActive: isActive ?? true,
        postedDate: new Date().toISOString(),
        signatureOfTeacherUrl,
      });

      // Schedule the deactivation of the notice using Agenda
      // agenda.schedule(new Date(expireDate), "deactivate notice", { noticeId: notice._id });
      
      return res.json({ error: false, notice });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
  },

  /**
 * @api {put} /admin/notice/editnotice/:id Update Notice
 * @apiName UpdateNotice
 * @apiGroup Notice
 * @apiPermission admin, teacher
 * 
 * @apiDescription Updates an existing notice. Only the admin or the teacher who posted the notice can make changes. 
 * If the expiration date (`expireDate`) is modified, the associated scheduled agenda job will be rescheduled accordingly.
 *
 * @apiParam {String} id Notice unique ID.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {String} [title] The title of the notice.
 * @apiBody {String} [description] Detailed description of the notice.
 * @apiBody {String="student","teacher","general"} [noticeType] Type of the notice (student, teacher, or general).
 * @apiBody {Boolean} [isUrgent] Indicates if the notice is urgent.
 * @apiBody {String} [postedBy] The ID of the user who posted the notice.
 * @apiBody {Date} [expireDate] Expiration date of the notice.
 * @apiBody {Object} [attachments] Attachments associated with the notice.
 * @apiBody {String} [attachments.url] URL of the attachment.
 * @apiBody {String} [attachments.fileName] File name of the attachment.
 * @apiBody {Boolean} [isActive] Indicates if the notice is active.
 * @apiBody {Date} [postedDate] The date the notice was posted.
 * @apiBody {String} [signatureOfTeacherUrl] URL of the teacher's signature if provided.
 *
 * @apiSuccess {Boolean} error Indicates if there was an error.
 * @apiSuccess {Object} notice Updated notice object.
 *
 * @apiError (400) {Boolean} error Indicates if there was an error.
 * @apiError (400) {String} reason Reason for the error (e.g., "No such Notice!" if the notice does not exist).
 *
 * @apiError (403) {Boolean} error Indicates if there was an error.
 * @apiError (403) {String} reason Reason for the error (e.g., "Unauthorized" if the user does not have permission to edit the notice).
 *
 * @apiError (500) {Boolean} error Indicates if there was a server error.
 * @apiError (500) {String} reason Error message.
 *
 * @apiExample {json} Request Example:
 *     PUT /admin/notice/editnotice/123456789
 *     {
 *       "title": "Updated Notice Title",
 *       "description": "This is an updated description for the notice.",
 *       "expireDate": "2024-12-31T23:59:59Z",
 *       "isUrgent": true,
 *       "attachments": {
 *         "url": "https://example.com/attachment.pdf",
 *         "fileName": "attachment.pdf"
 *       },
 *       "isActive": true
 *     }
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "error": false,
 *       "notice": {
 *         "_id": "123456789",
 *         "title": "Updated Notice Title",
 *         "description": "This is an updated description for the notice.",
 *         "expireDate": "2024-12-31T23:59:59Z",
 *         "isUrgent": true,
 *         "attachments": {
 *           "url": "https://example.com/attachment.pdf",
 *           "fileName": "attachment.pdf"
 *         },
 *         "isActive": true,
 *         "postedDate": "2024-11-04T12:00:00Z",
 *         "postedBy": "987654321",
 *         "noticeType": "student",
 *         "signatureOfTeacherUrl": "https://example.com/signature.png"
 *       }
 *     }
 *
 * @apiErrorExample {json} Error Response (No Notice Found):
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": true,
 *       "reason": "No such Notice!"
 *     }
 *
 * @apiErrorExample {json} Error Response (Unauthorized):
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": true,
 *       "reason": "Unauthorized"
 *     }
 */
  async put(req, res) {
    try {
      const { loginType, _id } = req.user; // Assuming role and userId are provided from JWT payload.
      const { id } = req.params;
      const {
        title,
        description,
        noticeType,
        isUrgent,
        postedBy,
        expireDate,
        attachments,
        isActive,
        postedDate,
        signatureOfTeacherUrl,
      } = req.body;
  
      const notice = await Notice.findOne({ _id: id }).exec();
      if (!notice) {
        return res.status(400).json({ error: true, reason: "No such Notice!" });
      }
  
      // Only admin or the teacher who posted can edit the notice
      if (loginType !== "admin" && !(loginType === "teacher" && notice.postedBy.equals(_id))) {
        return res.status(403).json({ error: true, reason: "Unauthorized" });
      }
  
      // Check if expireDate is updated and cancel the previous job if necessary
      let expireDateChanged = false;
      if (expireDate && expireDate !== notice.expireDate.toISOString()) {
        expireDateChanged = true;
      }
  
      // Update notice fields
      if (title !== undefined) notice.title = title;
      if (description !== undefined) notice.description = description;
      if (noticeType !== undefined) notice.noticeType = noticeType;
      if (isUrgent !== undefined) notice.isUrgent = isUrgent;
      if (postedBy !== undefined) notice.postedBy = postedBy;
      if (expireDate !== undefined) notice.expireDate = expireDate;
      if (attachments !== undefined && attachments.url !== undefined) notice.attachments.url = attachments.url;
      if (attachments !== undefined && attachments.fileName !== undefined) notice.attachments.fileName = attachments.fileName;
      if (isActive !== undefined) notice.isActive = isActive;
      if (postedDate !== undefined) notice.postedDate = postedDate;
      if (signatureOfTeacherUrl !== undefined) notice.signatureOfTeacherUrl = signatureOfTeacherUrl;
  
      await notice.save();
  
      // If expireDate was changed, cancel the existing job and schedule a new one
      // if (expireDateChanged) {
      //   await agenda.cancel({ name: "deactivate notice", "data.noticeId": id });
      //   await agenda.schedule(new Date(expireDate), "deactivate notice", { noticeId: id });
      // }
  
      return res.json({ error: false, notice });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
  },

  /**
 * @api {delete} /admin/notice/deletenotice/:id Delete Notice
 * @apiName DeleteNotice
 * @apiGroup Notice
 * @apiDescription Deletes a specific notice. Only accessible by admin or the teacher who posted the notice.
 *
 * @apiParam {String} id The ID of the notice to be deleted.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "error": false,
 *       "message": "Notice deleted successfully",
 *       "noticeId": "609e127e60b5f5095c4d2f14"
 *     }
 *
 * @apiError (403) Unauthorized If the user is not an admin or the original posting teacher.
 * @apiError (400) BadRequest If the notice with the specified ID does not exist.
 * @apiError (500) InternalServerError If an unexpected error occurs during deletion.
 *
 * @apiErrorExample {json} Unauthorized:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": true,
 *       "reason": "Unauthorized"
 *     }
 *
 * @apiErrorExample {json} NoNoticeFound:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": true,
 *       "reason": "No such Notice!"
 *     }
 *
 * @apiErrorExample {json} InternalServerError:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": true,
 *       "reason": "An error message explaining the issue"
 *     }
 */

  async delete(req, res) {
    try {
      const { loginType, _id } = req.user; // Assuming role and userId are provided from JWT payload.
      const { id } = req.params;

      const notice = await Notice.findOne({ _id: id }).exec();
      if (!notice) {
        return res.status(400).json({ error: true, reason: "No such Notice!" });
      }

      // Only admin or the teacher who posted can delete the notice
      if (loginType !== "admin" && !(loginType === "teacher" && notice.postedBy.equals(_id))) {
        return res.status(403).json({ error: true, reason: "Unauthorized" });
      }
      //Delete the notice parmanently
      // await Notice.deleteOne({ _id: id }).exec();

      // Soft delete or permanently delete
    notice.isActive = false;
    await notice.save();
      
      return res.json({ error: false, message:"Notice deleted Succesfully", noticeId: id });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
  },

  
};
