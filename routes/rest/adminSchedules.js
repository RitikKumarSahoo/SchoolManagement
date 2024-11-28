
const Schedule = require("../../models/schedule")
const School = require("../../models/school")
const User = require("../../models/user")

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
      if (!req.user || req.user.loginType !== 'admin') return res.status(403).json({ message: 'Access denied: Admins only' });
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
      if (!req.user || req.user.loginType !== 'admin') return res.status(403).json({ message: 'Access denied: Admins only' });
    
      const { classId, className, section, dayOfWeek, scheduleId } = req.query;
    const query = {};

    // Add fields to the query if they are provided in the request
    if (scheduleId) query._id = scheduleId;
    if (classId) query._class = classId; // Use _class instead of classId

    if (section) query.section = section;


    const validDays = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'];
    if (dayOfWeek && !validDays.includes(dayOfWeek.toLowerCase())) return res.status(400).json({ error: true, message: 'Invalid dayOfWeek. Must be one of d1, d2, d3, d4, d5, d6.' });



    // If searching by dayOfWeek, ensure className and section are also provided
    if (dayOfWeek) {
      if (!className || !section) {
        return res.status(400).json({ 
          error: true, 
          message: 'Both className and section are required when searching by dayOfWeek' 
        });
      }
      query[`routine.${dayOfWeek.toLowerCase()}`] = { $exists: true }; // Assuming days are stored in a "routine" object
    }

    // Find the schedule(s) based on the query
    let schedules;

    if (className && section) {
      // If className and section are provided, populate class details
      schedules = await Schedule.find(query)
        .populate({ path: '_class', match: { name: className, section: section } }) // Populate only if both className and section are provided
        .exec();
    } else {
      // If className or section are not provided, find without population
      schedules = await Schedule.find(query).exec();
    }

    // Check if any schedules were found
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ error: true, message: 'No schedules found' });
    }


    const responseData = schedules.map(schedule => {
      if (dayOfWeek) {
        // Return only the relevant day's data
        return { [dayOfWeek]: schedule.routine[dayOfWeek.toLowerCase()] };
      }
      return schedule; // Return full schedule if no specific day is queried
    });
    return res.json({ error: false, schedules: responseData });


    // return res.json({ error: false, schedules });
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
    const { _school, _class, routine } = req.body;

    try {
        // Check if the user is an admin
        if (!req.user || req.user.loginType !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        // Validate schoolId
        const schoolExists = await School.findById(_school);
        if (!schoolExists) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Create a new schedule instance
        const newSchedule = new Schedule({
            _school,
            _class,
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
      const { routine, postedBy, date } = req.body;
      const { id } = req.params;  // Schedule ID from the route parameters
      const { dayOfWeek } = req.query; // The day to be edited (e.g., d1, d2, etc.)
    
      if (!req.user || req.user.loginType !== 'admin') return res.status(403).json({ message: 'Access denied: Admins only' });
      // Validate dayOfWeek
      const validDays = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'];
      if (dayOfWeek && !validDays.includes(dayOfWeek.toLowerCase())) {
        return res.status(400).json({ error: true, message: 'Invalid dayOfWeek. Must be one of d1, d2, d3, d4, d5, d6.' });
      }
    
      // Find the schedule by ID
      const schedule = await Schedule.findOne({ _id: id }).exec();
      if (!schedule) {
        return res.status(400).json({ error: true, reason: "No such Schedule!" });
      }
    
      
      // Update the routine for the specific day
      if (routine && dayOfWeek) {
        const dayRoutine = schedule.routine[dayOfWeek.toLowerCase()];
    
        if (!dayRoutine) {
          return res.status(400).json({ error: true, reason: `No routine exists for ${dayOfWeek}` });
        }
        
        // Only update provided periods in the routine without overwriting undefined fields
        Object.keys(routine).forEach(period => {
          if (routine[period]) {
            // Update only the fields provided for the period
            dayRoutine[period] = {
              ...dayRoutine[period],  // Preserve existing data
              ...routine[period]      // Merge with new data
            };
            // If a teacher ID is provided, include it in the update
            if (routine[period]._teacher) {
              dayRoutine[period]._teacher = routine[period]._teacher;
            }
          }
        });
      }
    
      // Update postedBy if provided
      if (postedBy !== undefined) schedule.postedBy = postedBy;
    
      // Update date if provided
      if (date !== undefined) schedule.date = date;
    
      // Save the updated schedule
      await schedule.save();
      return res.json({ error: false, schedule });
    
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
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
  },

  /**
 * @api {post} /admin/fetchavailableteachers Fetch Available Teachers
 * @apiName FetchAvailableTeachers
 * @apiGroup Admin
 * 
 * @apiParam {String} day The day of the week for which availability is being checked.
 * @apiParam {String} startTime The start time of the requested class.
 * @apiParam {String} endTime The end time of the requested class.
 * 
 * @apiSuccess {Object[]} availableTeachers List of available teachers.
 * @apiSuccess {String} availableTeachers.teacherId Teacher's unique ID.
 * @apiSuccess {String} availableTeachers.name Teacher's full name.
 * @apiSuccess {String} availableTeachers.subject Teacher's subject.
 * @apiSuccess {Boolean} availableTeachers.available Teacher availability status (true means available).
 * 
 * @apiError {Object} error Internal Server Error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 * 
 * @apiExample {json} Request-Example:
 *     {
 *       "day": "Monday",
 *       "startTime": "09:00",
 *       "endTime": "10:00"
 *     }
 * 
 * @apiExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "teacherId": "123456",
 *         "name": "John Doe",
 *         "subjects": "Math",
 *         "available": true
 *       },
 *       {
 *         "teacherId": "234567",
 *         "name": "Jane Smith",
 *         "subjects": "Science",
 *         "available": true
 *       }
 *     ]
 */

  async fetchAvailableTeachers(req, res) {
    const { day, startTime, endTime } = req.body;
  
    try {
      const schoolId = req.user._school;
      // console.log(schoolId);
      
      // Fetch all teachers associated with the school
      const teachers = await User.find({ _school: schoolId, loginType: "teacher" }).select("_id firstName lastName subject");
  
      // Check each teacher's availability
      const availabilityPromises = teachers.map(async (teacher) => {
        // Fetch the schedule for the teacher on the specific day and check availability
        const isAssigned = await Schedule.findOne({
          _school: schoolId,
          [`weekSchedule.${day}`]: {
            $elemMatch: {
              _teacher: teacher._id,
              $or: [
                { startTime: { $lt: endTime, $gte: startTime } }, // Overlapping time slot
                { endTime: { $gt: startTime, $lte: endTime } }    // Overlapping time slot
              ]
            }
          }
        });
  
        // If no schedule is found (isAssigned is null), mark the teacher as available
        const available = !isAssigned;
  
        return {
          teacherId: teacher._id,
          name: `${teacher.firstName} ${teacher.lastName}`,
          // email: teacher.email,
          subjects: teacher.subject,
          available
        };
      });
  
      const teacherAvailability = await Promise.all(availabilityPromises);
  
      // If no teacher has been assigned to any class at the given time, mark all teachers as available
      const availableTeachers = teacherAvailability.filter(teacher => teacher.available);

      // console.log(availableTeachers);
      
  
      // If no teachers are found to be available, all teachers are considered available
      if (availableTeachers.length === 0) {
        res.status(200).json(teachers.map(teacher => ({
          teacherId: teacher._id,
          name: `${teacher.firstName} ${teacher.lastName}`,
          // email: teacher.email,
          subjects: teacher.subject,
          available: true // All teachers are available
        })));
      } else {
        res.status(200).json(availableTeachers);
      }
      
    } catch (error) {
      console.error("Error checking teacher availability:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  

}
