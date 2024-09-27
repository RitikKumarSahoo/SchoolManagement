const User = require("../../models/user");
const School = require("../../models/school");
const randomstring = require("randomstring");
const mail = require("../../lib/mail");

module.exports = {
  async createTeacher(req, res) {
    try {
      const {
        firstName,
        lastName,
        gender,
        email,
        phone,
        _school,
        dob,
        signature,
        bankDetails, // pending
      } = req.body;
      const { isAdmin } = req.user;
      if (!isAdmin) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not Admin" });
      }

      if (!firstName) {
        return res
          .status(400)
          .json({ error: true, message: "First name is required" });
      }
      if (!lastName) {
        return res
          .status(400)
          .json({ error: true, message: "Last name is required" });
      }
      if (!gender) {
        return res
          .status(400)
          .json({ error: true, message: "Gender is required" });
      }

      if (!phone) {
        return res
          .status(400)
          .json({ error: true, message: "Phone number is required" });
      }
      if (!dob) {
        return res
          .status(400)
          .json({ error: true, message: "Date of birth is required" });
      }

      // check user already exists
      const checkUserData = await User.findOne({ phone, email })
        .select("email phone")
        .exec();

      if (checkUserData !== null) {
        // if email match
        if (
          email !== undefined &&
          checkUserData.email === email.toLowerCase()
        ) {
          throw new Error("Email already use, please provide an unique email");
        }

        // if phone match
        if (checkUserData.phone === phone) {
          throw new Error(
            "Phone number already use, please provide an unique phone number"
          );
        }
      }

      const schoolName = await School.findOne(_school)
        .select("name")
        .lean()
        .exec();

      const randomStr = randomstring.generate({
        length: 8,
        charset:
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:"<>?[];,./`~',
      });

      const username = firstName.slice(0, 3) + phone.slice(-3);
      const password = randomStr;

      if (bankDetails) {
        const bankAdded = true;
      }

      const user = await User.create({
        firstName,
        lastName,
        gender,
        dob,
        _class,
        _addedBy: req.user,
        joinDate: new Date(),
        signature,
        username,
        password,
        loginType: "teacher",
        bankDetails,
        bankAdded,
      });

      if (user.email !== undefined) {
        await mail("teacher-welcome", {
          to: user.email,
          subject: `Welcome to the ${schoolName}`,
          locals: {
            userName: firstName,
            email,
            password,
            schoolName,
          },
        });
      }
    } catch (error) {}
  },
};
