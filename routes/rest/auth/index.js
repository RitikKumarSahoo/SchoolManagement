const jwt = require("jsonwebtoken");

const User = require("../../../models/user");

module.exports = {
  
  /**
   * @api {post} /login User login
   * @apiName userLogin
   * @apiGroup Auth
   * @apiVersion  1.0.0
   * @apiPermission Public
   *
   * @apiParam  {String} email
   * @apiParam  {String} password
   * @apiParam  {String} username
   * @apiParam  {String} loginType
   *
   * @apiSuccess (200) {json} token description
   *
   * @apiParamExample  {json} Request-Example:
     {
       "email": "myEmail@logic-square.com",
       "password": "myNewPassword",
       "username": "myUsername",
       "loginType": "student"
     }
   *
   * @apiSuccessExample {json} Success-Response:
     {
       "error": false,
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTI0MzNmYmM4NWVmMjY4MjM3MmIzNCIsImVtYWlsIjoibXlFbWFpbEBsb2NpYy1zcXVhcmUuY29tIiwiZmlyc3ROYW1lIjoiSm9obiIsImxhc3ROYW1lIjoiRG9lIiwicGhvbmUiOiIwMDAwMDAwMDAwMCIsImlzQWRtaW4iOnRydWUsImlzQWN0aXZlIjp0cnVlLCJfc2Nob29sIjoiNWY4MjAxMmFmYmM4NWVmMjY4MjM3MmIzNCIsImxvZ2luVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE1OTQ1ODM4ODksImV4cCI6MTU5NjE4Mzg4OX0.7zQF7j5j3i6j7j9i8i9j8j9j"
     }
   *
   * @apiError (400) {json} 400 description
   * @apiError (500) {json} 500 description
   */
  async post(req, res) {
    try {
      // const { type } = req.params
      const { email, password, username, loginType } = req.body;
      if (loginType === undefined || password === undefined) {
        return res.status(400).json({
          error: true,
          reason: "Fields `loginType` and `password` are mandatory",
        });
      }
      let query = {};
      if (loginType === "student") {
        if (username === undefined) {
          return res
            .status(400)
            .json({ error: true, reason: "Field `username` is mandatory" });
        }
        query = { username: username, loginType: "student" };
      }
      if (loginType === "admin" || loginType === "teacher") {
        if (email === undefined) {
          return res
            .status(400)
            .json({ error: true, reason: "Field `email` is mandatory" });
        }
        query = { email: email, loginType: loginType };
      }
      const user = await User.findOne(query).exec();
      if (user === null) throw new Error("User Not Found");
      if (user.isActive === false) throw new Error("User Inactive");
      // check pass
      await user.comparePassword(password);
      const payload = {
        id: user._id,
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        _school: user._school,
        loginType: user.loginType,
      };
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600 * 24 * 30, // 1 month
      });
      return res.json({
        error: false,
        token,
      });
    } catch (err) {
      return res.status(500).json({
        error: true,
        reason: err.message,
      });
    }
  },
};
