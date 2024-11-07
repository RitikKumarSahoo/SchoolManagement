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
   * @apiParam {String} locationUrl url of school location
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
   * "locationUrl":""
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
        locationUrl,
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
        locationUrl,
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
        message: "School successfully created.",
        response,
        newSchool,
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
   * @apiParam {String} locationUrl location url of school
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
        locationUrl,
        admin,
      } = req.body;
      const { isSuperAdmin, loginType, _school } = req.user;

      if (isSuperAdmin === true) {
        const school = await School.findOne({ _id: req.params.id });

        if (school === null) {
          return res
            .status(400)
            .json({ error: true, reason: "school not found" });
        }

        const adminUser = await User.findOne({
          loginType: "admin",
          isSuperAdmin: false,
          _school: school._id,
        });

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
        if (locationUrl !== undefined) school.locationUrl = locationUrl;

        //admin update
        if (admin !== undefined) {
          if (admin.firstName !== undefined) {
            adminUser.firstName = admin.firstName;
          }
          if (admin.lastName !== undefined) {
            adminUser.lastName = admin.lastName;
          }
          if (admin.email !== undefined) {
            adminUser.email = admin.email;
          }
          if (admin.phone !== undefined) {
            adminUser.phone = admin.phone;
          }
          if (admin.dob !== undefined) {
            adminUser.dob = admin.dob;
          }
          if (admin.profileImage !== undefined) {
            adminUser.profileImage = admin.profileImage;
          }
          if (admin.gender !== undefined) {
            adminUser.gender = admin.gender;
          }
          if (admin.address !== undefined) {
            if (admin.address.country !== undefined)
              adminUser.address.country = admin.address.country;
            if (admin.address.state !== undefined)
              adminUser.address.state = admin.address.state;
            if (admin.address.city !== undefined)
              adminUser.address.city = admin.address.city;
            if (admin.address.pin !== undefined)
              adminUser.address.pin = admin.address.pin;
            if (admin.address.locality !== undefined) {
              adminUser.address.locality = admin.address.locality;
            }
          }
          if (admin.isActive !== undefined) {
            adminUser.isActive = admin.isActive;
          }
          await adminUser.save();
        }

        await school.save();
        return res.status(200).json({ error: false, message: "updated" });
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
        if (locationUrl !== undefined) school.locationUrl = locationUrl;

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
   * @apiDescription Fetch the details of a specific school using its ID, along with its assigned admin user.
   *
   * @apiParam {String} id The unique ID of the school.
   *
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
   *      "isActive": true,
   *      "locationUrl": ""
   *    },
   *    "admin": {
   *      "address": {
   *        "city": "New York",
   *        "country": "USA",
   *        "locality": "Greenwood Avenue",
   *        "pin": "10001",
   *        "state": "NY"
   *      },
   *      "_id": "6711051061792663918458bf",
   *      "username": "mahesh",
   *      "firstName": "admin",
   *      "lastName": "abcd",
   *      "email": "mahesh123@gmail.com",
   *      "accountType": "email",
   *      "dob": "Sat Dec 08 2001 00:00:00 GMT+0530 (India Standard Time)",
   *      "loginType": "admin",
   *      "isActive": true,
   *      "isAdmin": true,
   *      "isSuperAdmin": false,
   *      "bankAdded": false,
   *      "_school": "670cc3c55aa29e2e31348c7e",
   *      "customerStripeId": "cus_R2yvkL6hLUVk7h",
   *      "messagingEnabled": true,
   *      "createdAt": "2024-10-17T12:37:36.453Z",
   *      "updatedAt": "2024-10-24T11:53:08.239Z",
   *      "gender": "Male",
   *      "profileImage": "https://img.freepik.com/free-photo/",
   *      "id": "6711051061792663918458bf"
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
      const schoolData = await School.findOne({ _id: req.params.id });
      const user = await User.findOne({
        loginType: "admin",
        isSuperAdmin: false,
        _school: schoolData._id,
      }).select("-forgotpassword -password -bankDetails");

      const school = {
        ...schoolData.toObject(),
        admin: user,
      };

      return res.status(200).json({ error: false, school });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },

  /**
   * @api {post} /school Get All Schools
   * @apiName GetAllSchools
   * @apiGroup School
   * @apiVersion 1.0.0
   * @apiDescription Retrieve a paginated list of all schools with their associated admin details (only accessible by super admins).
   *
   * @apiPermission SuperAdmin
   *
   * @apiParam {Number} [pageNumber=1] Page number for pagination (optional).
   * @apiParam {Number} [pageSize=10] Number of records per page (optional).
   *
   * @apiSuccessExample Success Response:
   * HTTP/1.1 200 OK
   * {
   *   "error": false,
   *   "school": [
   *     {
   *       "_id": "603ddf15e245ae19f85ce109",
   *       "name": "Green Valley High School",
   *       "registrationNumber": "GVHS-1234",
   *       "address": {
   *         "city": "San Francisco",
   *         "state": "California",
   *         "country": "USA",
   *         "pinCode": "94107"
   *       },
   *       "contact": {
   *         "phoneNo": "+1 415-555-0198",
   *         "email": "info@greenvalleyhigh.com",
   *         "website": "www.greenvalleyhigh.com"
   *       },
   *       "location": {
   *         "type": "Point",
   *         "coordinates": [-122.399972, 37.781372]
   *       },
   *       "principalName": "Dr. John Doe",
   *       "establishYear": 1995,
   *       "schoolType": "highSchool",
   *       "totalStudents": 1200,
   *       "totalClasses": 40,
   *       "isActive": true,
   *       "admin": {
   *         "_id": "6711051061792663918458bf",
   *         "username": "mahesh",
   *         "firstName": "admin",
   *         "lastName": "abcd",
   *         "email": "mahesh123@gmail.com",
   *         "accountType": "email",
   *         "dob": "2001-12-08T00:00:00.000Z",
   *         "loginType": "admin",
   *         "isActive": true,
   *         "isAdmin": true,
   *         "isSuperAdmin": false,
   *         "bankAdded": false,
   *         "messagingEnabled": true,
   *         "createdAt": "2024-10-17T12:37:36.453Z",
   *         "updatedAt": "2024-10-24T11:53:08.239Z",
   *         "gender": "Male",
   *         "profileImage": "https://img.freepik.com/free-photo/sample-image.jpg"
   *       }
   *     }
   *   ],
   *   "totalSchools": 100
   * }
   *
   * @apiErrorExample Error Response:
   * HTTP/1.1 400 Bad Request
   * {
   *   "error": true,
   *   "reason": "You are not superadmin"
   * }
   *
   * @apiErrorExample Internal Server Error:
   * HTTP/1.1 500 Internal Server Error
   * {
   *   "error": true,
   *   "Error": "Server Error Message"
   * }
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

      const schools = await School.find().skip(skipNumber).limit(pageSize);
      const totalSchools = await School.countDocuments();

      const school = await Promise.all(
        schools.map(async (scl) => {
          const admin = await User.findOne({
            loginType: "admin",
            isSuperAdmin: false,
            _school: scl._id,
          }).select("-password -forgotpassword -bankDetails");
          return {
            ...scl.toObject(),
            admin: admin ? admin.toObject() : null,
          };
        })
      );

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
