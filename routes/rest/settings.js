const Settings = require("../../models/settings");
const Class = require("../../models/class");
const moment = require("moment")

module.exports = {
  /**
   * @api {post} admin/settings Get Class Settings
   * @apiName GetSettings
   * @apiGroup Settings
   * @apiPermission admin superadmin
   * @apiDescription Retrieve class settings for a specific school with optional filtering by academic year and active status.
   *
   * @apiHeader {String} Authorization Bearer token.
   *
   * @apiQuery {String} [schoolId] The ID of the school. (Super Admins only)
   *
   * @apiBody {String} [academicYear] Optional filter by academic year (e.g., "2024-2025").
   * @apiBody {Boolean} [isActive] Optional filter to return active/inactive settings.
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *   "error": false,
   *   "settings": [
   *     {
   *       "_id": "60f7f15d9b1e8b001c3a8b8c",
   *       "_school": "60f7f12e9b1e8b001c3a8b8b",
   *       "academicYear": "2024-2025",
   *       "availableClasses": [
   *         {
   *           "grade": "5",
   *           "section": ["A", "B", "C"],
   *           "monthlyFee": 1500,
   *           "salary": 2000
   *         }
   *       ],
   *       "busFee": {
   *         "morning": 500,
   *         "evening": 500
   *       },
   *       "isActive": true
   *     }
   *   ]
   * }
   *
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 400 Bad Request
   * {
   *   "error": true,
   *   "reason": "You do not have permission"
   * }
   */

  async get(req, res) {
    try {
      const { _school, isSuperAdmin, loginType } = req.user;
      const schoolId = isSuperAdmin === true ? req.query.schoolId : _school;
      const { academicYear, isActive } = req.body;

      if (!(loginType === "admin" || isSuperAdmin === true)) {
        return res.status(400).json({
          error: true,
          reason: "You do not have permission",
        });
      }

      const query = { _school: schoolId };

      if (academicYear !== undefined) {
        query.academicYear = academicYear;
      }

      if (isActive !== undefined) {
        query.isActive = isActive;
      }
      console.log(query);

      const settings = await Settings.find(query);

      if (settings === null) {
        return res.status(404).json({
          error: true,
          message: "Settings not found",
        });
      }

      return res.status(200).json({
        error: false,
        settings,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  },

  /**
   * @api {post} /admin/setsettings Set Settings
   * @apiName SetSettings
   * @apiGroup Settings
   * @apiDescription This endpoint is used to set the school settings, including available classes, academic year, bus fees, and more.
   *
   * @apiHeader {String} Authorization Bearer token for admin or super admin access.
   *
   * @apiParam {Array} availableClasses List of classes with their details.
   * @apiParam {String} academicYear The academic year for the settings.
   * @apiParam {Object} busFee The bus fee structure (e.g., { "0-5": 600, "6-10": 800 }).
   * @apiParam {String} [schoolId] Optional school ID for super admins to set settings for a specific school.
   * @apiParam {Number} salary salary of teacher
   *
   * @apiParamExample {json} Request-Example:
   *     {
   *       "availableClasses": [
   *         {
   *           "grade": "1",
   *           "monthlyFee": 500,
   *           "salary": 2000
   *         },
   *         {
   *           "grade": "2",
   *           "monthlyFee": 600,
   *           "salary": 2200
   *         }
   *       ],
   *       "academicYear": "2024-2025",
   *       "busFee": {
   *         "0-5": 600,
   *         "6-10": 800
   *       },
   *       "schoolId": "60c72b2f5f1b2c001c4f8b3e"
   *     }
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "message": "Settings updated successfully",
   *       "settingsClass": {
   *         "_school": "60c72b2f5f1b2c001c4f8b3e",
   *         "academicYear": "2024-2025",
   *         "availableClasses": [
   *           {
   *             "grade": "1",
   *             "section": ["A", "B", "C", "D"],
   *             "monthlyFee": 500,
   *             "salary": 2000
   *           },
   *           {
   *             "grade": "2",
   *             "section": ["A", "B", "C", "D"],
   *             "monthlyFee": 600,
   *             "salary": 2200
   *           }
   *         ],
   *         "busFee": {
   *           "0-5": 600,
   *           "6-10": 800
   *         },
   *         "isActive": true
   *       },
   *       "AllClass": [
   *         {
   *           "_id": "60c72b2f5f1b2c001c4f8b4f",
   *           "name": "1",
   *           "section": "A",
   *           "academicYear": "2024-2025",
   *           "_school": "60c72b2f5f1b2c001c4f8b3e"
   *         },
   *         {
   *           "_id": "60c72b2f5f1b2c001c4f8b50",
   *           "name": "2",
   *           "section": "A",
   *           "academicYear": "2024-2025",
   *           "_school": "60c72b2f5f1b2c001c4f8b3e"
   *         }
   *       ]
   *     }
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": true,
   *       "message": "Settings not found"
   *     }
   *
   * @apiErrorExample {json} Permission-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You do not have permission"
   *     }
   */

  async settings(req, res) {
    try {
      const { availableClasses, busFee, salary, holidays, leave, setField} = req.body;
      const { loginType, _school } = req.user;
  
      const fixedSections = ["A", "B", "C", "D"];
      const currentYear = moment().year();
      const nextYear = currentYear + 1;
      const academicYear = `${currentYear}-${nextYear}`;
  
      if (loginType !== "admin") {
        return res.status(400).json({ error: true, reason: "You are not admin" });
      }

      let settings = await Settings.findOne({ _school });

      if(setField === undefined || setField === ""){
        return res.status(400).json({error:true,reason:" Field 'setField' is required "})
      }

      // set Class
      if(setField === "class"){
        if (availableClasses === undefined || availableClasses.length === 0) {
          return res.status(400).json({ error: true, reason: "Field 'availableClasses' is required" });
        }
        if (settings === null) {
          // First-time creation of settings
          const classesToSave = availableClasses.map((classInfo) => {
            return {
              grade: classInfo.grade,
              sections: fixedSections,
              monthlyFee: classInfo.monthlyFee,
            };
          });
    
          settings = await Settings.create({
            _school,
            availableClasses: classesToSave,
            academicYear,
          });
    
          // Create Class documents for each grade and section
          for (const classInfo of classesToSave) {
            for (const section of fixedSections) {
              await Class.create({
                _school,
                name: classInfo.grade,
                section,
                academicYear,
              });
            }
          }
    
          return res.status(200).json({ error: false,settings });
        } else {
          // Update existing settings
          const existingClasses = settings.availableClasses.map((c) => c.grade);
    
          for (const classInfo of availableClasses) {
            if (!existingClasses.includes(classInfo.grade)) {
              // Add new class to settings
              settings.availableClasses.push({
                grade: classInfo.grade,
                sections: fixedSections,
                monthlyFee: classInfo.monthlyFee,
              });
    
              // Create Class documents for the new grade
              for (const section of fixedSections) {
                await Class.create({
                  _school,
                  name: classInfo.grade,
                  section,
                  academicYear,
                });
              }
            } else {
              // Update monthlyFee for existing classes
              const existingClassIndex = settings.availableClasses.findIndex((c) => c.grade === classInfo.grade);
              if (classInfo.monthlyFee) {
                settings.availableClasses[existingClassIndex].monthlyFee = classInfo.monthlyFee;
              }
            }
          }// Update busFee if provided
          await settings.save();
          return res.status(200).json({ error: false,settings });
        }
      }

      // set BUSFEE
      if (setField === "busFee") {
        if (busFee === undefined || !Array.isArray(busFee)) {
          return res.status(400).json({ error: true, reason: "Field 'busFee' is required and should be a valid array" });
        }
      
        // Validate each busFee entry to ensure it contains range and fee
        for (const entry of busFee) {
          if (!entry.range || !entry.fee) {
            return res.status(400).json({ error: true, reason: "Each busFee entry must have 'range' and 'fee' properties" });
          }
          if (typeof entry.range !== "string" || typeof entry.fee !== "number") {
            return res.status(400).json({ error: true, reason: "Each busFee entry must have 'range' (string) and 'fee' (number)" });
          }
  
          const rangePattern = /^\d+-\d+$/;
          if (!rangePattern.test(entry.range)) {
            return res.status(400).json({ error: true, reason: `Invalid range format for '${entry.range}'. Use 'start-end' format.` });
          }
        }
      
        // Validate sequential ranges
        const sortedBusFee = [...busFee].sort((a, b) => {
          const [startA] = a.range.split("-").map(Number);
          const [startB] = b.range.split("-").map(Number);
          return startA - startB;
        });
      
        for (let i = 0; i < sortedBusFee.length - 1; i++) {
          const [startCurrent, endCurrent] = sortedBusFee[i].range.split("-").map(Number);
          const [startNext] = sortedBusFee[i + 1].range.split("-").map(Number);
      
          if (endCurrent + 1 !== startNext) {
            return res.status(400).json({
              error: true,
              reason: `Ranges are not sequential. Found gap or overlap between '${sortedBusFee[i].range}' and '${sortedBusFee[i + 1].range}'.`,
            });
          }
        }
        let settings = await Settings.findOne({ _school });
      
        if (settings === null) {
          settings = await Settings.create({
            _school,
            busFee,
          });
          return res.status(200).json({ error: false, settings });
        } else {
          settings.busFee = busFee;
          await settings.save();
          return res.status(200).json({ error: false, settings });
        }
      }
      

      // SALARY
      if (setField === "salary") {
        if (salary === undefined || !Array.isArray(salary)) {
          return res.status(400).json({
            error: true,
            reason: "Field 'salary' is required and should be a valid array",
          });
        }
  
        for (const entry of salary) {
          if (!entry.range || typeof entry.amount !== "number") {
            return res.status(400).json({
              error: true,
              reason: "Each salary entry must have 'range' (string) and 'amount' (number)",
            });
          }
  
          if (!/^\d+-\d+$/.test(entry.range)) {
            return res.status(400).json({
              error: true,
              reason: "Range must be in the format '12-24' (months)",
            });
          }
        }
  
        // Ensure salary ranges are sequential
        const ranges = salary.map((entry) => entry.range.split('-').map(Number));
        ranges.sort((a, b) => a[0] - b[0]); // Sort ranges by start value
  
        for (let i = 1; i < ranges.length; i++) {
          if (ranges[i][0] !== ranges[i - 1][1] + 1) {
            return res.status(400).json({
              error: true,
              reason: "Salary ranges must be sequential, with no gaps between them.",
            });
          }
        }
  
        if (!settings) {
          settings = await Settings.create({
            _school,
            salary,
          });
          return res.status(200).json({ error: false, settings })
        } else {
          settings.salary = salary
          await settings.save()
          return res.status(200).json({ error: false, settings })
        }
      }
  


      // Holidays
      if (setField === "holidays") {
        if (holidays === undefined || !Array.isArray(holidays)) {
          return res.status(400).json({ error: true, reason: "Field 'holidays' is required and should be a valid array" });
        }
      

        let settings = await Settings.findOne({ _school });
      
        if (!settings) {
          settings = await Settings.create({
            _school,
            holidays: holidays,
          });
      
          return res.status(200).json({ error: false, settings });
        } else {
          settings.holidays = holidays
          await settings.save();
      
          return res.status(200).json({ error: false, settings });
        }
      }
      
      // Leave
      if (setField === "leave") {
        if (!Array.isArray(leave) || leave.length === 0) {
          return res.status(400).json({
            error: true,
            reason: "Field 'leave' is required and should be a valid array",
          });
        }
  
        // Validate each leave entry
        const validLeaveTypes = ["CL", "PL", "SL"];
        for (const entry of leave) {
          if (!entry.type || typeof entry.days !== "number") {
            return res.status(400).json({
              error: true,
              reason: "Each leave entry must have 'type' (string) and 'days' (number)",
            });
          }
  
          if (!validLeaveTypes.includes(entry.type)) {
            return res.status(400).json({
              error: true,
              reason: `'type' must be one of ${validLeaveTypes.join(", ")}`,
            });
          }
  
          if (entry.days < 0) {
            return res.status(400).json({
              error: true,
              reason: "'days' must be a non-negative number",
            });
          }
        }
  
        if (!settings) {
          settings = await Settings.create({
            _school,
            leave,
          });
          return res.status(200).json({ error: false, settings });
        } else {
          settings.leave = leave;
          await settings.save();
          return res.status(200).json({ error: false,  settings });
        }
      }
  

    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * @api {put} /admin/updatesettings Update Settings
   * @apiName UpdateClassSettings
   * @apiGroup Settings
   * @apiDescription This endpoint updates the class settings, including available classes, bus fees, and the active status.
   *
   * @apiHeader {String} Authorization Bearer token for admin or super admin access.
   *
   * @apiParam {Array} [availableClasses] List of available classes with details.
   * @apiParam {Object} [busFee] The updated bus fee structure (e.g., { "0-5": 600, "6-10": 800 }).
   * @apiParam {Boolean} [isActive] Indicates if the settings should be active or not.
   * @apiParam {Boolean} [academicYear] "2024-2025"
   * @apiParam {Number}  [salary] salary of teacher
   *
   * @apiParamExample {json} Request-Example:
   *     {
   *       "availableClasses": [
   *         {
   *           "grade": "1",
   *           "section": ["A", "B"],
   *           "monthlyFee": 500,
   *           "salary": 2000
   *         },
   *         {
   *           "grade": "2",
   *           "monthlyFee": 600,
   *           "salary": 2200
   *         }
   *       ],
   *       "busFee": {
   *         "0-5": 600,
   *         "6-10": 800
   *       },
   *       "isActive": true
   *     }
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "message": "Class settings updated successfully",
   *       "updatedSettings": {
   *         "_school": "60c72b2f5f1b2c001c4f8b3e",
   *         "academicYear": "2024-2025",
   *         "availableClasses": [
   *           {
   *             "grade": "1",
   *             "section": ["A", "B"],
   *             "monthlyFee": 500,
   *             "salary": 2000
   *           },
   *           {
   *             "grade": "2",
   *             "section": ["A", "B", "C", "D"],
   *             "monthlyFee": 600,
   *             "salary": 2200
   *           }
   *         ],
   *         "busFee": {
   *           "0-5": 600,
   *           "6-10": 800
   *         },
   *         "isActive": true
   *       }
   *     }
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": true,
   *       "message": "Settings not found"
   *     }
   *
   * @apiErrorExample {json} Permission-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You do not have permission"
   *     }
   */

  async updateClassSettings(req, res) {
    try {
      const { availableClasses, busFee, isActive, academicYear } = req.body;
      const { _school, loginType, isSuperAdmin } = req.user;
      let fixedSections = ["A", "B", "C", "D"];

      if (!(loginType === "admin" || isSuperAdmin === true)) {
        return res.status(400).json({ error: true, reason: "" });
      }

      let settings = await Settings.findOne({
        _school,
        academicYear,
      });

      if (settings === null) {
        return res.status(404).json({
          error: true,
          message: "Settings not found",
        });
      }

      if (busFee) {
        Object.keys(busFee).forEach((key) => {
          settings.busFee.set(key, busFee[key]);
        });
      }

      if (typeof isActive === "boolean") {
        settings.isActive = isActive;
      }

      if (academicYear !== undefined) {
        settings.academicYear = academicYear;
      }

      const classPromises = [];
      if (availableClasses !== undefined && availableClasses.length > 0) {
        availableClasses.forEach((classInfo) => {
          const existingClass = settings.availableClasses.find(
            (c) => c.grade === classInfo.grade
          );

          if (existingClass) {
            if (classInfo.section) {
              existingClass.section = classInfo.section;
            }

            if (classInfo.monthlyFee !== undefined) {
              existingClass.monthlyFee = classInfo.monthlyFee;
            }

            if (classInfo.salary !== undefined) {
              existingClass.salary = classInfo.salary;
            }
          } else {
            settings.availableClasses.push({
              grade: classInfo.grade,
              section: ["A", "B", "C", "D"],
              monthlyFee: classInfo.monthlyFee,
              salary: classInfo.salary,
            });

            for (const section of fixedSections) {
              classPromises.push(
                Class.create({
                  name: classInfo.grade,
                  section,
                  academicYear: settings.academicYear,
                  _school,
                })
              );
            }
          }
        });
      }

      await settings.save();
      if (classPromises.length > 0) await Promise.all(classPromises);

      return res.status(200).json({
        error: false,
        message: "Class settings updated successfully",
        updatedSettings: settings,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  },

  /**
   * @api {delete} /admin/deletesetting Delete Setting
   * @apiName DeleteSetting
   * @apiGroup Settings
   * @apiPermission admin superadmin
   * @apiDescription Deletes a specific setting for a given academic year and school.
   *
   * @apiHeader {String} Authorization Bearer token.
   *
   * @apiBody {String} academicYear The academic year for the setting to be deleted (e.g., "2024-2025").
   * @apiBody {String} [schoolId] School ID to specify if the user is a superadmin. Admins delete settings only for their school.
   *
   * @apiSuccess {Boolean} error Indicates if there was an error (false on success).
   * @apiSuccess {String} message Success message confirming deletion.
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *   "error": false,
   *   "message": "deleted"
   * }
   *
   * @apiErrorExample {json} Permission Error:
   * HTTP/1.1 400 Bad Request
   * {
   *   "error": true,
   *   "reason": "You do not have permission to delete"
   * }
   *
   *
   * @apiErrorExample {json} Not-Found Error:
   * HTTP/1.1 404 Not Found
   * {
   *   "error": true,
   *   "reason": "setting not found"
   * }
   *
   * @apiError (500) {Boolean} error True if a server error occurred.
   * @apiError (500) {String} Error Server error message.
   *
   * @apiErrorExample {json} Server Error:
   * HTTP/1.1 500 Internal Server Error
   * {
   *   "error": true,
   *   "Error": "Error message"
   * }
   */

  async deleteSetting(req, res) {
    try {
      const { academicYear, schoolId } = req.body;
      const { _school, loginType, isSuperAdmin } = req.user;

      if (!(isSuperAdmin === true || loginType === "admin")) {
        return res.status(400).json("You do not have permission to delete");
      }

      const setting = await Settings.findOne({
        _school: isSuperAdmin === true ? schoolId : _school,
        academicYear,
      });

      if (setting === null) {
        return res
          .status(400)
          .json({ error: true, reason: "setting not found" });
      }

      await Settings.deleteOne({ _school: setting._school, academicYear });

      return res.status(200).json({ error: false, message: "deleted" });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },

// Adjust the import based on your directory structure

async setScheduleTime(req, res) {
  try {
    const { loginType, isSuperadmin } = req.user;

    if (loginType !== 'admin' || isSuperadmin === true) {
      return res.status(401).json({ error: true, message: 'Unauthorized access' });
    }

    const { academicYear, availableClasses, weekSchedule } = req.body;
    const scheduleData = {};

    for (const day in weekSchedule) {
      const { periodDuration, startTime, endTime, breakTime } = weekSchedule[day];

      let currentTime = moment(startTime, 'HH:mm');
      let end = moment(endTime, 'HH:mm');
      let totalMinutes = end.diff(currentTime, 'minutes');

      // Only subtract break time for weekdays (Monday to Friday)
      if (day !== 'sat') {
        totalMinutes -= parseInt(breakTime);  // Deduct 30 minutes for weekdays
      }

      let periodCount = Math.floor(totalMinutes / periodDuration);
      let periods = {};
      let periodNumber = 1;

      // Calculate periods for the given day
      while (currentTime.isBefore(end) && periodNumber <= periodCount) {
        let periodStart = moment(currentTime);
        let periodEnd = moment(currentTime).add(periodDuration, 'minutes');

        // Use string keys for period numbers
        periods[`period ${periodNumber}`] = {
          startTime: periodStart.format('HH:mm'),
          endTime: periodEnd.format('HH:mm'),
        };

        // Add a 30-minute break after the 3rd period for weekdays only
        if (periodNumber === 3 && day !== 'sat') {
          // Insert break time after the 3rd period
          const breakStart = periodEnd; // Break starts after the 3rd period
          const breakEnd = moment(breakStart).add(parseInt(breakTime), 'minutes');

          periods["breakTime"] = {
            startTime: breakStart.format('HH:mm'),
            endTime: breakEnd.format('HH:mm'),
          };

          // Update currentTime to be after the break
          currentTime = breakEnd;
        } else {
          // Move to the start time of the next period
          currentTime = periodEnd;
        }

        periodNumber++;
      }

      // Save the periods for the day in the scheduleData object
      scheduleData[day] = periods;
    }

    // Create and save the new schedule in the database
    const newSchedule = new Settings({
      academicYear,
      availableClasses,
      weekSchedule: scheduleData,
      _school: req.user._school 
    });

    await newSchedule.save();

    // Return a success response with the saved schedule
    res.json({
      message: 'Schedule created successfully',
      weekSchedule: newSchedule.weekSchedule,
      _school: req.user._school
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}








};
