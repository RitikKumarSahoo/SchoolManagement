const User = require("../../../models/user");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);
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

  /**
   * @api {post} /admin/signup Create Admin
   * @apiName SignupByAdmin
   * @apiGroup Admin
   * @apiPermission Admin
   * @apiDescription This endpoint allows an admin to create a new admin user. It requires the admin to provide essential details such as username, email, password, first name, last name, and school information.
   *
   * @apiHeader {String} Authorization Bearer token for admin authentication.
   *
   * @apiParam {String} username The unique username for the new admin.
   * @apiParam {String} email The email address of the new admin.
   * @apiParam {String} password The password for the new admin.
   * @apiParam {String} firstName The first name of the new admin.
   * @apiParam {String} lastName The last name of the new admin.
   * @apiParam {String} phone The phone number of the new admin.
   * @apiParam {String} _school The school ID associated with the new admin.
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "error": false,
   *       "message": "Admin successfully created.",
   *       "response": {
   *         "_id": "5f7a5bc6f59c320017c4f1a4",
   *         "username": "newAdmin",
   *         "email": "admin@example.com",
   *         "firstName": "John",
   *         "lastName": "Doe",
   *         "isAdmin": true,
   *         "_school": "5f7a5bc6f59c320017c4f1a5"
   *       }
   *     }
   *
   * @apiError {Boolean} error Indicates if the operation was successful (true for failure).
   * @apiError {String} message Description of the error that occurred.
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "message": "Admin with this email already exists."
   *     }
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "message": "Internal server error."
   *     }
   */

  async signupByAdmin(req, res) {
    try {
      const { username, email, password, firstName, lastName, phone, _school } =
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
        return res.status(400).json({
          error: true,
          message: "Admin with this email already exists.",
        });
      }

      const customer = await stripe.customers.create({
        email,
      });
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
        phone,
        customerStripeId: customer.id,
        messagingEnabled: true,
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
