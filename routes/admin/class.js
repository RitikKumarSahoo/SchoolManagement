const User = require("../../models/user");
const School = require("../../models/school");
const Schedule = require("../../models/schedule");
const randomstring = require("randomstring");
const mail = require("../../lib/mail");

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

      // check for valid year
      const isValidAcademicYear = moment(
        academicYear,
        "YYYY-YYYY",
        true
      ).isValid();
      if (!isValidAcademicYear) {
        return res
          .status(400)
          .json({ message: "Invalid academic year format. Use YYYY-YYYY." });
      }

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
};
