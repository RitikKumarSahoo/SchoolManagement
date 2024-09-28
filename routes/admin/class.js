const User = require("../../models/user");
const School = require("../../models/school");
const Schedule = require("../../models/schedule");
const randomstring = require("randomstring");
const mail = require("../../lib/mail");
const Class = require("../../models/class");

module.exports = {
  // create class
  async Post(req, res) {
    try {
      const { name, section, academicYear } = req.body;
      const { id } = req.user;

      //find school from admin
      const user = await User.findOne({
        _id: id,
        isAdmin: true,
      }).select("_school");

      if (user === null) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not admin" });
      }

      // Check if class already exists
      const existingClass = await Class.findOne({ name, section });
      if (existingClass) {
        return res.status(409).json({
          message: "Class with this name and section already exists.",
        });
      }

      // // check for valid year
      // const isValidAcademicYear = moment(
      //   academicYear,
      //   "YYYY-YYYY",
      //   true
      // ).isValid();
      // if (!isValidAcademicYear) {
      //   return res
      //     .status(400)
      //     .json({ message: "Invalid academic year format. Use YYYY-YYYY." });
      // }

      const classReponse = await Class.create({
        name,
        section,
        academicYear,
        _school: user._school,
      });
      const name_section = name.trim() + section;
      return res.status(200).json({
        error: false,
        classReponse,
        name_section,
      });
    } catch (error) {
      return res.status(500).json({ error: true, error });
    }
  },

  // search classes by academicyear or name
  async find(req, res) {
    try {
      const { name, section, academicYear } = req.query;

      const user = await User.findOne({
        _id: req.user.id,
        isAdmin: true,
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: true, message: "You are not an admin" });
      }

      const query = { _school: req.user._school };
      if (academicYear) {
        query.academicYear = academicYear;
      }
      if (name && section) {
        query.name = name;
      }

      const classes = await Class.find(query);
      if (classes.length === 0) {
        return res.status(404).json({
          error: true,
          message: "No classes found for the given criteria.",
        });
      }

      const classCounts = await Class.countDocuments(query).exec();

      return res.status(200).json({
        error: false,
        data: classes,
        classCounts,
      });
    } catch (error) {
      return res.status(400).json({ error: true, reason: error.message });
    }
  },
};
