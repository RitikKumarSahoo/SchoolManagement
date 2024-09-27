const User = require("../../models/user")

module.exports = {
  /**
    *
    * @api {get} /user/:id get user details
    * @apiName userDetails
    * @apiGroup User
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
      const { id } = req.params
      const user = await User.findOne({
          _id: id
        })
        .select("-password -forgotpassword")
        .exec()
      if (user === null) throw new Error("No user found for the given id")
      return res.json({
        error: false,
        user
      })
    } catch (err) {
      return res.status(500).json({
        error: true,
        reason: err.message
      })
    }
  },

  async editData(req, res) {
    try {
      const { userId } = req.params;
      const { userType } = req.body;  // userType can be either "student" or "teacher"
      const updatedData = {};

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check userType and validate fields
      if (userType === 'teacher') {
          const { firstName, lastName, phone, dob, signature, profileImage } = req.body;

          // Update only if the fields are provided
          if (firstName !== undefined) updatedData.firstName = firstName;
          if (lastName !== undefined) updatedData.lastName = lastName;
          if (phone !== undefined) updatedData.phone = phone;
          if (dob !== undefined) updatedData.dob = dob;
          if (signature !== undefined) updatedData.signature = signature;
          if (profileImage !== undefined) updatedData.profileImage = profileImage;
      } 
      else if (userType === 'student') {
          const { firstName, lastName, gender, email, phone, signature, bankDetails, profileImage } = req.body;

          // Update only if the fields are provided
          if (firstName !== undefined) updatedData.firstName = firstName;
          if (lastName !== undefined) updatedData.lastName = lastName;
          if (gender !== undefined) updatedData.gender = gender;
          if (email !== undefined) updatedData.email = email;
          if (phone !== undefined) updatedData.phone = phone;
          if (signature !== undefined) updatedData.signature = signature;
          if (bankDetails !== undefined) updatedData.bankDetails = bankDetails;
          if (profileImage !== undefined) updatedData.profileImage = profileImage;
      } 
      else {
          return res.status(400).json({ message: 'Invalid userType. Must be either student or teacher.' });
      }

      // Update the user in the database
      const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedData }, { new: true });

      // Send the response with updated user data
      return res.status(200).json({
          message: 'User details updated successfully',
          user: updatedUser
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
  },


}