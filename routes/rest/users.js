const User = require("../../models/user");

module.exports = {
  /**
   * @api {get} /api/v1/profile Get loggedIn User Details
   * @apiName GetUser
   * @apiGroup User
   * @apiVersion 1.0.0
   * @apiDescription Fetch a user's details using their ID,The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id The unique ID of the user.
   *
   * @apiExample {curl} Example usage:
   *     curl -X GET http://localhost:3000/api/v1/user/6711051061792663918458bf
   *
   * @apiSuccessExample {json} Success-Response:
   *   {
   *     "error": false,
   *     "user": {
   *       "_id": "6711051061792663918458bf",
   *       "username": "mahesh",
   *       "firstName": "admin",
   *       "lastName": "abcd",
   *       "email": "mahesh123@gmail.com",
   *       "accountType": "email",
   *       "dob": "2001-12-07T18:30:00.000Z",
   *       "loginType": "admin",
   *       "isActive": true,
   *       "isAdmin": true,
   *       "isSuperAdmin": false,
   *       "bankAdded": false,
   *       "_school": "670cc3c55aa29e2e31348c7e",
   *       "customerStripeId": "cus_R2yvkL6hLUVk7h",
   *       "isPaid": false,
   *       "messagingEnabled": true,
   *       "createdAt": "2024-10-17T12:37:36.453Z",
   *       "updatedAt": "2024-10-17T13:15:32.530Z",
   *       "address": "Sambalpur,Odisha,768005",
   *       "gender": "Female"
   *     }
   *   }
   *
   * @apiErrorExample {json} Error-Response:
   *   {
   *     "error": true,
   *     "reason": "No user found for the given id"
   *   }
   */

  async get(req, res) {
    try {
      const { id } = req.user;
      const user = await User.findOne({
        _id: id,
      })
        .select("-password -forgotpassword")
        .exec();
      if (user === null) throw new Error("No user found for the given id");
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

  /**
   * Edit user details
   * @api {put} /updateprofile/ Edit Own Profile Data
   * @apiVersion 1.0.0
   * @apiName EditUser
   * @apiGroup User
   * @apiPermission teacher, admin, student
   *
   * @apiDescription Allows a user (teacher, admin, or student) to update their profile information.
   *
   * @apiHeader {String} Authorization User's unique access token (JWT).
   *
   * @apiSuccess {String} message Success message indicating that the user details were updated.
   *
   * @apiError (Error 404) UserNotFound The user was not found.
   * @apiError (Error 400) InvalidUserType Only teacher, admin, or student roles are allowed to edit.
   * @apiError (Error 500) ServerError Internal server error.
   *
   * @apiExample {json} Request-Example:
   *     {
   *       "firstName": "John",
   *         "lastName": "Doe",
   *         "phone": "1234567890",
   *         "dob": "1990-05-15",
   *         "signature": "John's Signature",
   *         "profileImage": "path_to_image.jpg",
   *         "email": "john.doe@example.com",
   *         "guardian": {
   *           "fatherName": "Michael Doe",
   *           "motherName": "Jane Doe"
   *         },
   *         "address": "123 Main St, Springfield"
   *     }
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "User details updated successfully"
   *     }
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "message": "User not found"
   *     }
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "User must be Admin, Teacher or Student"
   *     }
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "message": "Server error"
   *     }
   */
  async editData(req, res) {
    try {
      const { loginType, id } = req.user; // loginType can be either "student", "teacher", or "admin"

      // Find the user by ID
      const user = await User.findOne({ _id: id });
      if (user === null) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check loginType and validate fields
      if (
        loginType === "teacher" ||
        loginType === "admin" ||
        loginType === "student"
      ) {
        const {
          firstName,
          lastName,
          phone,
          dob,
          signature,
          profileImage,
          email,
          guardian: { fathersName, mothersName } = {},
          address,
        } = req.body;

        // Update only if the fields are provided
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (phone !== undefined) user.phone = phone;
        if (dob !== undefined) user.dob = dob;
        if (signature !== undefined) user.signature = signature;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (email !== undefined) user.email = email;

        // Update guardian details if provided
        if (fathersName !== undefined) user.guardian.fathersName = fathersName;
        if (mothersName !== undefined) user.guardian.mothersName = mothersName;

        // Update address if provided
        if (address !== undefined) {
          if (locality !== undefined) user.address.locality = locality;
          if (city !== undefined) user.address.city = city;
          if (state !== undefined) user.address.state = state;
          if (pin !== undefined) user.address.pin = pin;
          if (country !== undefined) user.address.country = country;
        }
      } else {
        return res
          .status(400)
          .json({
            error: true,
            reason: "User must be Admin, Teacher or Student",
          });
      }

      // Save the updated user to the database
      await user.save();

      // Send the response with updated user data
      return res.status(200).json({
        message: "User details updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
