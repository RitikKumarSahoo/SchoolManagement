
const Schedule = require("../../models/schedule")

module.exports = {

  /**
   * Fetch all the Schedules
   * @api {get} /schedules 1.0 Fetch all the Schedules
   * @apiName fetchSchedules
   * @apiGroup Schedule
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     schedules: [{}]
   * }
   */
  async find(req, res) {
    try {
      const schedules = await Schedule.find({}).exec()
      return res.json({ error: false, schedules })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a Schedule by _id
   * @api {get} /schedule/:id 2.0 Find a Schedule by _id
   * @apiName getSchedule
   * @apiGroup Schedule
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Schedule to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     schedule: {}
   * }
   */
  async get(req, res) {
    try {
      const schedule = await Schedule.findOne({ _id: req.params.id }).exec()
      return res.json({ error: false, schedule })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new Schedule
   * @api {post} /schedule 3.0 Create a new Schedule
   * @apiName createSchedule
   * @apiGroup Schedule
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {Object} [routine] Schedule routine
   * @apiParam  {String} [routine.d1.first.subjectName] Schedule routine.d1.first.subjectName
   * @apiParam  {Date} [routine.d1.first.startTime] Schedule routine.d1.first.startTime
   * @apiParam  {Date} [routine.d1.first.endTime] Schedule routine.d1.first.endTime
   * @apiParam  {ObjectID} [routine.d1.first._teacher] Schedule routine.d1.first._teacher
   * @apiParam  {String} [routine.d1.second.subjectName] Schedule routine.d1.second.subjectName
   * @apiParam  {Date} [routine.d1.second.startTime] Schedule routine.d1.second.startTime
   * @apiParam  {Date} [routine.d1.second.endTime] Schedule routine.d1.second.endTime
   * @apiParam  {ObjectID} [routine.d1.second._teacher] Schedule routine.d1.second._teacher
   * @apiParam  {String} [routine.d1.third.subjectName] Schedule routine.d1.third.subjectName
   * @apiParam  {Date} [routine.d1.third.startTime] Schedule routine.d1.third.startTime
   * @apiParam  {Date} [routine.d1.third.endTime] Schedule routine.d1.third.endTime
   * @apiParam  {ObjectID} [routine.d1.third._teacher] Schedule routine.d1.third._teacher
   * @apiParam  {String} [routine.d1.fourth.subjectName] Schedule routine.d1.fourth.subjectName
   * @apiParam  {Date} [routine.d1.fourth.startTime] Schedule routine.d1.fourth.startTime
   * @apiParam  {Date} [routine.d1.fourth.endTime] Schedule routine.d1.fourth.endTime
   * @apiParam  {ObjectID} [routine.d1.fourth._teacher] Schedule routine.d1.fourth._teacher
   * @apiParam  {String} [routine.d1.fifth.subjectName] Schedule routine.d1.fifth.subjectName
   * @apiParam  {Date} [routine.d1.fifth.startTime] Schedule routine.d1.fifth.startTime
   * @apiParam  {Date} [routine.d1.fifth.endTime] Schedule routine.d1.fifth.endTime
   * @apiParam  {ObjectID} [routine.d1.fifth._teacher] Schedule routine.d1.fifth._teacher
   * @apiParam  {String} [routine.d1.sixth.subjectName] Schedule routine.d1.sixth.subjectName
   * @apiParam  {Date} [routine.d1.sixth.startTime] Schedule routine.d1.sixth.startTime
   * @apiParam  {Date} [routine.d1.sixth.endTime] Schedule routine.d1.sixth.endTime
   * @apiParam  {ObjectID} [routine.d1.sixth._teacher] Schedule routine.d1.sixth._teacher
   * @apiParam  {String} [routine.d2.first.subjectName] Schedule routine.d2.first.subjectName
   * @apiParam  {Date} [routine.d2.first.startTime] Schedule routine.d2.first.startTime
   * @apiParam  {Date} [routine.d2.first.endTime] Schedule routine.d2.first.endTime
   * @apiParam  {ObjectID} [routine.d2.first._teacher] Schedule routine.d2.first._teacher
   * @apiParam  {String} [routine.d2.second.subjectName] Schedule routine.d2.second.subjectName
   * @apiParam  {Date} [routine.d2.second.startTime] Schedule routine.d2.second.startTime
   * @apiParam  {Date} [routine.d2.second.endTime] Schedule routine.d2.second.endTime
   * @apiParam  {ObjectID} [routine.d2.second._teacher] Schedule routine.d2.second._teacher
   * @apiParam  {String} [routine.d2.third.subjectName] Schedule routine.d2.third.subjectName
   * @apiParam  {Date} [routine.d2.third.startTime] Schedule routine.d2.third.startTime
   * @apiParam  {Date} [routine.d2.third.endTime] Schedule routine.d2.third.endTime
   * @apiParam  {ObjectID} [routine.d2.third._teacher] Schedule routine.d2.third._teacher
   * @apiParam  {String} [routine.d2.fourth.subjectName] Schedule routine.d2.fourth.subjectName
   * @apiParam  {Date} [routine.d2.fourth.startTime] Schedule routine.d2.fourth.startTime
   * @apiParam  {Date} [routine.d2.fourth.endTime] Schedule routine.d2.fourth.endTime
   * @apiParam  {ObjectID} [routine.d2.fourth._teacher] Schedule routine.d2.fourth._teacher
   * @apiParam  {String} [routine.d2.fifth.subjectName] Schedule routine.d2.fifth.subjectName
   * @apiParam  {Date} [routine.d2.fifth.startTime] Schedule routine.d2.fifth.startTime
   * @apiParam  {Date} [routine.d2.fifth.endTime] Schedule routine.d2.fifth.endTime
   * @apiParam  {ObjectID} [routine.d2.fifth._teacher] Schedule routine.d2.fifth._teacher
   * @apiParam  {String} [routine.d2.sixth.subjectName] Schedule routine.d2.sixth.subjectName
   * @apiParam  {Date} [routine.d2.sixth.startTime] Schedule routine.d2.sixth.startTime
   * @apiParam  {Date} [routine.d2.sixth.endTime] Schedule routine.d2.sixth.endTime
   * @apiParam  {ObjectID} [routine.d2.sixth._teacher] Schedule routine.d2.sixth._teacher
   * @apiParam  {String} [routine.d3.first.subjectName] Schedule routine.d3.first.subjectName
   * @apiParam  {Date} [routine.d3.first.startTime] Schedule routine.d3.first.startTime
   * @apiParam  {Date} [routine.d3.first.endTime] Schedule routine.d3.first.endTime
   * @apiParam  {ObjectID} [routine.d3.first._teacher] Schedule routine.d3.first._teacher
   * @apiParam  {String} [routine.d3.second.subjectName] Schedule routine.d3.second.subjectName
   * @apiParam  {Date} [routine.d3.second.startTime] Schedule routine.d3.second.startTime
   * @apiParam  {Date} [routine.d3.second.endTime] Schedule routine.d3.second.endTime
   * @apiParam  {ObjectID} [routine.d3.second._teacher] Schedule routine.d3.second._teacher
   * @apiParam  {String} [routine.d3.third.subjectName] Schedule routine.d3.third.subjectName
   * @apiParam  {Date} [routine.d3.third.startTime] Schedule routine.d3.third.startTime
   * @apiParam  {Date} [routine.d3.third.endTime] Schedule routine.d3.third.endTime
   * @apiParam  {ObjectID} [routine.d3.third._teacher] Schedule routine.d3.third._teacher
   * @apiParam  {String} [routine.d3.fourth.subjectName] Schedule routine.d3.fourth.subjectName
   * @apiParam  {Date} [routine.d3.fourth.startTime] Schedule routine.d3.fourth.startTime
   * @apiParam  {Date} [routine.d3.fourth.endTime] Schedule routine.d3.fourth.endTime
   * @apiParam  {ObjectID} [routine.d3.fourth._teacher] Schedule routine.d3.fourth._teacher
   * @apiParam  {String} [routine.d3.fifth.subjectName] Schedule routine.d3.fifth.subjectName
   * @apiParam  {Date} [routine.d3.fifth.startTime] Schedule routine.d3.fifth.startTime
   * @apiParam  {Date} [routine.d3.fifth.endTime] Schedule routine.d3.fifth.endTime
   * @apiParam  {ObjectID} [routine.d3.fifth._teacher] Schedule routine.d3.fifth._teacher
   * @apiParam  {String} [routine.d3.sixth.subjectName] Schedule routine.d3.sixth.subjectName
   * @apiParam  {Date} [routine.d3.sixth.startTime] Schedule routine.d3.sixth.startTime
   * @apiParam  {Date} [routine.d3.sixth.endTime] Schedule routine.d3.sixth.endTime
   * @apiParam  {ObjectID} [routine.d3.sixth._teacher] Schedule routine.d3.sixth._teacher
   * @apiParam  {String} [routine.d4.first.subjectName] Schedule routine.d4.first.subjectName
   * @apiParam  {Date} [routine.d4.first.startTime] Schedule routine.d4.first.startTime
   * @apiParam  {Date} [routine.d4.first.endTime] Schedule routine.d4.first.endTime
   * @apiParam  {ObjectID} [routine.d4.first._teacher] Schedule routine.d4.first._teacher
   * @apiParam  {String} [routine.d4.second.subjectName] Schedule routine.d4.second.subjectName
   * @apiParam  {Date} [routine.d4.second.startTime] Schedule routine.d4.second.startTime
   * @apiParam  {Date} [routine.d4.second.endTime] Schedule routine.d4.second.endTime
   * @apiParam  {ObjectID} [routine.d4.second._teacher] Schedule routine.d4.second._teacher
   * @apiParam  {String} [routine.d4.third.subjectName] Schedule routine.d4.third.subjectName
   * @apiParam  {Date} [routine.d4.third.startTime] Schedule routine.d4.third.startTime
   * @apiParam  {Date} [routine.d4.third.endTime] Schedule routine.d4.third.endTime
   * @apiParam  {ObjectID} [routine.d4.third._teacher] Schedule routine.d4.third._teacher
   * @apiParam  {String} [routine.d4.fourth.subjectName] Schedule routine.d4.fourth.subjectName
   * @apiParam  {Date} [routine.d4.fourth.startTime] Schedule routine.d4.fourth.startTime
   * @apiParam  {Date} [routine.d4.fourth.endTime] Schedule routine.d4.fourth.endTime
   * @apiParam  {ObjectID} [routine.d4.fourth._teacher] Schedule routine.d4.fourth._teacher
   * @apiParam  {String} [routine.d4.fifth.subjectName] Schedule routine.d4.fifth.subjectName
   * @apiParam  {Date} [routine.d4.fifth.startTime] Schedule routine.d4.fifth.startTime
   * @apiParam  {Date} [routine.d4.fifth.endTime] Schedule routine.d4.fifth.endTime
   * @apiParam  {ObjectID} [routine.d4.fifth._teacher] Schedule routine.d4.fifth._teacher
   * @apiParam  {String} [routine.d4.sixth.subjectName] Schedule routine.d4.sixth.subjectName
   * @apiParam  {Date} [routine.d4.sixth.startTime] Schedule routine.d4.sixth.startTime
   * @apiParam  {Date} [routine.d4.sixth.endTime] Schedule routine.d4.sixth.endTime
   * @apiParam  {ObjectID} [routine.d4.sixth._teacher] Schedule routine.d4.sixth._teacher
   * @apiParam  {String} [routine.d5.first.subjectName] Schedule routine.d5.first.subjectName
   * @apiParam  {Date} [routine.d5.first.startTime] Schedule routine.d5.first.startTime
   * @apiParam  {Date} [routine.d5.first.endTime] Schedule routine.d5.first.endTime
   * @apiParam  {ObjectID} [routine.d5.first._teacher] Schedule routine.d5.first._teacher
   * @apiParam  {String} [routine.d5.second.subjectName] Schedule routine.d5.second.subjectName
   * @apiParam  {Date} [routine.d5.second.startTime] Schedule routine.d5.second.startTime
   * @apiParam  {Date} [routine.d5.second.endTime] Schedule routine.d5.second.endTime
   * @apiParam  {ObjectID} [routine.d5.second._teacher] Schedule routine.d5.second._teacher
   * @apiParam  {String} [routine.d5.third.subjectName] Schedule routine.d5.third.subjectName
   * @apiParam  {Date} [routine.d5.third.startTime] Schedule routine.d5.third.startTime
   * @apiParam  {Date} [routine.d5.third.endTime] Schedule routine.d5.third.endTime
   * @apiParam  {ObjectID} [routine.d5.third._teacher] Schedule routine.d5.third._teacher
   * @apiParam  {String} [routine.d5.fourth.subjectName] Schedule routine.d5.fourth.subjectName
   * @apiParam  {Date} [routine.d5.fourth.startTime] Schedule routine.d5.fourth.startTime
   * @apiParam  {Date} [routine.d5.fourth.endTime] Schedule routine.d5.fourth.endTime
   * @apiParam  {ObjectID} [routine.d5.fourth._teacher] Schedule routine.d5.fourth._teacher
   * @apiParam  {String} [routine.d5.fifth.subjectName] Schedule routine.d5.fifth.subjectName
   * @apiParam  {Date} [routine.d5.fifth.startTime] Schedule routine.d5.fifth.startTime
   * @apiParam  {Date} [routine.d5.fifth.endTime] Schedule routine.d5.fifth.endTime
   * @apiParam  {ObjectID} [routine.d5.fifth._teacher] Schedule routine.d5.fifth._teacher
   * @apiParam  {String} [routine.d5.sixth.subjectName] Schedule routine.d5.sixth.subjectName
   * @apiParam  {Date} [routine.d5.sixth.startTime] Schedule routine.d5.sixth.startTime
   * @apiParam  {Date} [routine.d5.sixth.endTime] Schedule routine.d5.sixth.endTime
   * @apiParam  {ObjectID} [routine.d5.sixth._teacher] Schedule routine.d5.sixth._teacher
   * @apiParam  {String} [routine.d6.first.subjectName] Schedule routine.d6.first.subjectName
   * @apiParam  {Date} [routine.d6.first.startTime] Schedule routine.d6.first.startTime
   * @apiParam  {Date} [routine.d6.first.endTime] Schedule routine.d6.first.endTime
   * @apiParam  {ObjectID} [routine.d6.first._teacher] Schedule routine.d6.first._teacher
   * @apiParam  {String} [routine.d6.second.subjectName] Schedule routine.d6.second.subjectName
   * @apiParam  {Date} [routine.d6.second.startTime] Schedule routine.d6.second.startTime
   * @apiParam  {Date} [routine.d6.second.endTime] Schedule routine.d6.second.endTime
   * @apiParam  {ObjectID} [routine.d6.second._teacher] Schedule routine.d6.second._teacher
   * @apiParam  {String} [routine.d6.third.subjectName] Schedule routine.d6.third.subjectName
   * @apiParam  {Date} [routine.d6.third.startTime] Schedule routine.d6.third.startTime
   * @apiParam  {Date} [routine.d6.third.endTime] Schedule routine.d6.third.endTime
   * @apiParam  {ObjectID} [routine.d6.third._teacher] Schedule routine.d6.third._teacher
   * @apiParam  {String} [routine.d6.fourth.subjectName] Schedule routine.d6.fourth.subjectName
   * @apiParam  {Date} [routine.d6.fourth.startTime] Schedule routine.d6.fourth.startTime
   * @apiParam  {Date} [routine.d6.fourth.endTime] Schedule routine.d6.fourth.endTime
   * @apiParam  {ObjectID} [routine.d6.fourth._teacher] Schedule routine.d6.fourth._teacher
   * @apiParam  {String} [routine.d6.fifth.subjectName] Schedule routine.d6.fifth.subjectName
   * @apiParam  {Date} [routine.d6.fifth.startTime] Schedule routine.d6.fifth.startTime
   * @apiParam  {Date} [routine.d6.fifth.endTime] Schedule routine.d6.fifth.endTime
   * @apiParam  {ObjectID} [routine.d6.fifth._teacher] Schedule routine.d6.fifth._teacher
   * @apiParam  {String} [routine.d6.sixth.subjectName] Schedule routine.d6.sixth.subjectName
   * @apiParam  {Date} [routine.d6.sixth.startTime] Schedule routine.d6.sixth.startTime
   * @apiParam  {Date} [routine.d6.sixth.endTime] Schedule routine.d6.sixth.endTime
   * @apiParam  {ObjectID} [routine.d6.sixth._teacher] Schedule routine.d6.sixth._teacher
   * @apiParam  {ObjectID} [postedBy] Schedule postedBy
   * @apiParam  {Date} [date] Schedule date
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     schedule: {}
   * }
   */
async post(req,res){
    const { schoolId, classId, routine } = req.body;

    try {
        // Check if the user is an admin
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        // Validate schoolId
        const schoolExists = await School.findById(schoolId);
        if (!schoolExists) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Create a new schedule instance
        const newSchedule = new Schedule({
            _school: schoolId,
            _class: classId,
            routine,
            postedBy: req.user._id, // Assuming you're using middleware to get the logged-in user
            date: new Date(), // Optional: Set the current date
        });

        // Save the schedule to the database
        const savedSchedule = await newSchedule.save();

        return res.status(201).json({
            message: 'Schedule created successfully',
            schedule: savedSchedule,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Failed to create schedule',
            error: error.message,
        });
    }
},

  /**
   * Edit a Schedule by _id
   * @api {put} /schedule/:id 4.0 Edit a Schedule by _id
   * @apiName editSchedule
   * @apiGroup Schedule
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Schedule to edit

   * @apiParam  {Object} [routine] Schedule routine
   * @apiParam  {String} [routine.d1.first.subjectName] Schedule routine.d1.first.subjectName
   * @apiParam  {Date} [routine.d1.first.startTime] Schedule routine.d1.first.startTime
   * @apiParam  {Date} [routine.d1.first.endTime] Schedule routine.d1.first.endTime
   * @apiParam  {ObjectID} [routine.d1.first._teacher] Schedule routine.d1.first._teacher
   * @apiParam  {String} [routine.d1.second.subjectName] Schedule routine.d1.second.subjectName
   * @apiParam  {Date} [routine.d1.second.startTime] Schedule routine.d1.second.startTime
   * @apiParam  {Date} [routine.d1.second.endTime] Schedule routine.d1.second.endTime
   * @apiParam  {ObjectID} [routine.d1.second._teacher] Schedule routine.d1.second._teacher
   * @apiParam  {String} [routine.d1.third.subjectName] Schedule routine.d1.third.subjectName
   * @apiParam  {Date} [routine.d1.third.startTime] Schedule routine.d1.third.startTime
   * @apiParam  {Date} [routine.d1.third.endTime] Schedule routine.d1.third.endTime
   * @apiParam  {ObjectID} [routine.d1.third._teacher] Schedule routine.d1.third._teacher
   * @apiParam  {String} [routine.d1.fourth.subjectName] Schedule routine.d1.fourth.subjectName
   * @apiParam  {Date} [routine.d1.fourth.startTime] Schedule routine.d1.fourth.startTime
   * @apiParam  {Date} [routine.d1.fourth.endTime] Schedule routine.d1.fourth.endTime
   * @apiParam  {ObjectID} [routine.d1.fourth._teacher] Schedule routine.d1.fourth._teacher
   * @apiParam  {String} [routine.d1.fifth.subjectName] Schedule routine.d1.fifth.subjectName
   * @apiParam  {Date} [routine.d1.fifth.startTime] Schedule routine.d1.fifth.startTime
   * @apiParam  {Date} [routine.d1.fifth.endTime] Schedule routine.d1.fifth.endTime
   * @apiParam  {ObjectID} [routine.d1.fifth._teacher] Schedule routine.d1.fifth._teacher
   * @apiParam  {String} [routine.d1.sixth.subjectName] Schedule routine.d1.sixth.subjectName
   * @apiParam  {Date} [routine.d1.sixth.startTime] Schedule routine.d1.sixth.startTime
   * @apiParam  {Date} [routine.d1.sixth.endTime] Schedule routine.d1.sixth.endTime
   * @apiParam  {ObjectID} [routine.d1.sixth._teacher] Schedule routine.d1.sixth._teacher
   * @apiParam  {String} [routine.d2.first.subjectName] Schedule routine.d2.first.subjectName
   * @apiParam  {Date} [routine.d2.first.startTime] Schedule routine.d2.first.startTime
   * @apiParam  {Date} [routine.d2.first.endTime] Schedule routine.d2.first.endTime
   * @apiParam  {ObjectID} [routine.d2.first._teacher] Schedule routine.d2.first._teacher
   * @apiParam  {String} [routine.d2.second.subjectName] Schedule routine.d2.second.subjectName
   * @apiParam  {Date} [routine.d2.second.startTime] Schedule routine.d2.second.startTime
   * @apiParam  {Date} [routine.d2.second.endTime] Schedule routine.d2.second.endTime
   * @apiParam  {ObjectID} [routine.d2.second._teacher] Schedule routine.d2.second._teacher
   * @apiParam  {String} [routine.d2.third.subjectName] Schedule routine.d2.third.subjectName
   * @apiParam  {Date} [routine.d2.third.startTime] Schedule routine.d2.third.startTime
   * @apiParam  {Date} [routine.d2.third.endTime] Schedule routine.d2.third.endTime
   * @apiParam  {ObjectID} [routine.d2.third._teacher] Schedule routine.d2.third._teacher
   * @apiParam  {String} [routine.d2.fourth.subjectName] Schedule routine.d2.fourth.subjectName
   * @apiParam  {Date} [routine.d2.fourth.startTime] Schedule routine.d2.fourth.startTime
   * @apiParam  {Date} [routine.d2.fourth.endTime] Schedule routine.d2.fourth.endTime
   * @apiParam  {ObjectID} [routine.d2.fourth._teacher] Schedule routine.d2.fourth._teacher
   * @apiParam  {String} [routine.d2.fifth.subjectName] Schedule routine.d2.fifth.subjectName
   * @apiParam  {Date} [routine.d2.fifth.startTime] Schedule routine.d2.fifth.startTime
   * @apiParam  {Date} [routine.d2.fifth.endTime] Schedule routine.d2.fifth.endTime
   * @apiParam  {ObjectID} [routine.d2.fifth._teacher] Schedule routine.d2.fifth._teacher
   * @apiParam  {String} [routine.d2.sixth.subjectName] Schedule routine.d2.sixth.subjectName
   * @apiParam  {Date} [routine.d2.sixth.startTime] Schedule routine.d2.sixth.startTime
   * @apiParam  {Date} [routine.d2.sixth.endTime] Schedule routine.d2.sixth.endTime
   * @apiParam  {ObjectID} [routine.d2.sixth._teacher] Schedule routine.d2.sixth._teacher
   * @apiParam  {String} [routine.d3.first.subjectName] Schedule routine.d3.first.subjectName
   * @apiParam  {Date} [routine.d3.first.startTime] Schedule routine.d3.first.startTime
   * @apiParam  {Date} [routine.d3.first.endTime] Schedule routine.d3.first.endTime
   * @apiParam  {ObjectID} [routine.d3.first._teacher] Schedule routine.d3.first._teacher
   * @apiParam  {String} [routine.d3.second.subjectName] Schedule routine.d3.second.subjectName
   * @apiParam  {Date} [routine.d3.second.startTime] Schedule routine.d3.second.startTime
   * @apiParam  {Date} [routine.d3.second.endTime] Schedule routine.d3.second.endTime
   * @apiParam  {ObjectID} [routine.d3.second._teacher] Schedule routine.d3.second._teacher
   * @apiParam  {String} [routine.d3.third.subjectName] Schedule routine.d3.third.subjectName
   * @apiParam  {Date} [routine.d3.third.startTime] Schedule routine.d3.third.startTime
   * @apiParam  {Date} [routine.d3.third.endTime] Schedule routine.d3.third.endTime
   * @apiParam  {ObjectID} [routine.d3.third._teacher] Schedule routine.d3.third._teacher
   * @apiParam  {String} [routine.d3.fourth.subjectName] Schedule routine.d3.fourth.subjectName
   * @apiParam  {Date} [routine.d3.fourth.startTime] Schedule routine.d3.fourth.startTime
   * @apiParam  {Date} [routine.d3.fourth.endTime] Schedule routine.d3.fourth.endTime
   * @apiParam  {ObjectID} [routine.d3.fourth._teacher] Schedule routine.d3.fourth._teacher
   * @apiParam  {String} [routine.d3.fifth.subjectName] Schedule routine.d3.fifth.subjectName
   * @apiParam  {Date} [routine.d3.fifth.startTime] Schedule routine.d3.fifth.startTime
   * @apiParam  {Date} [routine.d3.fifth.endTime] Schedule routine.d3.fifth.endTime
   * @apiParam  {ObjectID} [routine.d3.fifth._teacher] Schedule routine.d3.fifth._teacher
   * @apiParam  {String} [routine.d3.sixth.subjectName] Schedule routine.d3.sixth.subjectName
   * @apiParam  {Date} [routine.d3.sixth.startTime] Schedule routine.d3.sixth.startTime
   * @apiParam  {Date} [routine.d3.sixth.endTime] Schedule routine.d3.sixth.endTime
   * @apiParam  {ObjectID} [routine.d3.sixth._teacher] Schedule routine.d3.sixth._teacher
   * @apiParam  {String} [routine.d4.first.subjectName] Schedule routine.d4.first.subjectName
   * @apiParam  {Date} [routine.d4.first.startTime] Schedule routine.d4.first.startTime
   * @apiParam  {Date} [routine.d4.first.endTime] Schedule routine.d4.first.endTime
   * @apiParam  {ObjectID} [routine.d4.first._teacher] Schedule routine.d4.first._teacher
   * @apiParam  {String} [routine.d4.second.subjectName] Schedule routine.d4.second.subjectName
   * @apiParam  {Date} [routine.d4.second.startTime] Schedule routine.d4.second.startTime
   * @apiParam  {Date} [routine.d4.second.endTime] Schedule routine.d4.second.endTime
   * @apiParam  {ObjectID} [routine.d4.second._teacher] Schedule routine.d4.second._teacher
   * @apiParam  {String} [routine.d4.third.subjectName] Schedule routine.d4.third.subjectName
   * @apiParam  {Date} [routine.d4.third.startTime] Schedule routine.d4.third.startTime
   * @apiParam  {Date} [routine.d4.third.endTime] Schedule routine.d4.third.endTime
   * @apiParam  {ObjectID} [routine.d4.third._teacher] Schedule routine.d4.third._teacher
   * @apiParam  {String} [routine.d4.fourth.subjectName] Schedule routine.d4.fourth.subjectName
   * @apiParam  {Date} [routine.d4.fourth.startTime] Schedule routine.d4.fourth.startTime
   * @apiParam  {Date} [routine.d4.fourth.endTime] Schedule routine.d4.fourth.endTime
   * @apiParam  {ObjectID} [routine.d4.fourth._teacher] Schedule routine.d4.fourth._teacher
   * @apiParam  {String} [routine.d4.fifth.subjectName] Schedule routine.d4.fifth.subjectName
   * @apiParam  {Date} [routine.d4.fifth.startTime] Schedule routine.d4.fifth.startTime
   * @apiParam  {Date} [routine.d4.fifth.endTime] Schedule routine.d4.fifth.endTime
   * @apiParam  {ObjectID} [routine.d4.fifth._teacher] Schedule routine.d4.fifth._teacher
   * @apiParam  {String} [routine.d4.sixth.subjectName] Schedule routine.d4.sixth.subjectName
   * @apiParam  {Date} [routine.d4.sixth.startTime] Schedule routine.d4.sixth.startTime
   * @apiParam  {Date} [routine.d4.sixth.endTime] Schedule routine.d4.sixth.endTime
   * @apiParam  {ObjectID} [routine.d4.sixth._teacher] Schedule routine.d4.sixth._teacher
   * @apiParam  {String} [routine.d5.first.subjectName] Schedule routine.d5.first.subjectName
   * @apiParam  {Date} [routine.d5.first.startTime] Schedule routine.d5.first.startTime
   * @apiParam  {Date} [routine.d5.first.endTime] Schedule routine.d5.first.endTime
   * @apiParam  {ObjectID} [routine.d5.first._teacher] Schedule routine.d5.first._teacher
   * @apiParam  {String} [routine.d5.second.subjectName] Schedule routine.d5.second.subjectName
   * @apiParam  {Date} [routine.d5.second.startTime] Schedule routine.d5.second.startTime
   * @apiParam  {Date} [routine.d5.second.endTime] Schedule routine.d5.second.endTime
   * @apiParam  {ObjectID} [routine.d5.second._teacher] Schedule routine.d5.second._teacher
   * @apiParam  {String} [routine.d5.third.subjectName] Schedule routine.d5.third.subjectName
   * @apiParam  {Date} [routine.d5.third.startTime] Schedule routine.d5.third.startTime
   * @apiParam  {Date} [routine.d5.third.endTime] Schedule routine.d5.third.endTime
   * @apiParam  {ObjectID} [routine.d5.third._teacher] Schedule routine.d5.third._teacher
   * @apiParam  {String} [routine.d5.fourth.subjectName] Schedule routine.d5.fourth.subjectName
   * @apiParam  {Date} [routine.d5.fourth.startTime] Schedule routine.d5.fourth.startTime
   * @apiParam  {Date} [routine.d5.fourth.endTime] Schedule routine.d5.fourth.endTime
   * @apiParam  {ObjectID} [routine.d5.fourth._teacher] Schedule routine.d5.fourth._teacher
   * @apiParam  {String} [routine.d5.fifth.subjectName] Schedule routine.d5.fifth.subjectName
   * @apiParam  {Date} [routine.d5.fifth.startTime] Schedule routine.d5.fifth.startTime
   * @apiParam  {Date} [routine.d5.fifth.endTime] Schedule routine.d5.fifth.endTime
   * @apiParam  {ObjectID} [routine.d5.fifth._teacher] Schedule routine.d5.fifth._teacher
   * @apiParam  {String} [routine.d5.sixth.subjectName] Schedule routine.d5.sixth.subjectName
   * @apiParam  {Date} [routine.d5.sixth.startTime] Schedule routine.d5.sixth.startTime
   * @apiParam  {Date} [routine.d5.sixth.endTime] Schedule routine.d5.sixth.endTime
   * @apiParam  {ObjectID} [routine.d5.sixth._teacher] Schedule routine.d5.sixth._teacher
   * @apiParam  {String} [routine.d6.first.subjectName] Schedule routine.d6.first.subjectName
   * @apiParam  {Date} [routine.d6.first.startTime] Schedule routine.d6.first.startTime
   * @apiParam  {Date} [routine.d6.first.endTime] Schedule routine.d6.first.endTime
   * @apiParam  {ObjectID} [routine.d6.first._teacher] Schedule routine.d6.first._teacher
   * @apiParam  {String} [routine.d6.second.subjectName] Schedule routine.d6.second.subjectName
   * @apiParam  {Date} [routine.d6.second.startTime] Schedule routine.d6.second.startTime
   * @apiParam  {Date} [routine.d6.second.endTime] Schedule routine.d6.second.endTime
   * @apiParam  {ObjectID} [routine.d6.second._teacher] Schedule routine.d6.second._teacher
   * @apiParam  {String} [routine.d6.third.subjectName] Schedule routine.d6.third.subjectName
   * @apiParam  {Date} [routine.d6.third.startTime] Schedule routine.d6.third.startTime
   * @apiParam  {Date} [routine.d6.third.endTime] Schedule routine.d6.third.endTime
   * @apiParam  {ObjectID} [routine.d6.third._teacher] Schedule routine.d6.third._teacher
   * @apiParam  {String} [routine.d6.fourth.subjectName] Schedule routine.d6.fourth.subjectName
   * @apiParam  {Date} [routine.d6.fourth.startTime] Schedule routine.d6.fourth.startTime
   * @apiParam  {Date} [routine.d6.fourth.endTime] Schedule routine.d6.fourth.endTime
   * @apiParam  {ObjectID} [routine.d6.fourth._teacher] Schedule routine.d6.fourth._teacher
   * @apiParam  {String} [routine.d6.fifth.subjectName] Schedule routine.d6.fifth.subjectName
   * @apiParam  {Date} [routine.d6.fifth.startTime] Schedule routine.d6.fifth.startTime
   * @apiParam  {Date} [routine.d6.fifth.endTime] Schedule routine.d6.fifth.endTime
   * @apiParam  {ObjectID} [routine.d6.fifth._teacher] Schedule routine.d6.fifth._teacher
   * @apiParam  {String} [routine.d6.sixth.subjectName] Schedule routine.d6.sixth.subjectName
   * @apiParam  {Date} [routine.d6.sixth.startTime] Schedule routine.d6.sixth.startTime
   * @apiParam  {Date} [routine.d6.sixth.endTime] Schedule routine.d6.sixth.endTime
   * @apiParam  {ObjectID} [routine.d6.sixth._teacher] Schedule routine.d6.sixth._teacher
   * @apiParam  {ObjectID} [postedBy] Schedule postedBy
   * @apiParam  {Date} [date] Schedule date
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     schedule: {}
   * }
   */
  async put(req, res) {
    try {
      const {
        routine, postedBy, date
      } = req.body
      const schedule = await Schedule.findOne({ _id: req.params.id }).exec()
      if (schedule === null) return res.status(400).json({ error: true, reason: "No such Schedule!" })

      if (postedBy !== undefined) schedule.postedBy = postedBy
      if (date !== undefined) schedule.date = date

      await schedule.save()
      return res.json({ error: false, schedule })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a Schedule by _id
   * @api {delete} /schedule/:id 4.0 Delete a Schedule by _id
   * @apiName deleteSchedule
   * @apiGroup Schedule
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Schedule to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async delete(req, res) {
    try {
      await Schedule.deleteOne({ _id: req.params.id })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
