const moment = require('moment');
const Notice = require("../../models/notice.js");
const agenda = require("../../agenda");

module.exports = {
  /**
   * Fetch all the Notices
   * @api {get} /notices 1.0 Fetch all the Notices
   * @apiName fetchNotices
   * @apiGroup Notice
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     notices: [{}]
   * }
   */
  async findAllNotices(req, res) {
    try {
      const  role  = req.user.loginType;
      if (role !== "admin") {
        return res.status(403).json({ error: true, reason: "Unauthorized" });
      }
      
      const notices = await Notice.find({}).exec();
      return res.json({ error: false, notices });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
  },

  /**
   * Find a Notice by _id
   * @api {get} /notice/:id 2.0 Find a Notice by _id
   * @apiName getNotice
   * @apiGroup Notice
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Notice to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     notice: {}
   * }
   */
  async get(req, res) {
    try {

      const  role  = req.user.loginType;
      if (role !== "admin") {
        return res.status(403).json({ error: true, reason: "Unauthorized" });
      }
      
      const notice = await Notice.findOne({ _id: req.params.id }).exec();
      if (!notice) return res.status(400).json({ error: true, reason: "No such Notice!" });
      return res.json({ error: false, notice });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
  },

  /**
   * Create a new Notice
   * @api {post} /notice 3.0 Create a new Notice
   * @apiName createNotice
   * @apiGroup Notice
   * @apiPermission Admin/Teacher
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} [title] Notice title
   * @apiParam  {String} [description] Notice description
   * @apiParam  {String} [noticeType] Notice noticeType `enum=["student", "teacher", "general"]`
   * @apiParam  {Boolean} [isUrgent=false] Notice isUrgent
   * @apiParam  {ObjectID} [postedBy] Notice postedBy
   * @apiParam  {Date} [expireDate] Notice expireDate
   * @apiParam  {Object} [attachments] Notice attachments
   * @apiParam  {String} [attachments.url] Notice attachments.url
   * @apiParam  {String} [attachments.fileName] Notice attachments.fileName
   * @apiParam  {Boolean} [isActive=true] Notice isActive
   * @apiParam  {Date} [postedDate] Notice postedDate
   * @apiParam  {String} [signatureOfTeacherUrl] Notice signatureOfTeacherUrl
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     notice: {}
   * }
   */
  async post(req, res) {
    try {
      const  role  = req.user.loginType; // Assuming role is provided from JWT payload.
      const {
        _school,
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
      if (!expireDate) {
        return res.status(400).json({ error: true, reason: "Expire date is required" });
      }

      // const postedDate = moment().format('DD/MM/YYYY HH:mm');
      const postedBy = req.user._id; 
      // Create the notice
      const notice = await Notice.create({
        _school,
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
      agenda.schedule(new Date(expireDate), "deactivate notice", { noticeId: notice._id });
      
      return res.json({ error: false, notice });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
  },

  /**
   * Edit a Notice by _id
   * @api {put} /notice/:id 4.0 Edit a Notice by _id
   * @apiName editNotice
   * @apiGroup Notice
   * @apiPermission Admin/Teacher
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Notice to edit
   *
   * @apiParam  {String} [title] Notice title
   * @apiParam  {String} [description] Notice description
   * @apiParam  {String} [noticeType] Notice noticeType `enum=["student", "teacher", "general"]`
   * @apiParam  {Boolean} [isUrgent=false] Notice isUrgent
   * @apiParam  {ObjectID} [postedBy] Notice postedBy
   * @apiParam  {Date} [expireDate] Notice expireDate
   * @apiParam  {Object} [attachments] Notice attachments
   * @apiParam  {String} [attachments.url] Notice attachments.url
   * @apiParam  {String} [attachments.fileName] Notice attachments.fileName
   * @apiParam  {Boolean} [isActive=true] Notice isActive
   * @apiParam  {Date} [postedDate] Notice postedDate
   * @apiParam  {String} [signatureOfTeacherUrl] Notice signatureOfTeacherUrl
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     notice: {}
   * }
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
      return res.json({ error: false, notice });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
  },

  /**
   * Delete a Notice by _id
   * @api {delete} /notice/:id 5.0 Delete a Notice by _id
   * @apiName deleteNotice
   * @apiGroup Notice
   * @apiPermission Admin/Teacher
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Notice to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
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

      await Notice.deleteOne({ _id: id }).exec();
      console.log("Notice deleted successfully.");
      
      return res.json({ error: false });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
  },

  
};
