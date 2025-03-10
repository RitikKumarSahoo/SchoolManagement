const User = require("../../models/user");
const School = require("../../models/school");
const randomstring = require("randomstring");
module.exports = {
  /**
    *
    * @api {get} /user/:id get user details
    * @apiName userDetails
    * @apiGroup Admin-User
    * @apiVersion  1.0.0
    * @apiPermission User
    *
    * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
    *
    * @apiParam {String} id Users unique ID.
    *
    * @apiSuccess (200) {json} name description
    *
    * @apiSuccessExample {type} Success-Response:
      {
        "error" : false,
        "user" : {
          "email": "myEmail@logic-square.com",
          "phone": "00000000000",
          "name"  : {
            "first":"Jhon",
            "last" :"Doe"
          }
        }
      }
    *
    *
  */
  async get(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        _id: id,
        isAdmin: true,
      })
        .select("-password -forgotpassword")
        .exec();
      if (user === null)
        throw new Error("No admin user found for the given id");
      return res.json({
        error: false,
        user,
      });
    } catch (err) {
      return res.status(500).json({
        error: true,
        reason: err.message,
      });
    }
  },
};
