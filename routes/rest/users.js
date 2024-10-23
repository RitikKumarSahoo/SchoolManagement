const User = require("../../models/user");

module.exports = {
  /**
   * @api {get} /api/v1/user/:id Get User Details
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
      const { id } = req.params;
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
   *
   * This endpoint is restricted to admins only.
   *
   * @param {string} userId - The ID of the user to be edited
   * @param {string} userType - The type of user to be edited, either "teacher" or "student"
   * @param {object} req.body - The request body containing the fields to be updated
   * @param {string} [req.body.firstName] - The new first name of the user
   * @param {string} [req.body.lastName] - The new last name of the user
   * @param {string} [req.body.phone] - The new phone number of the user
   * @param {string} [req.body.dob] - The new date of birth of the user
   * @param {string} [req.body.signature] - The new signature of the user
   * @param {string} [req.body.profileImage] - The new profile image of the user
   * @param {string} [req.body.email] - The new email of the user (only for students)
   * @param {string} [req.body.bankDetails] - The new bank details of the user (only for students)
   * @param {string} [req.body.gender] - The new gender of the user (only for students)
   *
   * @returns {object} - The updated user object
   *
   * @throws {Error} - If the user is not found
   * @throws {Error} - If the request is not authorized (not an admin)
   * @throws {Error} - If the request body is invalid
   */
  async editData(req, res) {
    try {
      const { userId } = req.params;
      const { userType } = req.body; // userType can be either "student" or "teacher"
      const updatedData = {};

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check userType and validate fields
      if (userType === "teacher") {
        const { firstName, lastName, phone, dob, signature, profileImage } =
          req.body;

        // Update only if the fields are provided
        if (firstName !== undefined) updatedData.firstName = firstName;
        if (lastName !== undefined) updatedData.lastName = lastName;
        if (phone !== undefined) updatedData.phone = phone;
        if (dob !== undefined) updatedData.dob = dob;
        if (signature !== undefined) updatedData.signature = signature;
        if (profileImage !== undefined) updatedData.profileImage = profileImage;
      } else if (userType === "student") {
        const {
          firstName,
          lastName,
          gender,
          email,
          phone,
          signature,
          bankDetails,
          profileImage,
        } = req.body;

        // Update only if the fields are provided
        if (firstName !== undefined) updatedData.firstName = firstName;
        if (lastName !== undefined) updatedData.lastName = lastName;
        if (gender !== undefined) updatedData.gender = gender;
        if (email !== undefined) updatedData.email = email;
        if (phone !== undefined) updatedData.phone = phone;
        if (signature !== undefined) updatedData.signature = signature;
        if (bankDetails !== undefined) updatedData.bankDetails = bankDetails;
        if (profileImage !== undefined) updatedData.profileImage = profileImage;
      } else {
        return res.status(400).json({
          message: "Invalid userType. Must be either student or teacher.",
        });
      }

      // Update the user in the database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updatedData },
        { new: true }
      );

      // Send the response with updated user data
      return res.status(200).json({
        message: "User details updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
