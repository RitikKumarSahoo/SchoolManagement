const Settings = require("../../models/settings");
const Class = require("../../models/class");
const School = require("../../models/school");
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
 *           "sections": ["A", "B", "C"],
 *           "monthlyFee": 1500
 *         }
 *       ],
 *       "busFee": [
 *         { "range": "morning", "fee": 500 },
 *         { "range": "evening", "fee": 500 }
 *       ],
 *       "isActive": true
 *     }
 *   ],
 *   "schoolDetails": {
 *     "_id": "671b5f46365b083490f126d2",
 *     "name": "Khukurdaha I C M M High School",
 *     "registrationNumber": "REG3167",
 *     "address": {
 *       "city": "Panskura",
 *       "state": "West Bengal",
 *       "country": "India",
 *       "pinCode": "721641"
 *     },
 *     "contact": {
 *       "phoneNo": "+91 8172059732",
 *       "email": "kicmmhs@gmail.com",
 *       "website": "kicmmhs.edu"
 *     },
 *     "location": {
 *       "type": "Point",
 *       "coordinates": [21.418325060918168, 84.02980772446274]
 *     },
 *     "principalName": "Mrinal Bera",
 *     "establishYear": 1995,
 *     "isActive": true,
 *     "schoolType": "highSchool",
 *     "createdAt": "2024-11-25T05:29:00.467Z",
 *     "updatedAt": "2024-11-25T05:29:00.467Z"
 *   }
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
      const { _school } = req.user;

      // Fetch settings and populate school details
      const settings = await Settings.findOne({ _school }).exec();
      const schoolDetails = await School.findById(_school).exec(); // Assuming School is your school model

      if (!settings) {
        return res.status(400).json({ error: true, reason: "Settings not found" });
      }

      if (!schoolDetails) {
        return res.status(400).json({ error: true, reason: "School details not found" });
      }

      return res.status(200).json({
        error: false,
        settings,
        schoolDetails,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  }
  ,

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

      
      // Subjects of the School
      if (setField === "subjects") {
        if (!Array.isArray(subjects) || subjects.length === 0) {
          return res.status(400).json({
            error: true,
            reason: "Field 'subjects' is required and should be a valid array",
          });
        }

        // Ensure subjects contain no duplicates in the incoming data
        const duplicates = subjects.filter((subject, index) => subjects.indexOf(subject) !== index);
        if (duplicates.length > 0) {
          return res.status(400).json({
            error: true,
            reason: `Duplicate subjects found in payload: ${duplicates.join(", ")}`,
          });
        }

        if (!settings) {
          // Create settings with the initial list of subjects
          settings = await Settings.create({
            _school,
            schoolSubjectsList: subjects,
          });
          return res.status(200).json({ error: false, settings });
        } else {
          // Replace existing subjects with the new list
          settings.schoolSubjectsList = subjects;
          await settings.save();

          return res.status(200).json({
            error: false,
            message: "Subjects Updated successfully.",
            settings,
          });
        }
      }



    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

 /**
 * @api {put} /admin/updatesettings Organization Settings Update
 * @apiName Organization Settings Update
 * @apiGroup Settings
 * @apiPermission admin
 * 
 * @apiDescription Updates various settings for the school, including available classes, bus fees, salary ranges, holidays, leave types, subjects, and school details (e.g., name, registration number, address, contact, etc.).
 * 
 * @apiParam {String} setField The field to update. Possible values: `class`, `busFee`, `salary`, `holidays`, `leave`, `subjects`, `schools`.
 * 
 * @apiParam {Object} [availableClasses] The available classes to be updated (only if `setField` is `class`).
 * @apiParam {String} availableClasses.grade The grade for the class.
 * @apiParam {String[]} availableClasses.sections List of sections for the class.
 * @apiParam {Number} availableClasses.monthlyFee The monthly fee for the class.
 * 
 * @apiParam {Object[]} [busFee] List of bus fee entries (only if `setField` is `busFee`).
 * @apiParam {String} busFee.range The range in the format `start-end` (e.g., `1-5`).
 * @apiParam {Number} busFee.fee The bus fee for the range.
 * 
 * @apiParam {Object[]} [salary] List of salary ranges (only if `setField` is `salary`).
 * @apiParam {String} salary.range The salary range in the format `start-end` (e.g., `12-24`).
 * @apiParam {Number} salary.amount The salary amount for the range.
 * 
 * @apiParam {Object[]} [holidays] List of holidays to be updated (only if `setField` is `holidays`).
 * @apiParam {String} holidays.name The name of the holiday.
 * @apiParam {String} holidays.date The date of the holiday in `DD/MM/YYYY` format.
 * 
 * @apiParam {Object[]} [leave] List of leave types (only if `setField` is `leave`).
 * @apiParam {String} leave.type The type of leave (e.g., `CL`, `PL`, `SL`).
 * @apiParam {Number} leave.days The number of days for the leave type.
 * 
 * @apiParam {String[]} [subjectsArray] List of subjects to be updated (only if `setField` is `subjects` and multiple subjects are provided).
 * @apiParam {String} [subjectsSingle] Single subject to be updated (only if `setField` is `subjects` and a single subject is provided).
 * 
 * @apiParam {Object} [schools] The school details to be updated (only if `setField` is `schools`).
 * @apiParam {String} [schools.name] The name of the school.
 * @apiParam {String} [schools.registrationNumber] The registration number of the school.
 * @apiParam {Object} [schools.address] The address of the school.
 * @apiParam {String} [schools.address.city] The city of the school.
 * @apiParam {String} [schools.address.state] The state of the school.
 * @apiParam {String} [schools.address.country] The country of the school.
 * @apiParam {String} [schools.address.pinCode] The pin code of the school.
 * @apiParam {Object} [schools.contact] The contact details of the school.
 * @apiParam {String} [schools.contact.phoneNo] The phone number of the school.
 * @apiParam {String} [schools.contact.email] The email of the school.
 * @apiParam {String} [schools.contact.website] The website of the school.
 * @apiParam {Object} [schools.location] The location of the school (latitude and longitude).
 * @apiParam {String} [schools.location.type] The location type (e.g., `Point`).
 * @apiParam {Number[]} [schools.location.coordinates] The coordinates of the school as an array `[longitude, latitude]`.
 * @apiParam {String} [schools.principalName] The name of the principal.
 * @apiParam {Number} [schools.establishYear] The year the school was established.
 * @apiParam {Boolean} [schools.isActive] The active status of the school (`true`/`false`).
 * @apiParam {String} [schools.schoolType] The type of the school (e.g., `Public`, `Private`).
 * 
 * @apiSuccess {Object} settings The updated settings for the school.
 * @apiSuccess {Array} settings.schoolSubjectsList The updated list of subjects.
 * @apiSuccess {Array} settings.availableClasses The updated available classes.
 * @apiSuccess {Array} settings.busFee The updated bus fees.
 * @apiSuccess {Array} settings.salary The updated salary ranges.
 * @apiSuccess {Array} settings.holidays The updated holidays.
 * @apiSuccess {Array} settings.leave The updated leave types.
 * @apiSuccess {Object} school The updated school details.
 * @apiSuccess {String} school.name The name of the school.
 * @apiSuccess {String} school.registrationNumber The registration number of the school.
 * @apiSuccess {Object} school.address The address of the school.
 * @apiSuccess {String} school.contact The contact details of the school.
 * @apiSuccess {Object} school.location The location of the school.
 * @apiSuccess {String} school.principalName The name of the principal.
 * @apiSuccess {Number} school.establishYear The year the school was established.
 * @apiSuccess {Boolean} school.isActive The active status of the school.
 * @apiSuccess {String} school.schoolType The type of the school.
 * 
 * @apiError (400) BadRequest Field validation failed. Specific reason is provided.
 * @apiError (403) Forbidden The user is not authorized to perform this action (non-admin).
 * @apiError (404) NotFound Settings or school not found.
 * @apiError (500) InternalServerError Server-side error occurred.
 * 
 * @apiExample {json} Request Example (for updating subjects):
 *  {
 *    "setField": "subjects",
 *    "subjectsArray": ["Computer Science", "Physical Education"]
 *  }
 * 
 * @apiExample {json} Request Example (for updating a single subject):
 *  {
 *    "setField": "subjects",
 *    "subjectsSingle": "Mathematics"
 *  }
 * 
 * @apiExample {json} Request Example (for updating school details):
 *  {
 *    "setField": "schools",
 *    "schools": {
 *      "name": "ABC High School",
 *      "registrationNumber": "12345ABC",
 *      "address": {
 *        "city": "New York",
 *        "state": "NY",
 *        "country": "USA",
 *        "pinCode": "10001"
 *      },
 *      "contact": {
 *        "phoneNo": "+1234567890",
 *        "email": "contact@abcschool.com",
 *        "website": "http://abcschool.com"
 *      },
 *      "location": {
 *        "type": "Point",
 *        "coordinates": [-74.0060, 40.7128]
 *      },
 *      "principalName": "John Doe",
 *      "establishYear": 1995,
 *      "isActive": true,
 *      "schoolType": "Public"
 *    }
 *  }
 */



  async updateSettings(req, res) {
    try {
      const { availableClasses, busFee, salary, holidays, leave, subjects, schools, setField } = req.body;
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

      // Handling "subjects" update: Update subjects
      if (setField === "subjects") {
        if (!subjects || (typeof subjects !== "string" && !Array.isArray(subjects))) {
          return res.status(400).json({
            error: true,
            reason: "Field 'subjects' is required and should be a string or an array.",
          });
        }

        // Normalize input to an array
        const subjectsArray = typeof subjects === "string" ? [subjects] : subjects;

        // Ensure each subject is valid and does not already exist
        const existingSubjects = settings.schoolSubjectsList || [];
        const newSubjects = [];

        for (const subject of subjectsArray) {
          if (typeof subject !== "string" || subject.trim() === "") {
            return res.status(400).json({
              error: true,
              reason: "Each subject must be a non-empty string.",
            });
          }

          const normalizedSubject = subject.trim().toLowerCase();  // Normalize to lowercase for case-insensitive comparison

          // Check if the subject already exists in schoolSubjectsList (case-insensitive)
          const subjectExists = existingSubjects.some(existingSubject =>
            existingSubject.toLowerCase() === normalizedSubject
          );

          if (subjectExists) {
            return res.status(400).json({
              error: true,
              reason: `The subject '${subject}' (case-insensitive) is already added. Duplicates are not allowed.`,
            });
          }

          newSubjects.push(subject.trim());
        }

        // Add new subjects to schoolSubjectsList
        settings.schoolSubjectsList.push(...newSubjects);
      }

      if (setField === "schools") {
        if (!schools || typeof schools !== "object") {
          return res.status(400).json({ error: true, reason: "Field 'schools' is required and must be a valid object." });
        }

        const {
          name,
          registrationNumber,
          address,
          contact,
          location,
          principalName,
          establishYear,
          isActive,
          schoolType,
        } = schools;

        const school = await School.findById(_school); // Fetch school document
        if (!school) {
          return res.status(404).json({ error: true, reason: "School not found." });
        }

        // Update school fields if provided
        if (name) school.name = name;
        if (registrationNumber) school.registrationNumber = registrationNumber;
        if (address && typeof address === "object") {
          if (address.locality) school.address.locality = address.locality;
          if (address.city) school.address.city = address.city;
          if (address.state) school.address.state = address.state;
          if (address.country) school.address.country = address.country;
          if (address.pinCode) school.address.pinCode = address.pinCode;
        }
        if (contact && typeof contact === "object") {
          if (contact.phoneNo) school.contact.phoneNo = contact.phoneNo;
          if (contact.email) school.contact.email = contact.email;
          if (contact.website) school.contact.website = contact.website;
        }
        if (location && typeof location === "object") {
          if (location.type) school.location.type = location.type;
          if (location.coordinates && Array.isArray(location.coordinates)) {
            school.location.coordinates = location.coordinates;
          }
        }
        if (principalName) school.principalName = principalName;
        if (establishYear) school.establishYear = establishYear;
        if (typeof isActive === "boolean") school.isActive = isActive;
        if (schoolType) school.schoolType = schoolType;

        // Save the updated school document
        await school.save();
      }
      
      // Save the updated settings
      await settings.save();
      const school = await School.findOne({ _id: req.user._school });
      return res.status(200).json({ error: false, settings, school });

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


  /**
 * @api {post} /admin/setscheduletime Set Weekly Schedule
 * @apiName SetScheduleTime
 * @apiGroup Schedule
 * @apiPermission admin
 * @apiDescription Set the weekly schedule for a school.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {Object} weekSchedule Weekly schedule details.
 * @apiBody {Object} weekSchedule.mon Monday's schedule.
 * @apiBody {Number} weekSchedule.mon.periodDuration Duration of each period (in minutes).
 * @apiBody {String} weekSchedule.mon.startTime Start time of the schedule (HH:mm).
 * @apiBody {String} weekSchedule.mon.endTime End time of the schedule (HH:mm).
 * @apiBody {Number} weekSchedule.mon.breakTime Break time between periods (in minutes).
 * @apiBody {Object} weekSchedule.tue Tuesday's schedule. (Same as `weekSchedule.mon` structure)
 * ...
 *
 * @apiSuccess {Boolean} error Indicates if there was an error (false on success).
 * @apiSuccess {String} message Success message confirming the schedule was set.
 * @apiSuccess {Object} weekSchedule The saved weekly schedule.
 * @apiSuccess {Object} weekSchedule.mon Monday's schedule.
 * @apiSuccess {Number} weekSchedule.mon.periodDuration Duration of each period (in minutes).
 * @apiSuccess {String} weekSchedule.mon.startTime Start time of the schedule (HH:mm).
 * @apiSuccess {String} weekSchedule.mon.endTime End time of the schedule (HH:mm).
 * @apiSuccess {Number} weekSchedule.mon.breakTime Break time between periods (in minutes).
 * @apiSuccess {Object} weekSchedule.tue Tuesday's schedule. (Same as `weekSchedule.mon` structure)
 * ...
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "error": false,
 *   "message": "Schedule created successfully",
 *   "weekSchedule": {
 *     "mon": {
 *       "periodDuration": 40,
 *       "startTime": "09:00",
 *       "endTime": "13:00",
 *       "breakTime": 10
 *     },
 *     "tue": {
 *       "periodDuration": 40,
 *       "startTime": "09:00",
 *       "endTime": "13:00",
 *       "breakTime": 10
 *     },
 *     ...
 *   }
 * }
 *
 * @apiError {Boolean} error Indicates if there was an error (true on failure).
 * @apiError {String} reason The reason for the error.
 *
 * @apiErrorExample {json} MissingFields:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": true,
 *   "reason": "Required fields are missing in the schedule."
 * }
 *
 * @apiErrorExample {json} InvalidToken:
 * HTTP/1.1 401 Unauthorized
 * {
 *   "error": true,
 *   "reason": "Invalid or missing authorization token."
 * }
 *
 * @apiErrorExample {json} ServerError:
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "error": true,
 *   "reason": "An unexpected error occurred. Please try again later."
 * }
 */

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
  },


};
