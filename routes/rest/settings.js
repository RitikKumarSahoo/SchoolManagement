const Settings = require("../../models/settings");
const Class = require("../../models/class");
const moment = require("moment");

module.exports = {
  async setSettings(req, res) {
    try {
      const { availableClasses, academicYear, busFee } = req.body;
      const { _id, _school } = req.user;

      const fixedSections = ["A", "B", "C", "D"];

      let settings = await Settings.findOne({ _school, isActive: true });

      if (settings === null) {
        settings = await Settings.create({
          _school,
          academicYear,
          availableClasses: availableClasses.map((classInfo) => ({
            grade: classInfo.grade,
            section: fixedSections,
            monthlyFee: classInfo.monthlyFee,
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

  async updateClassSettings(req, res) {
    try {
      const { availableClasses, busFee, isActive } = req.body;
      const { _school } = req.user;

      let settings = await Settings.findOne({ _school, isActive: true });

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
          }
        });
      }

      // Save the updated settings document
      await settings.save();

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
};
