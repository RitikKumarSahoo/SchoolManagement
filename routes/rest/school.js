const { response } = require("express");
const School = require("../../models/school");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);

module.exports = {
  /**
   * @api {post} /api/v1/schools Create a new school with Stripe account
   * @apiName CreateSchool
   * @apiGroup School
   * @apiVersion 1.0.0
   * @apiDescription Creates a new school in the system and sets up a Stripe account for payment processing.
   *
   * @apiHeader {String} Authorization User's unique JWT token with "Bearer " prefix.
   * @apiHeader {String} Content-Type `application/json`
   *
   * @apiParam {String} name Name of the school.
   * @apiParam {String} registrationNumber Registration number of the school.
   * @apiParam {Object} address Address of the school.
   * @apiParam {String} address.city City of the school.
   * @apiParam {String} address.state State of the school.
   * @apiParam {String} address.country Country of the school.
   * @apiParam {String} address.pinCode Postal code of the school.
   * @apiParam {Object} contact Contact information of the school.
   * @apiParam {String} contact.phoneNo Phone number of the school.
   * @apiParam {String} contact.email Email address of the school.
   * @apiParam {String} contact.website Website of the school (optional).
   * @apiParam {Object} location Geographical location of the school.
   * @apiParam {String} location.type Type of the location, always set to `"Point"`.
   * @apiParam {Number[]} location.coordinates Longitude and latitude of the school as an array.
   * @apiParam {String} principalName Name of the school's principal.
   * @apiParam {Number} establishYear Year the school was established.
   * @apiParam {String} schoolType Type of the school, e.g., `"primary"`, `"secondary"`, `"highSchool"`.
   *
   * @apiSuccess {String} message Success message.
   * @apiSuccess {Object} school Details of the created school.
   * @apiSuccess {String} school._id ID of the school.
   * @apiSuccess {String} school.name Name of the school.
   * @apiSuccess {String} school.registrationNumber Registration number of the school.
   * @apiSuccess {Object} school.address Address details of the school.
   * @apiSuccess {Object} school.contact Contact details of the school.
   * @apiSuccess {Object} school.location Location coordinates of the school.
   * @apiSuccess {String} school.principalName Name of the school's principal.
   * @apiSuccess {Number} school.establishYear Establishment year of the school.
   * @apiSuccess {String} school.schoolType Type of the school.
   * @apiSuccess {String} stripeAccountId Stripe account ID created for the school.
   * @apiSuccess {Object} accountLink Stripe account onboarding link.
   * @apiSuccess {String} accountLink.url URL for Stripe account onboarding.
   * @apiSuccess {Number} accountLink.expires_at Expiration timestamp of the account link.
   *
   * @apiError (400) BadRequest The user is not an admin or the request is invalid.
   * @apiError (500) InternalServerError Server error during school creation.
   *
   * @apiErrorExample {json} 400 Error Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": true,
   *       "reason": "You are not admin"
   *     }
   *
   * @apiErrorExample {json} 500 Error Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "error": "Error message explaining the issue"
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
      const { loginType } = req.user;
      if (loginType !== "admin") {
        return res
          .status(400)
          .json({ error: true, reason: "You are not admin" });
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
   * @api {put} /school Update School Information
   * @apiName UpdateSchool
   * @apiGroup School
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {String} [name] The name of the school.
   * @apiParam {Object} [address] The address of the school.
   * @apiParam {String} [address.city] The city of the school.
   * @apiParam {String} [address.state] The state of the school.
   * @apiParam {String} [address.country] The country of the school.
   * @apiParam {String} [address.pinCode] The pin code of the school.
   * @apiParam {Object} [contact] The contact details of the school.
   * @apiParam {String} [contact.phoneNo] The phone number of the school.
   * @apiParam {String} [contact.email] The email address of the school.
   * @apiParam {String} [contact.website] The website of the school.
   * @apiParam {String} [principalName] The name of the principal.
   * @apiParam {Boolean} [isActive] Whether the school is active or not.
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error.
   * @apiSuccess {Object} school The updated school object.
   * @apiSuccess {String} school._id The unique ID of the school.
   * @apiSuccess {String} school.name The name of the school.
   * @apiSuccess {Object} school.address The address of the school.
   * @apiSuccess {Object} school.contact The contact details of the school.
   * @apiSuccess {String} school.principalName The name of the principal.
   * @apiSuccess {Boolean} school.isActive Whether the school is active or not.
   *
   * @apiError {Boolean} error Indicates whether there was an error.
   * @apiError {String} reason The reason for the error (e.g., "you are not admin", "school not found").
   */

  async updateSchool(req, res) {
    try {
      const { loginType } = req.user;
      const { name, address, contact, principalName, isActive } = req.body;
      if (loginType !== "admin") {
        return res
          .status(400)
          .json({ error: true, reason: "you are not admin" });
      }
      const school = await School.findOne({ _id: req.user.id });
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

      return response.status(400).json({ error: false, school });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },
};
