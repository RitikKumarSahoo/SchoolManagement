const { response } = require("express");
const School = require("../../models/school");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);

module.exports = {
  /**
   * @api {post} /schools Create School by SuperAdmin
   * @apiName CreateSchool
   * @apiGroup School
   * @apiVersion 1.0.0
   * @apiDescription This endpoint allows a SuperAdmin to create a new school and a Stripe account for the school.
   *
   * @apiHeader {String} Authorization SuperAdmin's unique access token (JWT).
   *
   * @apiParam {String} name The name of the school.
   * @apiParam {String} registrationNumber The registration number of the school.
   * @apiParam {Object} address The address of the school.
   * @apiParam {String} address.city City of the school.
   * @apiParam {String} address.state State of the school.
   * @apiParam {String} address.country Country of the school.
   * @apiParam {String} address.pinCode Pin code of the school.
   * @apiParam {Object} contact The contact details of the school.
   * @apiParam {String} contact.phoneNo Phone number of the school.
   * @apiParam {String} contact.email Email address of the school.
   * @apiParam {String} contact.website Website of the school (if applicable).
   * @apiParam {Object} location The geographical location of the school.
   * @apiParam {String} location.type The location type (usually "Point").
   * @apiParam {Number[]} location.coordinates The longitude and latitude of the school [longitude, latitude].
   * @apiParam {String} principalName The name of the principal.
   * @apiParam {Number} establishYear The year the school was established.
   * @apiParam {String} schoolType The type of the school (e.g., primary, secondary, highSchool).
   * @apiParam {String} imageUrl   Image of school
   *
   * @apiSuccess {String} message A success message.
   * @apiSuccess {Object} school The created school object.
   * @apiSuccess {String} stripeAccountId The Stripe account ID associated with the school.
   * @apiSuccess {Object} accountLink The Stripe account onboarding link.
   *
   * @apiError (400) {Boolean} error Whether there was an error.
   * @apiError (400) {String} reason Reason for the error (if applicable).
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You are not superadmin"
   *     }
   *
   * @apiError (500) {Boolean} error Whether there was an internal server error.
   * @apiError (500) {String} message Error message (if internal error occurs).
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": true,
   *       "message": "Internal Server Error"
   *     }
   */
  async Post(req, res) {
    const {
      name,
      registrationNumber,
      address,
      contact,
      location,
      principalName,
      establishYear,
      schoolType,
      imageUrl,
    } = req.body;

    try {
      const { loginType, isSuperAdmin } = req.user;
      if (isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not superadmin" });
      }
      const account = await stripe.accounts.create({
        type: "custom",
        country: "US",
        business_type: "company",
        business_profile: {
          name: name,
          product_description: "Educational Institution",
          support_email: contact.email,
        },
        email: contact.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: "http://localhost:3000/api/v1/reauth",
        return_url: "http://localhost:3000/api/v1/return",
        type: "account_onboarding",
      });

      const school = await School.create({
        name,
        registrationNumber,
        address,
        contact,
        location,
        principalName,
        establishYear,
        schoolType,
        stripeAccountId: account.id,
        isActive: true,
        imageUrl,
      });

      res.status(201).json({
        message: "School created successfully!",
        school,
        stripeAccountId: account.id,
        accountLink,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * @api {put} /school/update/:id Update School
   * @apiName UpdateSchool
   * @apiGroup School
   * @apiVersion 1.0.0
   * @apiDescription This endpoint allows a admin to update the details of an existing school.
   *
   * @apiHeader {String} Authorization admin's unique access token (JWT).
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
   * @apiParam {String} [principalName] The updated principal's name.
   * @apiParam {Boolean} [isActive] Update the activation status of the school.
   * @apiParam {Boolean} [imageUrl] image of school
   *
   * @apiSuccess {Boolean} error Whether there was an error (false if successful).
   * @apiSuccess {Object} school The updated school object.
   *
   * @apiError (400) {Boolean} error Whether there was an error.
   * @apiError (400) {String} reason Reason for the error (if applicable).
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You are not superadmin"
   *     }
   *
   * @apiError (500) {Boolean} error Whether there was an internal server error.
   * @apiError (500) {String} Error Error message (if internal error occurs).
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
      const { loginType } = req.user;
      const {
        name,
        address,
        contact,
        principalName,
        isActive,
        schoolType,
        imageUrl,
      } = req.body;

      if (loginType !== "admin") {
        return res
          .status(400)
          .json({ error: true, reason: "you are not admin" });
      }
      const school = await School.findOne({ _id: req.params.id });
      if (school === null) {
        return res
          .status(400)
          .json({ error: true, reason: "school not found" });
      }

      if (name !== undefined) school.name = name;
      if (address !== undefined) school.address = address;
      if (contact !== undefined) school.contact = contact;
      if (principalName !== undefined) school.principalName = principalName;
      if (isActive !== undefined) school.isActive = isActive;
      if (schoolType !== undefined) school.schoolType = schoolType;
      if (imageUrl !== undefined) school.imageUrl = imageUrl;

      await school.save();

      return res.status(400).json({ error: false, school });
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
   * @api {get} /school Get All Schools
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
      const { isSuperAdmin } = req.user;
      if (isSuperAdmin === true) {
        return res
          .status(400)
          .json({ error: true, reason: "You are not superadmin" });
      }

      const school = await School.find();
      return res.status(200).json({ error: false, school });
    } catch (error) {
      return res.status(400).json({ error: true, Error: error.message });
    }
  },

  /**
   * @api {delete} /school/:id Delete School
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
