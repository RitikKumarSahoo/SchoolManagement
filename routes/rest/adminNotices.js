const moment = require('moment');
const Notice = require("../../models/notice.js");
const agenda = require("../../agenda/index.js");
const { STS } = require("aws-sdk");

module.exports = {
 /**
 * @api {post} /notices Get all notices with pagination and filters
 * @apiName GetNotices
 * @apiGroup Notices
 * 
 * @apiParam {String} [searchString] Search term for filtering notices by title (optional).
 * @apiParam {Number} [pageNo=1] Page number for pagination (optional).
 * @apiParam {Number} [skipLimit=10] Number of items per page (optional).
 * @apiParam {Object} [dateRange] Date range filter (optional).
 * @apiParam {String} dateRange.start Start date for filtering notices. **(Required if dateRange is provided)**.
 * @apiParam {String} [dateRange.end] End date for filtering notices. **(Optional but must be provided with start)**.
 * @apiParam {String} [type] Filter notices by type (optional, can be "student", "teacher", "general").
 * 
 * @apiSuccess {Boolean} error `false` if the request was successful.
 * @apiSuccess {Number} count Total number of notices matching the filter.
 * @apiSuccess {Object[]} notices List of notices matching the filter.
 * @apiSuccess {Number} pageNo Current page number.
 * @apiSuccess {Number} skipLimit Number of notices per page.
 * @apiSuccess {Number} totalPages Total number of pages.
 * 
 * @apiError (400) {Boolean} error `true` if there is a bad request (e.g., missing start or end date).
 * @apiError (500) {Boolean} error `true` if there is a server error.
 * 
 * @apiExample {js} Example request:
 *     fetch("/notices", {
 *       method: "POST",
 *       headers: {
 *         "Content-Type": "application/json"
 *       },
 *       body: JSON.stringify({
 *         searchString: "Exam",
 *         pageNo: 1,
 *         skipLimit: 10,
 *         dateRange: {
 *           start: "2024-11-01",
 *           end: "2024-11-20"
 *         },
 *         type: "student"
 *       })
 *     });
 * 
 * @apiExample {js} Example response:
 * {
 *   "error": false,
 *   "count": 25,
 *   "notices": [
 *     {
 *       "title": "Important Exam Schedule",
 *       "noticeType": "student",
 *       "postedDate": "2024-11-01T00:00:00.000Z",
 *       "expireDate": "2024-11-30T23:59:59.999Z",
 *       "isActive": true
 *     },
 *     ...
 *   ],
 *   "pageNo": 1,
 *   "skipLimit": 10,
 *   "totalPages": 3
 * }
 * 
 * @apiError (400) {Boolean} error `true` if only an end date is provided without a start date.
 * @apiError (400) {String} reason Error message, e.g., "Please select both start and end dates".
 */

  async findAllNotices(req, res) {
    try {
        const role = req.user.loginType;

        // Pagination parameters from frontend
        const { 
            searchString = "", 
            pageNo = 1, 
            skipLimit = 10, 
            dateRange, 
            type 
        } = req.body;

        // Calculate the number of documents to skip
        const skip = (pageNo - 1) * skipLimit;

        // Default filter to fetch active notices for the user's school
        let filter = { 
            isActive: true, 
            _school: req.user._school // Restrict notices to the user's school
        };

        // Role-based filtering for notices based on type
        if (role === "teacher") {
            // Teachers can only see "teacher" and "general" notices
            filter.noticeType = { $in: ["teacher", "general"] };
        } else if (role === "student") {
            // Students can only see "student" and "general" notices
            filter.noticeType = { $in: ["student", "general"] };
        } else if (role === "admin") {
            // Admin can see all types of notices
            if (type && ["student", "teacher", "general"].includes(type)) {
                // If admin specifies a type, filter by that type
                filter.noticeType = type;
            }
            // If no type is specified, show all types (student, teacher, general)
        } else {
            // Unauthorized access if not admin, teacher, or student
            return res.status(403).json({ error: true, reason: "Unauthorized" });
        }

        // If type is provided by teacher or student, filter by that specific type
        if (role === "teacher" && type && ["teacher", "general"].includes(type)) {
            filter.noticeType = type; // Filter by provided type if teacher
        } else if (role === "student" && type && ["student", "general"].includes(type)) {
            filter.noticeType = type; // Filter by provided type if student
        }

        // console.log("Filter before date filter:", filter);

        // Apply search by title if provided
        if (searchString) {
            filter.title = { $regex: searchString, $options: "i" }; // Case-insensitive search
        }

        // Handle date filtering if dateRange is provided
        if (dateRange?.start && dateRange?.end) {
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);

            // Set the time of the start date to 00:00:00 (midnight) and end date to 23:59:59.999 (last moment of the day)
            startDate.setHours(0, 0, 0, 0); // Start date at midnight
            endDate.setHours(23, 59, 59, 999); // End date at the last millisecond of the day

            // Apply the range to both postedDate and expireDate
            filter.$or = [
                { postedDate: { $gte: startDate, $lte: endDate } },
                { expireDate: { $gte: startDate, $lte: endDate } },
            ];
        } else if (dateRange?.start) {
            // If only start date is provided, show all notices till current date
            const startDate = new Date(dateRange.start);
            startDate.setHours(0, 0, 0, 0); // Set the time to midnight for the start date

            // Filter notices starting from the provided start date till the current date
            const currentDate = new Date();
            currentDate.setHours(23, 59, 59, 999); // Set the current date time to the last moment of the day

            filter.$or = [
                { postedDate: { $gte: startDate, $lte: currentDate } },
                { expireDate: { $gte: startDate, $lte: currentDate } },
            ];
        } else if (dateRange?.end) {
            // If only end date is provided, return an error
            return res.status(400).json({
                error: true,
                reason: "Please select both start and end dates"
            });
        }

        console.log("Filter after date filtering:", filter);

        // Fetch notices with pagination and sorting
        const [notices, count] = await Promise.all([
            Notice.find(filter).sort({ postedDate: -1 }).skip(skip).limit(skipLimit).exec(),
            Notice.countDocuments(filter),
        ]);

        // Return the response with pagination info
        return res.json({
            error: false,
            count, // Total number of notices matching the filter
            notices, // The paginated notices
            pageNo, // Current page number
            skipLimit, // Number of notices per page
            totalPages: Math.ceil(count / skipLimit), // Total number of pages
        });
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
      if(notice.expireDate) agenda.schedule(new Date(expireDate), "deactivate notice", { noticeId: notice._id });
      
      
      return res.json({ error: false, notice });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
  },

  /**
   *
   * @api {get} /awstempcreds 5.0 login user get temporary aws key
   * @apiName GetAwsKey
   * @apiGroup Auth
   * @apiVersion  1.0.0
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiSuccessExample {type} Success-Response:
      {
        "error": false,
        "AccessKeyId": "ASIASNKPOZCACSWCVJPE",
        "SecretAccessKey": "f24Hso6+okCfeKZaqVM8dYxvT0puEOmKuEZVdIZ/",
        "SessionToken": "FwoGZXIvYXdzEF8aDJASmdZoWJj+lXCjtSJqdzhlJ7bJ9igMImED3xJ9uHKGoJzzM9Kx7iFzW97T+JCKf30hG5gvNwPAV1LaiG3Xp7jLOswS5jKhgXqsse4x5dMAp6YxF1QC++b+LRoaAiGOWEP6bxfhgJHUbLImcSOQYTYtN8CwzktWIyizzsnxBTIotfjCyhl7/bz+0oQau5HtZa7KWIro5NQeLDWmmXxOP6UWtZhmeVRTmw==",
        "Expiration": "2020-01-30T06:18:43.000Z"
      }
   *
   *
   */
  async getAwsKey(req, res) {
    try {
      const sts = new STS({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY})
      const { Credentials } = await sts.getSessionToken().promise()
      // CORS:
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.setHeader("Access-Control-Request-Method", "*")
      res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT")
      // res.setHeader("Access-Control-Allow-Headers", "*")
      res.setHeader("Access-Control-Allow-Headers", "authorization, origin, x-requested-with, x-http-method-override, content-type, Overwrite, Destination, Depth, User-Agent, Translate, Range, Content-Range, Timeout, X-File-Size, If-Modified-Since, X-File-Name, Cache-Control, Location, Lock-Token")
      if (req.method === "OPTIONS") {
        res.writeHead(200)
        return res.end()
      }

      return res.json({
        error: false,
        S3BucketName: process.env.AWS_BUCKET_NAME,
        S3Region: process.env.AWS_REGION,
        ...Credentials
      })
    } catch (err) {
      console.log("==> ERR generating temp AWS creds: ", err)
      return res.status(500).json({ error: true, reason: err.message })
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
      if (expireDateChanged) {
        await agenda.cancel({ name: "deactivate notice", "data.noticeId": id });
        await agenda.schedule(new Date(expireDate), "deactivate notice", { noticeId: id });
      }
  
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
