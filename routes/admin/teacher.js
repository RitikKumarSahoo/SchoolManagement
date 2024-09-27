const User = require("../../models/user");
const School = require("../../models/school");
const randomstring = require("randomstring");
const mail = require("../../lib/mail");

module.exports = {
  // fetch all teachers
  async find(req, res) {
    try {
      const { isAdmin } = req.user;
      if (!isAdmin) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not Admin" });
      }
      const users = await User.find({ loginType: "teacher", isActive: true });
      if (users.length === 0) {
        return res
          .status(400)
          .json({ error: true, reason: "No teacher found" });
      }
      const usersCount = await User.countDocuments({
        loginType: "teacher",
      }).exec();

      return res.status(200).json({ error: false, users, usersCount });
    } catch (error) {
      return res.status(400).json({ error: true, reason: error });
    }
  },

  // get teacher by id
  async get(req, res) {
    try {
      const { isAdmin } = req.user;
      if (!isAdmin) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not Admin" });
      }

      const user = await User.findOne({
        loginType: "teacher",
        isActive: true,
        _id: req.params.id,
      });
      if (user === null) {
        return res
          .status(400)
          .json({ error: true, reason: "No teacher found" });
      }

      return res.status(200).json({ error: false, user });
    } catch (error) {
      return res.status(400).json({ error: true, reason: error });
    }
  },
  // create teacher
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

      const randomStr = randomstring.generate({
        length: 8,
        charset:
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:"<>?[];,./`~',
      });

      const username = firstName.slice(0, 3) + phone.slice(-3);
      const password = randomStr;

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
        bankAdded: bankDetails !== undefined ? true : false,
      });

      const schoolName = await School.findOne(_school)
        .select("name")
        .lean()
        .exec();

      if (user.email !== undefined) {
        await mail("teacher-welcome", {
          to: user.email,
          subject: `Welcome to the ${schoolName}`,
          locals: {
            username,
            firstName,
            password,
            schoolName,
          },
        });
      }
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },

  // update teacher using :id
  async updateTeacher(req, res) {
    try {
      const { isAdmin } = req.user;

      if (!isAdmin) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not Admin" });
      }

      const { firstName, lastName, email, isActive, phone, bankDetails } =
        req.body;

      const user = await User.findOne({
        _id: req.params.id,
        loginType: "teacher",
        isActive: true,
      })
        .select("firstName lastName phone email isActive")
        .exec();

      if (user === null) {
        return res.status(400).json({ error: true, message: "No User Found" });
      }

      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (phone !== undefined) user.phone = phone;
      if (isActive !== undefined) user.isActive = isActive;
      if (bankDetails !== undefined) {
        user.bankDetails = bankDetails;
        user.bankAdded = true;
      }
      if (email !== undefined) {
        user.email = email;
      }

      await user.save();
      return res.status(200).json({ error: false, user });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },

  // delete teacher using :id
  async deleteTeacher(req, res) {
    try {
      const { isAdmin } = req.user;
      if (!isAdmin) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not Admin" });
      }

      const user = await User.findOne({ _id: req.params.id }).exec();
      if (user === null) {
        return res.status(400).json({ error: true, reason: "No such Admin" });
      }

      await User.deleteOne({ _id: req.params.id });
      return res
        .status(200)
        .json({ error: false, reason: "Teacher Has Been Deleted" });
    } catch (error) {
      return res.status(400).json({ error: true, reason: error });
    }
  },
};
