const { response } = require("express");
const School = require("../../models/school");
const User = require("../../models/user/index");
const randomstring = require("randomstring");
const mail = require("../../lib/mail");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);

function generateCustomPassword() {
  const upperCaseLetter = randomstring.generate({
    length: 1,
    charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  });
  const lowerCaseLetters = randomstring.generate({
    length: 3,
    charset: "abcdefghijklmnopqrstuvwxyz",
  });
  const specialChar = randomstring.generate({
    length: 1,
    charset: "!@#$%^&*()_+[]{}|;:,.<>?/",
  });
  const numbers = randomstring.generate({
    length: 3,
    charset: "0123456789",
  });
  const password = upperCaseLetter + lowerCaseLetters + specialChar + numbers;
  return password;
}

module.exports = {
  /**
   * @api {post} /createschool Create School
   * @apiName CreateSchool
   * @apiGroup School
   *
   * @apiHeader {String} Authorization Bearer token of the super admin.
   *
   * @apiParam {String} name Name of the school.
   * @apiParam {Object} schoolAddress School address object.
   * @apiParam {String} schoolAddress.city City of the school.
   * @apiParam {String} schoolAddress.state State of the school.
   * @apiParam {String} schoolAddress.country Country of the school.
   * @apiParam {String} schoolAddress.pinCode Pin code of the school.
   * @apiParam {Object} contact Contact information object.
   * @apiParam {String} contact.phoneNo Phone number for the school.
   * @apiParam {String} contact.email Email address for the school.
   * @apiParam {String} contact.website Website of the school.
   * @apiParam {Object} location Location object.
   * @apiParam {String} location.type Type of location (e.g., Point).
   * @apiParam {Number[]} location.coordinates Coordinates of the school (longitude, latitude).
   * @apiParam {String} imageUrl Image URL of the school.
   * @apiParam {String} profileImage user profile image URL.
   * @apiParam {String} email users's email address.
   * @apiParam {String} firstName user's first name.
   * @apiParam {String} lastName user's last name.
   * @apiParam {String} dob user's date of birth.
   * @apiParam {String} gender user's gender.
   * @apiParam {String} phone user's phone number.
   * @apiParam {String} establishYear The year the school was established.
   * @apiParam {String} pfname Principal's first name.
   * @apiParam {String} plname Principal's last name.
   * @apiParam {String} schoolType  ["primary", "secondary", "highSchool"]
   *
   * @apiError (500) InternalServerError Unexpected error occurred.
   *
   * @apiExample {json} Request-Example:
   * {
   *   "name": "schoolXYZ",
   *   "schoolAddress": {
   *     "city": "Greenwood",
   *     "state": "California",
   *     "country": "USA",
   *     "pinCode": "90210"
   *   },
   *   "contact": {
   *     "phoneNo": "+1-f sjdfndsf",
   *     "email": "info@greenwoodhigh.edu",
   *     "website": "http://www.greenwoodhigh.edu"
   *   "establishYear":"1995",
   *   },
   *   "location": {
   *     "type": "Point",
   *     "coordinates": [21.418325060918168, 84.02980772446274]
   *   },
   * "imageUrl":"http://www.greenwoodhigh.edu"
   * "pfname": "PrincipalFirstName",
   * "plname": "PrincipalLastName",
   *
   *   "email": "sumanr@logic-square.com",
   *   "firstName": "suman",
   *   "lastName": "rana",
   *   "dob": "12/08/2001",
   *   "gender": "Male",
   *   "phone": "9668123855"
   * "profileImage":"nvkdjnvdjfnkfd",
   * }
   *
   */

  async Post(req, res) {
    try {
      const {
        name,
        schoolAddress,
        contact,
        location,
        imageUrl,
        profileImage,
        schoolType,
        email,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        address,
        establishYear,
        pfname,
        plname,
        joinDate,
      } = req.body;
      const { isSuperAdmin } = req.user;
      if (isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: true, reason: "you are not superadmin" });
      }
      if (name === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "school name is required" });
      }
      if (schoolAddress === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "school address is required" });
      }
      if (contact === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "school contact is required" });
      }
      if (email === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "email is required" });
      }
      if (firstName === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "firstName is required" });
      }
      if (lastName === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "lastName is required" });
      }
      if (phone === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "admin email is required" });
      }

      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          error: true,
          message: "Admin with this email already exists.",
        });
      }

      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      const registrationNumber = `REG${randomNumber}`;

      //create a new school
      const newSchool = await School.create({
        name,
        address: schoolAddress,
        contact,
        location,
        imageUrl,
        schoolType,
        registrationNumber,
        principalName: pfname + " " + plname,
        establishYear,
      });

      // Check if the admin already exists

      const username =
        firstName.slice(0, 3) + newSchool.name.slice(0, 3) + phone.slice(-3);

      const password = generateCustomPassword();

      const response = await User.create({
        username,
        email,
        password,
        firstName,
        lastName,
        loginType: "admin",
        isAdmin: true,
        isSuperAdmin: false,
        dob,
        isActive: true,
        _school: newSchool._id,
        phone,
        gender,
        address,
        profileImage,
        joinDate: joinDate || new Date(),
      });

      // await mail("admin-welcome", {
      //   to: email,
      //   subject: `Welcome to ${newSchool.name}`,
      //   locals: {
      //     username,
      //     firstName,
      //     password,
      //     schoolName: newSchool.name,
      //   },
      // });
      return res.status(201).json({
        error: false,
        message: "Admin successfully created.",
        response,
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * @api {put} /school/:id Update School
   * @apiName UpdateSchool
   * @apiGroup School
   * @apiPermission admin,superAdmin
   * @apiVersion 1.0.0
   * @apiDescription This endpoint allows  to update the details of an existing school.
   *
   * @apiHeader {String} Authorization unique access token (JWT).
   *
   * @apiParam {String} [name] The updated name of the school.
   * @apiParam {Object} [address] The updated address of the school.
   * @apiParam {String} [address.city] City of the school.
   * @apiParam {String} [address.state] State of the school.
   * @apiParam {String} [address.country] Country of the school.
   * @apiParam {String} [address.pinCode] Pin code of the school.
   * @apiParam {Object} [contact] The updated contact details of the school.
   * @apiParam {String} [contact.phoneNo] Updated phone number of the school.
   * @apiParam {String} [contact.email] Updated email address of the school.
   * @apiParam {String} [contact.website] Updated website of the school (if applicable).
   * @apiParam {Boolean} [isActive] Update the activation status of the school.
   * @apiParam {Boolean} [imageUrl] image of school
   * @apiParam {String} establishYear The year the school was established.
   * @apiParam {String} pfname Principal's first name.
   * @apiParam {String} plname Principal's last name.
   * @apiParam {String} schoolType The type of the school  ["primary", "secondary", "highSchool"]
   *
   * @apiError (400) {Boolean} error Whether there was an error.
   * @apiError (400) {String} reason Reason for the error (if applicable).
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "you are not authorized to update school details"
   *     }
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "Error": "Internal Server Error"
   *     }
   */

  async updateSchool(req, res) {
    try {
      const {
        name,
        address,
        contact,
        isActive,
        schoolType,
        imageUrl,
        location,
        establishYear,
        pfname,
        plname,
      } = req.body;
      const { isSuperAdmin, loginType, _school } = req.user;

      if (isSuperAdmin === true) {
        const school = await School.findOne({ _id: req.params.id });

        if (school === null) {
          return res
            .status(400)
            .json({ error: true, reason: "school not found" });
        }
        if (name !== undefined) school.name = name;
        if (address !== undefined) {
          if (address.country !== undefined)
            school.address.country = address.country;
          if (address.state !== undefined) school.address.state = address.state;
          if (address.city !== undefined) school.address.city = address.city;
          if (address.pinCode !== undefined)
            school.address.pinCode = address.pinCode;
        }
        if (contact !== undefined) school.contact = contact;
        if (isActive !== undefined) school.isActive = isActive;
        if (schoolType !== undefined) school.schoolType = schoolType;
        if (imageUrl !== undefined) school.imageUrl = imageUrl;
        if (pfname !== undefined && plname !== undefined) {
          school.principalName = pfname + " " + plname;
        }
        if (establishYear !== undefined) school.establishYear = establishYear;
        if (location !== undefined) school.location = location;

        await school.save();
        return res
          .status(200)
          .json({ error: false, message: "school information updated" });
      }

      if (loginType === "admin") {
        const school = await School.findOne({ _id: req.params.id });

        if (_school !== school._id.toString()) {
          return res
            .status(400)
            .json({ reason: "you can not update other school details" });
        }
        if (name !== undefined) school.name = name;
        if (address !== undefined) school.address = address;
        if (contact !== undefined) school.contact = contact;
        if (isActive !== undefined) school.isActive = isActive;
        if (schoolType !== undefined) school.schoolType = schoolType;
        if (imageUrl !== undefined) school.imageUrl = imageUrl;
        if (pfname !== undefined && plname !== undefined) {
          school.principalName = pfname + " " + plname;
        }
        if (establishYear !== undefined) school.establishYear = establishYear;
        if (location !== undefined) school.location = location;

        await school.save();
        return res
          .status(200)
          .json({ error: false, message: "school information updated" });
      }

      return res.status(400).json({
        error: true,
        message: "you can not update the school information",
      });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },

  /**
   * @api {get} /school/:id Get School Details
   * @apiName GetSchoolDetails
   * @apiGroup School
   * @apiVersion 1.0.0
   * @apiDescription Fetch the details of a specific school using its ID.
   *
   * @apiParam {String} id The unique ID of the school.
   *
   * @apiSuccess {Boolean} error Indicates if there was an error (false if successful).
   * @apiSuccess {Object} school The school object containing detailed information.
   *
   * @apiSuccessExample Success Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "error": false,
   *    "school": {
   *      "_id": "603ddf15e245ae19f85ce109",
   *      "name": "Green Valley High School",
   *      "registrationNumber": "GVHS-1234",
   *      "address": {
   *        "city": "San Francisco",
   *        "state": "California",
   *        "country": "USA",
   *        "pinCode": "94107"
   *      },
   *      "contact": {
   *        "phoneNo": "+1 415-555-0198",
   *        "email": "info@greenvalleyhigh.com",
   *        "website": "www.greenvalleyhigh.com"
   *      },
   *      "location": {
   *        "type": "Point",
   *        "coordinates": [-122.399972, 37.781372]
   *      },
   *      "principalName": "Dr. John Doe",
   *      "establishYear": 1995,
   *      "schoolType": "highSchool",
   *      "totalStudents": 1200,
   *      "totalClasses": 40,
   *      "isActive": true
   *    }
   *  }
   *
   * @apiErrorExample Error Response:
   *  HTTP/1.1 500 Internal Server Error
   *  {
   *    "error": true,
   *    "Error": "Server Error Message"
   *  }
   */

  async schoolDetails(req, res) {
    try {
      const school = await School.findOne({ _id: req.params.id });
      return res.status(200).json({ error: false, school });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error });
    }
  },

  /**
   * @api {post} /schools Get All Schools
   * @apiName GetAllSchools
   * @apiGroup School
   * @apiVersion 1.0.0
   * @apiDescription Fetch a list of all schools.
   *
   * @apiHeader {String} Authorization Bearer token of superAdmin for authentication.
   *
   * @apiSuccess {Boolean} error Indicates if there was an error (false if successful).
   * @apiSuccess {Object[]} school List of schools.
   * @apiSuccess {String} school._id Unique ID of the school.
   * @apiSuccess {String} school.name Name of the school.
   * @apiSuccess {String} school.registrationNumber Registration number of the school.
   * @apiSuccess {Object} school.address Address details of the school (city, state, country, pinCode).
   * @apiSuccess {Object} school.contact Contact details of the school (phoneNo, email, website).
   * @apiSuccess {String} school.principalName Name of the school principal.
   * @apiSuccess {Number} school.establishYear Year the school was established.
   * @apiSuccess {String} school.schoolType Type of the school (primary, secondary, highSchool).
   * @apiSuccess {Number} school.totalStudents Total number of students.
   * @apiSuccess {Number} school.totalClasses Total number of classes.
   * @apiSuccess {Boolean} school.isActive Indicates if the school is currently active.
   *
   * @apiSuccessExample Success Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "error": false,
   *    "school": [
   *      {
   *        "_id": "603ddf15e245ae19f85ce109",
   *        "name": "Green Valley High School",
   *        "registrationNumber": "GVHS-1234",
   *        "address": {
   *          "city": "San Francisco",
   *          "state": "California",
   *          "country": "USA",
   *          "pinCode": "94107"
   *        },
   *        "contact": {
   *          "phoneNo": "+1 415-555-0198",
   *          "email": "info@greenvalleyhigh.com",
   *          "website": "www.greenvalleyhigh.com"
   *        },
   *        "principalName": "Dr. John Doe",
   *        "establishYear": 1995,
   *        "schoolType": "highSchool",
   *        "totalStudents": 1200,
   *        "totalClasses": 40,
   *        "isActive": true
   *      },
   *      {
   *        "_id": "603ddf15e245ae19f85ce110",
   *        "name": "Blue Sky Elementary School",
   *        "registrationNumber": "BSES-5678",
   *        "address": {
   *          "city": "New York",
   *          "state": "New York",
   *          "country": "USA",
   *          "pinCode": "10001"
   *        },
   *        "contact": {
   *          "phoneNo": "+1 212-555-0199",
   *          "email": "info@blueskyelementary.com",
   *          "website": "www.blueskyelementary.com"
   *        },
   *        "principalName": "Dr. Jane Smith",
   *        "establishYear": 2000,
   *        "schoolType": "primary",
   *        "totalStudents": 800,
   *        "totalClasses": 20,
   *        "isActive": true
   *      }
   *    ]
   *  }
   *
   * @apiErrorExample Error Response:
   *  HTTP/1.1 400 Bad Request
   *  {
   *    "error": true,
   *    "Error": "You are not superadmin"
   *  }
   *
   *  HTTP/1.1 500 Internal Server Error
   *  {
   *    "error": true,
   *    "Error": "Server Error Message"
   *  }
   */

  async getAllSchool(req, res) {
    try {
      let { pageNumber, pageSize } = req.body;
      const { isSuperAdmin } = req.user;

      if (pageNumber === undefined) {
        pageNumber = 1;
      } else {
        pageNumber = Number(pageNumber);
      }
      // here check pagesize else set default
      if (pageSize === undefined) {
        pageSize = 10;
      } else {
        pageSize = Number(pageSize);
      }
      const skipNumber = (pageNumber - 1) * pageSize;

      if (isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not superadmin" });
      }

      const school = await School.find().skip(skipNumber).limit(pageSize);
      const totalSchools = await School.countDocuments();

      return res.status(200).json({ error: false, school, totalSchools });
    } catch (error) {
      return res.status(400).json({ error: true, Error: error.message });
    }
  },

  /**
   * @api {delete} /school/delete/:id Delete School
   * @apiName DeleteSchool
   * @apiGroup School
   * @apiVersion 1.0.0
   * @apiDescription Delete a school by its ID. Only superadmin can perform this operation.
   *
   * @apiHeader {String} Authorization Bearer token for authentication.
   *
   * @apiParam {String} id The ID of the school
   *
   * @apiSuccessExample Success Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "error": false,
   *    "message": "school deleted"
   *  }
   *
   * @apiErrorExample Error Response:
   *  HTTP/1.1 400 Bad Request
   *  {
   *    "error": true,
   *    "reason": "You are not superadmin"
   *  }
   *
   *  HTTP/1.1 500 Internal Server Error
   *  {
   *    "error": true,
   *    "Error": "Server Error Message"
   *  }
   */

  async deleteSchool(req, res) {
    try {
      const { isSuperAdmin } = req.user;

      if (isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not superAdmin" });
      }

      const school = await School.findOne({ _id: req.params.id });
      if (school === null) {
        return res
          .status(400)
          .json({ error: true, reason: "school not found" });
      }

      await School.deleteOne({ _id: req.params.id });

      return res.status(200).json({ error: false, message: "school deleted" });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },
};
