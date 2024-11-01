const User = require("../../../models/user");
const randomstring = require("randomstring");
const mail = require("../../../lib/mail");
const School = require("../../../models/school");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);

module.exports = {
  /**
   * @api {post} /admin/find Find Admins
   * @apiName FindAdmins
   * @apiGroup Admin
   * @apiDescription Super admins can search all teachers details.
   *
   * @apiHeader {String} Authorization Bearer token  super admin access.
   *
   * @apiParam {String} [searchText] Optional search text to filter teachers by `firstName`, `lastName`, `email`, `joinDate`,`gender` `phone`.
   * @apiParam  {Number} pageNumber="1" page number (start with 1) send within the params
   * @apiParam  {Number} pageSize="10" number of data send within the params
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *   "error": false,
   *   "users": [
   *     {
   *       "_id": "60d5f60c9b4d7635e8aebaf7",
   *       "firstName": "John",
   *       "lastName": "Doe",
   *       "email": "john.doe@example.com",
   *       "phone": "1234567890",
   *       "isActive": true,
   *       "loginType": "teacher"
   *     }
   *   ],
   *   "usersCount": 1
   * }
   *
   * @apiError UnauthorizedAccess Unauthorized access (not an admin or super admin).
   * @apiErrorExample {json} Unauthorized-Response:
   * HTTP/1.1 403 Forbidden
   * {
   *   "error": true,
   *   "reason": "Unauthorized access"
   * }
   *
   * @apiError NoTeachersFound No teachers found matching the search criteria.
   * @apiErrorExample {json} NoTeachers-Response:
   * HTTP/1.1 404 Not Found
   * {
   *   "error": true,
   *   "reason": "No teacher found"
   * }
   *
   * @apiError InternalServerError Internal server error.
   * @apiErrorExample {json} InternalServerError-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *   "error": true,
   *   "reason": "Internal server error"
   * }
   */
  async find(req, res) {
    try {
      const { isSuperAdmin } = req.user;
      let { searchText, pageNumber = 1, pageSize = 10, schoolId } = req.body;

      // Error if the user is not a super admin or admin
      if (isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not superadmin" });
      }

      const skipNumber = (pageNumber - 1) * pageSize;

      let query = {
        loginType: "admin",
        isActive: true,
        isSuperAdmin: false,
      };

      if (schoolId) {
        query._school = schoolId;
      }
      if (searchText) {
        const searchRegex = new RegExp(searchText.trim(), "i");
        query.$or = [
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { phone: { $regex: searchRegex } },
          { gender: { $regex: searchText } },
          { joinDate: { $regex: searchText } },
        ];
      }

      const [users, usersCount] = await Promise.all([
        User.find(query)
          .select("-password -bankDetails -forgotpassword")
          .skip(skipNumber)
          .limit(Number(pageSize))
          .exec(),
        User.countDocuments(query),
      ]);

      if (users.length === 0) {
        return res
          .status(404)
          .json({ error: true, reason: "No teacher found" });
      }

      return res.status(200).json({ error: false, users, usersCount });
    } catch (error) {
      return res.status(500).json({ error: true, reason: error.message });
    }
  },
  /**
   * @api {post} /admins  Get all admins
   * @apiName GetAllAdmins
   * @apiGroup Admin
   * @apiPermission SuperAdmin
   *
   * @apiDescription Fetch all admin users
   *
   * @apiHeader {String} Authorization Bearer token of superAdmin for authentication.
   * @apiParam  {Number} pageNumber="1" page number (start with 1) send within the params
   * @apiParam  {Number} pageSize="10" number of data send within the params
   *
   * @apiSuccessExample {json} Success Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "admins": [
   *         {
   *           "_id": "61234abcd5678ef901234567",
   *           "name": "John Doe",
   *           "email": "john.doe@example.com",
   *           "loginType": "admin",
   *           "createdAt": "2024-09-30T12:30:45.123Z",
   *           "updatedAt": "2024-10-01T14:22:05.456Z"
   *         },
   *         {
   *           "_id": "62345bcde6789fg012345678",
   *           "name": "Jane Smith",
   *           "email": "jane.smith@example.com",
   *           "loginType": "admin",
   *           "createdAt": "2024-08-20T09:45:15.123Z",
   *           "updatedAt": "2024-10-01T11:10:05.789Z"
   *         }
   *       ]
   *     }
   *
   * @apiError {Boolean} error Status of the request (true if an error occurred).
   * @apiError {String} reason Reason for the error if the user is not a super admin.
   *
   * @apiErrorExample {json} Unauthorized Access:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You are not superAdmin"
   *     }
   *
   * @apiErrorExample {json} Internal Server Error:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "Error": "Some error message"
   *     }
   */

  async getAllAdmin(req, res) {
    try {
      const { isSuperAdmin } = req.user;
      let { pageNumber = 1, pageSize = 10 } = req.body;

      if (isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not superAdmin" });
      }

      const skipNumber = (pageNumber - 1) * pageSize;
      const admins = await User.find({
        loginType: "admin",
        isSuperAdmin: false,
      })
        .select("-password -forgotpassword -isSuperAdmin")
        .skip(skipNumber)
        .limit(Number(pageSize))
        .exec();

      const totalAdmins = await User.countDocuments({
        loginType: "admin",
        isSuperAdmin: false,
      });

      return res.status(200).json({ error: false, admins, totalAdmins });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error });
    }
  },

  /**
   * @api {get} /admindetails/:id Get admin by ID
   * @apiName GetAdminDetails
   * @apiGroup Admin
   * @apiPermission SuperAdmin
   *
   * @apiDescription Fetch a specific admin's details by their ID
   *
   * @apiHeader {String} Authorization Bearer token of SuperAdmin for authentication.
   *
   * @apiParam {String} id Admin's unique ID.
   *
   * @apiSuccessExample {json} Success Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "error": false,
   *       "admin": {
   *         "_id": "61234abcd5678ef901234567",
   *         "name": "John Doe",
   *         "email": "john.doe@example.com",
   *         "loginType": "admin",
   *         "createdAt": "2024-09-30T12:30:45.123Z",
   *         "updatedAt": "2024-10-01T14:22:05.456Z"
   *       }
   *     }
   *
   * @apiError {Boolean} error Status of the request (true if an error occurred).
   * @apiError {String} reason Reason for the error if the user is not a super admin.
   *
   * @apiErrorExample {json} Unauthorized Access:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You are not superAdmin"
   *     }
   *
   * @apiErrorExample {json} Internal Server Error:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "Error": "Some error message"
   *     }
   */

  async get(req, res) {
    try {
      const { isSuperAdmin } = req.user;

      if (isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: false, reason: "You are not SuperAdmin" });
      }

      const admin = await User.findOne({
        _id: req.params.id,
        loginType: "admin",
      }).select("-password -isSuperAdmin -forgotpassword");

      if (admin === null) {
        return res
          .status(400)
          .json({ error: false, reason: "admin not found" });
      }

      return res.status(200).json({ error: false, admin });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error });
    }
  },

  /**
   * @api {delete} /admin/delete/:id Delete Admin User
   * @apiName DeleteAdmin
   * @apiGroup Admin
   * @apiPermission SuperAdmin
   *
   * @apiDescription This endpoint allows a SuperAdmin to delete an admin user.
   *
   * @apiHeader {String} Authorization Bearer token for authentication.
   *
   * @apiParam {String} id The ID of the admin user to delete.
   *
   * @apiError {Boolean} error Indicates if there was an error (true if an error occurred).
   * @apiError {String} reason Explanation of the error.
   *
   * @apiErrorExample {json} Unauthorized Access:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "error": true,
   *      "reason": "You are not authorized to delete an admin"
   *    }
   *
   * @apiErrorExample {json} Admin Not Found:
   *    HTTP/1.1 404 Not Found
   *    {
   *      "error": true,
   *      "reason": "Admin not found"
   *    }
   *
   * @apiErrorExample {json} Internal Server Error:
   *    HTTP/1.1 500 Internal Server Error
   *    {
   *      "error": true,
   *      "message": "Error details here"
   *    }
   *
   * @apiSuccessExample {json} Success Response:
   *    HTTP/1.1 200 OK
   *    {
   *      "error": false,
   *      "message": "Admin deleted successfully."
   *    }
   */

  async deleteAdmin(req, res) {
    try {
      const { isSuperAdmin } = req.user;

      // Check if the user is a superadmin
      if (isSuperAdmin === false) {
        return res.status(403).json({
          error: true,
          reason: "You are not authorized to delete an admin",
        });
      }

      const admin = await User.findOne({
        _id: req.params.id,
        loginType: "admin",
      });

      if (admin === null) {
        return res.status(404).json({ error: true, reason: "Admin not found" });
      }

      await admin.deleteOne({ _id: req.params.id });

      return res.status(200).json({
        error: false,
        message: "Admin deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * @api {put} /activatedeactivate/:id Activate/Deactivate user
   * @apiName DeactivateUser
   * @apiGroup User
   * @apiPermission Admin,superAdmin
   *
   * @apiParam {String} id The ID of the user
   * @apiParam {Boolean} flag true or false
   *
   * @apiError {Boolean} error Indicates whether an error occurred (true when an error occurred).
   * @apiError {String} reason Reason for the failure.
   * @apiErrorExample {json} User Not Found
   *    HTTP/1.1 400 Bad Request
   *    {
   *      "error": true,
   *      "reason": "user not found"
   *    }
   *
   */

  async Deactive(req, res) {
    try {
      const { loginType, isSuperAdmin } = req.user;
      const user = await User.findOne({ _id: req.params.id });
      const { flag } = req.body;

      if (user === null) {
        return res.status(400).json({ error: true, reason: "User not found" });
      }

      if (isSuperAdmin === true) {
        user.isActive = flag;
        await user.save();
        return res.status(200).json({
          error: false,
        });
      }

      // Admins can deactivate only student and teacher
      if (loginType === "admin") {
        if (user.loginType === "student" || user.loginType === "teacher") {
          user.isActive = flag;
          await user.save();
          return res.status(200).json({ error: false });
        }
      }

      return res.status(400).json({
        error: true,
        reason: "You are not authorized to activate deactivate this user",
      });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },
};
