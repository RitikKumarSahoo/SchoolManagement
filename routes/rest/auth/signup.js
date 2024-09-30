const User = require("../../../models/user");

module.exports = {
  /**
    *
    * @api {post} /signup User registration
    * @apiName userRegistration
    * @apiGroup Auth
    * @apiVersion  1.0.0
    * @apiPermission Public
    *
    *
    * @apiParam  {String} email
    * @apiParam  {String} phone
    * @apiParam  {Object} name
    * @apiParam  {String} password
    *
    * @apiSuccess (200) {json} name description
    *
    * @apiParamExample  {json} Request-Example:
      {
        "email": "myEmail@logic-square.com",
        "phone": "00000000000",
        "name": {
          "first":"Jhon",
          "last" :"Doe"
        }
      }
    *
    * @apiSuccessExample {json} Success-Response:
      {
        "error": false,
        "user": {
          "email": "myEmail@logic-square.com",
          "phone": "00000000000",
          "name": {
            "first":"Jhon",
            "last" :"Doe"
          }
        }
      }
    *
    *
    */
  async post(req, res) {
    try {
      const { email, phone, name, password } = req.body;
      if (email === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "Missing manadatory field `email`" });
      }
      if (name === undefined || name.first === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "Please specify First Name!" });
      }
      let user = await User.create({
        email,
        phone,
        password,
        name,
      });
      user = user.toObject();
      delete user.password;
      delete user.forgotpassword;

      return res.json({ error: false, user });
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message });
    }
  },

  //admin signup
  async signupByAdmin(req, res) {
    try {
      const { username, email, password, firstName, lastName, _school } =
        req.body;

      // Validate input
      if (
        !username ||
        !email ||
        !password ||
        !firstName ||
        !lastName ||
        !_school
      ) {
        return res
          .status(400)
          .json({ error: true, message: "All fields are required." });
      }

      // Check if the admin already exists
      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) {
        return res.status(409).json({
          error: true,
          message: "Admin with this email already exists.",
        });
      }

      const response = await User.create({
        username,
        email,
        password,
        firstName,
        lastName,
        loginType: "admin",
        isAdmin: true,
        isActive: true,
        _school,
      });

      return res.status(201).json({
        error: false,
        message: "Admin successfully created.",
        response,
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
