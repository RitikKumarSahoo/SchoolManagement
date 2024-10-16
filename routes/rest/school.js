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
    } = req.body;

    try {
      const { loginType, isSuperAdmin } = req.user;
      if (loginType !== "admin" && isSuperAdmin !== true) {
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
   * @apiDescription This endpoint allows a SuperAdmin to update the details of an existing school.
   *
   * @apiHeader {String} Authorization SuperAdmin's unique access token (JWT).
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
      const { loginType, isSuperAdmin } = req.user;
      const { name, address, contact, principalName, isActive } = req.body;

      if (loginType !== "admin" && isSuperAdmin !== true) {
        return res
          .status(400)
          .json({ error: true, reason: "you are not superadmin" });
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

      await school.save();

      return res.status(400).json({ error: false, school });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },
};
