const Settings = require("../../models/settings");
const Class = require("../../models/class");
const moment = require("moment");

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

  async setSettings(req, res) {
    try {
      const { availableClasses, academicYear, busFee, schoolId } = req.body;
      const { _id, _school, loginType, isSuperAdmin } = req.user;

      if (!(loginType === "admin" || isSuperAdmin === true)) {
        return res
          .status(400)
          .json({ error: true, reason: "You do not have permission" });
      }

      const fixedSections = ["A", "B", "C", "D"];

      let settings = await Settings.findOne({
        _school: isSuperAdmin === true ? schoolId : _school,
        academicYear,
      });

      if (settings === null) {
        settings = await Settings.create({
          _school,
          academicYear,
          availableClasses: availableClasses.map((classInfo) => ({
            grade: classInfo.grade,
            section: fixedSections,
            monthlyFee: classInfo.monthlyFee,
            salary: classInfo.salary,
          })),
          busFee: busFee,
          isActive: true,
        });
      } else {
        availableClasses.forEach((classInfo) => {
          if (
            !settings.availableClasses.some((c) => c.grade === classInfo.grade)
          ) {
            settings.availableClasses.push({
              grade: classInfo.grade,
              section: fixedSections,
              monthlyFee: classInfo.monthlyFee,
              salary: classInfo.salary,
            });
          }
        });

        if (busFee) {
          settings.busFee = busFee;
        }
        await settings.save();
      }

      const classPromises = [];
      for (const classInfo of availableClasses) {
        const { grade } = classInfo;

        for (const section of fixedSections) {
          const existingClass = await Class.findOne({
            name: grade,
            section,
            academicYear,
            _school,
          });

          if (!existingClass) {
            classPromises.push(
              Class.create({
                name: grade,
                section,
                academicYear,
                _school,
              })
            );
          }
        }
      }
      const classes = await Promise.all(classPromises);

      return res
        .status(200)
        .json({ error: false, settingsClass: settings, AllClass: classes });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
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

  async setScheduleTime(req,res){
    
  }
};
