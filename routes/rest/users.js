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
      const { loginType, id, isSuperAdmin } = req.user; // loginType can be either "student", "teacher", or "admin"
  
      // Find the user by ID
      const user = await User.findOne({ _id: id });
      if (user === null) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check loginType and validate fields
      if (
        loginType === "teacher" ||
        loginType === "admin" ||
        loginType === "student"||
        isSuperAdmin
      ) {
        // Update fields only if provided
        if (req.body.firstName) user.firstName = req.body.firstName;
        if (req.body.lastName) user.lastName = req.body.lastName;
        if (req.body.firstName || req.body.lastName) 
          user.fullName = `${req.body.firstName || user.firstName} ${req.body.lastName || user.lastName}`;
        if (req.body.email) user.email = req.body.email;
        if (req.body.gender) user.gender = req.body.gender;
        if (req.body.phone) user.phone = req.body.phone;
        if (req.body.admissionYear) user.admissionYear = req.body.admissionYear;
        if (req.body.dob) user.dob = req.body.dob;
        if (req.body.signature) user.signature = req.body.signature;
        if (req.body.profileImage) user.profileImage = req.body.profileImage;
  
        // Update guardian details if provided and not empty
        if (req.body.guardian) {
          if (req.body.guardian.fathersName) user.guardian.fathersName = req.body.guardian.fathersName;
          if (req.body.guardian.fathersOccupation) user.guardian.fathersOccupation = req.body.guardian.fathersOccupation;
          if (req.body.guardian.mothersName) user.guardian.mothersName = req.body.guardian.mothersName;
          if (req.body.guardian.mothersOccupation) user.guardian.mothersOccupation = req.body.guardian.mothersOccupation;
        }
  
        // Update address if provided and not empty
        if (req.body.address) {
          if (req.body.address.locality) user.address.locality = req.body.address.locality;
          if (req.body.address.city) user.address.city = req.body.address.city;
          if (req.body.address.state) user.address.state = req.body.address.state;
          if (req.body.address.pin) user.address.pin = req.body.address.pin;
          if (req.body.address.country) user.address.country = req.body.address.country;
        }
      } else {
        return res
          .status(400)
          .json({
            error: true,
            reason: "User must be Admin, Teacher, Student or SuperAdmin",
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
