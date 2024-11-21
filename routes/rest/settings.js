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
      const { loginType, _school } = req.user

      const settings = await Settings.findOne({ _school }).exec()

      if (settings === null) {
        return res.staus(400).json({ error: true, reason: "settings not found" })
      }

      return res.status(200).json({
        error: false,
        settings,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        Error: error.message,
      });
    }
  },

  /**
 * @api {post} admin/setsettings Update School Settings
 * @apiName UpdateSettings
 * @apiGroup Settings
 * @apiVersion 1.0.0
 * 
 * @apiDescription This route allows an admin to update various settings for a school, including available classes, bus fees, salaries, holidays, leave policies, and subjects. Each update is categorized by the `setField` parameter.
 * 
 * @apiHeader {String} Authorization Bearer token for authentication.
 * 
 * @apiBody {String} setField The type of setting to update. Allowed values: "class", "busFee", "salary", "holidays", "leave", "subjects".
 * @apiBody {Array} [availableClasses] Array of objects specifying class details when `setField="class"`. Each object includes:
 * - `grade` (String): Class grade (e.g., "10th Grade").
 * - `monthlyFee` (Number): Monthly fee for the class.
 * @apiBody {Array} [busFee] Array of objects specifying bus fee details when `setField="busFee"`. Each object includes:
 * - `range` (String): Distance range in "start-end" format (e.g., "1-5").
 * - `fee` (Number): Fee for the specified range.
 * @apiBody {Array} [salary] Array of objects specifying salary details when `setField="salary"`. Each object includes:
 * - `range` (String): Experience range in "start-end" format (e.g., "0-5").
 * - `amount` (Number): Salary amount for the range.
 * @apiBody {Array} [holidays] Array of holiday dates (ISO format strings) when `setField="holidays"`.
 * @apiBody {Array} [leave] Array of objects specifying leave policies when `setField="leave"`. Each object includes:
 * - `type` (String): Leave type ("CL", "PL", or "SL").
 * - `days` (Number): Number of days allowed for the leave type.
 * @apiBody {Array} [subjects] Array of strings specifying subject names to add when `setField="subjects"`.
 * 
 * @apiSuccess {Boolean} error Indicates if there was an error.
 * @apiSuccess {Object} settings The updated settings object.
 * 
 * @apiError (400) {Boolean} error Indicates an error occurred.
 * @apiError (400) {String} reason Explanation of the error.
 * @apiError (500) {Boolean} error Indicates a server-side error occurred.
 * @apiError (500) {String} message Error message.
 * 
 * @apiExample {json} Request Example (Set Available Classes):
 * {
 *   "setField": "class",
 *   "availableClasses": [
 *     { "grade": "10th Grade", "monthlyFee": 3000 },
 *     { "grade": "9th Grade", "monthlyFee": 2500 }
 *   ]
 * }
 * 
 * @apiExample {json} Request Example (Set Bus Fees):
 * {
 *   "setField": "busFee",
 *   "busFee": [
 *     { "range": "1-5", "fee": 500 },
 *     { "range": "6-10", "fee": 800 }
 *   ]
 * }
 * 
 * @apiExample {json} Request Example (Set Holidays):
 * {
 *   "setField": "holidays",
 *   "holidays": ["2024-12-25", "2024-01-01"]
 * }
 * 
 * @apiExample {json} Request Example (Set Subjects):
 * {
 *   "setField": "subjects",
 *   "subjects": ["Mathematics", "Science", "History"]
 * }
 * 
 * @apiSuccessExample {json} Success Response:
 * {
 *   "error": false,
 *   "settings": {
 *     "_id": "64f1b5fa4d589eb5b820db3e",
 *     "_school": "64f1b5fa4d589eb5b820db3f",
 *     "availableClasses": [
 *       { "grade": "10th Grade", "sections": ["A", "B", "C", "D"], "monthlyFee": 3000 }
 *     ],
 *     "academicYear": "2024-2025",
 *     "busFee": [],
 *     "salary": [],
 *     "holidays": [],
 *     "leave": [],
 *     "schoolSubjectsList": ["Mathematics", "Science", "History"]
 *   }
 * }
 * 
 * @apiErrorExample {json} Validation Error:
 * {
 *   "error": true,
 *   "reason": "Field 'availableClasses' is required"
 * }
 */


  async settings(req, res) {
    try {
      const { availableClasses, busFee, salary, holidays, leave, setField, subjects } = req.body;
      const { loginType, _school } = req.user;

      const fixedSections = ["A", "B", "C", "D"];
      const currentYear = moment().year();
      const nextYear = currentYear + 1;
      const academicYear = `${currentYear}-${nextYear}`;

      if (loginType !== "admin") {
        return res.status(400).json({ error: true, reason: "You are not admin" });
      }

      let settings = await Settings.findOne({ _school });

      if (setField === undefined || setField === "") {
        return res.status(400).json({ error: true, reason: " Field 'setField' is required " })
      }

      // set Class
      if (setField === "class") {
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

          return res.status(200).json({ error: false, settings });
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
          return res.status(200).json({ error: false, settings });
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
          return res.status(200).json({ error: false, settings });
        }
      }

      //Subjects of the School
      if (setField === "subjects") {
        if (!Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({
                error: true,
                reason: "Field 'subjects' is required and should be a valid array",
            });
        }

        // Check for duplicates within the new list of subjects
        const duplicates = subjects.filter(
            (subject, index) => subjects.indexOf(subject) !== index
        );
        if (duplicates.length > 0) {
            return res.status(400).json({
                error: true,
                reason: `Duplicate subjects found: ${duplicates.join(", ")}`,
            });
        }

        if (!settings) {
            // Create settings with initial list of subjects
            settings = await Settings.create({
                _school,
                schoolSubjectsList: subjects,
            });
            return res.status(200).json({ error: false, settings });
        } else {
            // Update settings to add new subjects
            const existingSubjects = settings.schoolSubjectsList || [];
            const newSubjects = subjects.filter(
                (subject) => !existingSubjects.includes(subject)
            );

            if (newSubjects.length === 0) {
                return res.status(400).json({
                    error: true,
                    reason: "No new subjects to add; all provided subjects already exist.",
                });
            }

            settings.schoolSubjectsList.push(...newSubjects);
            await settings.save();

            return res.status(200).json({
                error: false,
                message: `Subjects added successfully: ${newSubjects.join(", ")}`,
                settings,
            });
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

  async updateSettings(req, res) {
    try {
      const { availableClasses, busFee, salary, holidays, leave, setField } = req.body;
      const { loginType, _school } = req.user;
  
      if (loginType !== "admin") {
        return res.status(403).json({ error: true, reason: "You are not authorized to perform this action." });
      }
  
      if (setField === undefined || setField === "") {
        return res.status(400).json({ error: true, reason: "Field 'setField' is required" });
      }
  
      let settings = await Settings.findOne({ _school });
      if (settings === null) {
        return res.status(404).json({ error: true, reason: "Settings not found for the school." });
      }
  
      if (setField === "class") {
        if (!availableClasses || !Array.isArray(availableClasses) || availableClasses.length === 0) {
          return res.status(400).json({ error: true, reason: "Field 'availableClasses' is required and must be a non-empty array." });
        }
        const fixedSections = ["A", "B", "C", "D"];
  
        for (const classInfo of availableClasses) {
          const existingClass = settings.availableClasses.find(c => c.grade === classInfo.grade);
  
          if (existingClass) {
            if (classInfo.monthlyFee) {
              existingClass.monthlyFee = classInfo.monthlyFee;
            }
          } else {
            settings.availableClasses.push({
              grade: classInfo.grade,
              sections: fixedSections,
              monthlyFee: classInfo.monthlyFee,
            });
          }
        }
      }
  
      // Handling "busFee" update: Update bus fees
      if (setField === "busFee") {
        if (!busFee || !Array.isArray(busFee)) {
          return res.status(400).json({ error: true, reason: "Field 'busFee' is required and should be a valid array." });
        }
  
        // Validate bus fee entries
        for (const entry of busFee) {
          if (!entry.range || !entry.fee) {
            return res.status(400).json({ error: true, reason: "Each busFee entry must have 'range' and 'fee' properties." });
          }
          if (typeof entry.range !== "string" || typeof entry.fee !== "number") {
            return res.status(400).json({ error: true, reason: "Each busFee entry must have 'range' (string) and 'fee' (number)." });
          }
          const rangePattern = /^\d+-\d+$/;
          if (!rangePattern.test(entry.range)) {
            return res.status(400).json({ error: true, reason: `Invalid range format for '${entry.range}'. Use 'start-end' format.` });
          }
        }
  
        // Update the bus fee
        settings.busFee = busFee;
      }
  
      // Handling "salary" update: Update salary ranges
      if (setField === "salary") {
        if (!salary || !Array.isArray(salary)) {
          return res.status(400).json({ error: true, reason: "Field 'salary' is required and should be a valid array." });
        }
  
        // Validate salary entries
        for (const entry of salary) {
          if (!entry.range || typeof entry.amount !== "number") {
            return res.status(400).json({ error: true, reason: "Each salary entry must have 'range' (string) and 'amount' (number)." });
          }
          if (!/^\d+-\d+$/.test(entry.range)) {
            return res.status(400).json({ error: true, reason: "Range must be in the format '12-24' (months)." });
          }
        }
  
        // Ensure salary ranges are sequential
        const ranges = salary.map(entry => entry.range.split('-').map(Number));
        ranges.sort((a, b) => a[0] - b[0]);
  
        for (let i = 1; i < ranges.length; i++) {
          if (ranges[i][0] !== ranges[i - 1][1] + 1) {
            return res.status(400).json({ error: true, reason: "Salary ranges must be sequential, with no gaps between them." });
          }
        }
  
        // Update salary
        settings.salary = salary;
      }
  
      // Handling "holidays" update: Update holidays (can update name and date)
      if (setField === "holidays") {
        if (!holidays || !Array.isArray(holidays)) {
          return res.status(400).json({
            error: true,
            reason: "Field 'holidays' is required and should be a valid array."
          });
        }
  
        // Validate each holiday entry
        for (const holiday of holidays) {
          if (!holiday.name || typeof holiday.name !== "string") {
            return res.status(400).json({
              error: true,
              reason: "Each holiday entry must have a 'name' property of type string."
            });
          }
  
          if (!holiday.date || typeof holiday.date !== "string") {
            return res.status(400).json({
              error: true,
              reason: "Each holiday entry must have a 'date' property of type string."
            });
          }
  
          // Validate date format using moment
          if (!moment(holiday.date, "DD/MM/YYYY", true).isValid()) {
            return res.status(400).json({
              error: true,
              reason: `Invalid date format for holiday '${holiday.name}'. Please use the format 'DD/MM/YYYY'.`
            });
          }
        }
  
        // Update holidays
        settings.holidays = holidays;
      }
  
      // Handling "leave" update: Update leave types
      if (setField === "leave") {
        if (!leave || !Array.isArray(leave)) {
          return res.status(400).json({ error: true, reason: "Field 'leave' is required and should be a valid array." });
        }
  
        const validLeaveTypes = ["CL", "PL", "SL"];
  
        // Validate each leave entry
        for (const entry of leave) {
          if (!entry.type || typeof entry.days !== "number") {
            return res.status(400).json({ error: true, reason: "Each leave entry must have 'type' (string) and 'days' (number)." });
          }
  
          if (!validLeaveTypes.includes(entry.type)) {
            return res.status(400).json({ error: true, reason: `'type' must be one of ${validLeaveTypes.join(", ")}` });
          }
  
          if (entry.days < 0) {
            return res.status(400).json({ error: true, reason: "'days' must be a non-negative number" });
          }
        }
  
        // Update leave
        settings.leave = leave;
      }
  
      // Save the updated settings
      await settings.save();
  
      return res.status(200).json({ error: false, settings });
  
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
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
      const { loginType, isSuperadmin, _school } = req.user;
  
      // Validate that the user is an admin and ensure _school matches the admin's school
      if (loginType !== 'admin' || isSuperadmin === true) {
        return res.status(401).json({ error: true, message: 'Unauthorized access' });
      }
  
      const { academicYear, weekSchedule } = req.body;
  
      // Check if the settings document exists for the given academic year and school
      const existingSettings = await Settings.findOne({
        academicYear,
        _school,
      });
  
      console.log("existingSettings", existingSettings?.weekSchedule);
  
      // If a schedule already exists and weekSchedule is populated, return an error
      if (
        existingSettings &&
        existingSettings.weekSchedule &&
        (Object.keys(existingSettings.weekSchedule).some(
          (day) => existingSettings.weekSchedule[day].length > 0
        ))
      ) {
        return res.status(400).json({
          error: true,
          message: `A schedule already exists for academic year ${academicYear} in the current school.`,
        });
      }
  
      // Validation and generation of the schedule
      const scheduleData = {};
  
      for (const day in weekSchedule) {
        const { periodDuration, startTime, endTime, breakTime } = weekSchedule[day];
        let currentTime = moment(startTime, 'HH:mm');
        let end = moment(endTime, 'HH:mm');
        let totalMinutes = end.diff(currentTime, 'minutes');
  
        // Deduct break time for weekdays (Monday to Friday)
        if (day !== 'sat') {
          totalMinutes -= parseInt(breakTime); // Deduct break time for weekdays
        }
  
        // Validation: Ensure total time is divisible by periodDuration
        if (totalMinutes % periodDuration !== 0) {
          return res.status(400).json({
            error: true,
            message: `Total time on ${day} is not divisible by the period duration.`,
          });
        }
  
        let periodCount = Math.floor(totalMinutes / periodDuration);
        let periods = [];
        let periodNumber = 1;
  
        // Calculate periods for the given day
        while (currentTime.isBefore(end) && periodNumber <= periodCount) {
          let periodStart = moment(currentTime);
          let periodEnd = moment(currentTime).add(periodDuration, 'minutes');
  
          // Add the period to the schedule
          periods.push({
            periodType: 'period',
            startTime: periodStart.format('HH:mm'),
            endTime: periodEnd.format('HH:mm'),
          });
  
          // After the 4th period, insert the break time (for weekdays only)
          if (periodNumber === 4 && day !== 'sat') {
            const breakStart = periodEnd; // Break starts after the 4th period
            const breakEnd = moment(breakStart).add(45, 'minutes'); // Break lasts for 45 minutes
  
            periods.push({
              periodType: 'break',
              startTime: breakStart.format('HH:mm'),
              endTime: breakEnd.format('HH:mm'),
            });
  
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
  
      // Update the existing settings document with the new schedule
      if (existingSettings) {
        existingSettings.weekSchedule = scheduleData;
        await existingSettings.save();
      } else {
        return res.status(400).json({
          error: true,
          message: `Settings for academic year ${academicYear} not found. Please ensure settings exist before creating a schedule.`,
        });
      }
  
      // Return a success response with the saved schedule
      res.json({
        message: 'Schedule created successfully',
        weekSchedule: existingSettings.weekSchedule,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  
  
  








};
