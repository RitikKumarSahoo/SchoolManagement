const School = require("../../models/school");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);

module.exports = {
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
};
