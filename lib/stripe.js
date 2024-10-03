const User = require("../models/user/index");
const School = require("../models/school");
const Transaction = require("../models/transaction");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);

module.exports = {
  // student fee payment
  async pay(req, res) {
    const { amount, busFee } = req.body;

    try {
      const student = await User.findOne({
        _id: req.user.id,
        loginType: "student",
      });

      if (student === null) {
        return res
          .status(400)
          .json({ error: true, reasn: "student not found" });
      }

      const school = await School.findOne({ _id: student._school });
      if (school === null) {
        return res.status(404).json({ error: "School not found" });
      }

      const transaction = await Transaction.create({
        _user: student._id,
        amount: amount,
        busFee: busFee,
        totalAmount: amount + busFee,
        status: "pending",
      });
      console.log(transaction);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: (amount + busFee) * 100,
        currency: "usd",
        customer: student.customerStripeId,
        payment_method_types: ["card"],
        transfer_data: {
          destination: school.stripeAccountId,
        },
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntent,
        transactionId: transaction._id,
        message: "Payment intent created, ready to confirm payment.",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //payment confirmation
  async verifyConnectedAccount(req, res) {
    const { accountID } = req.body;
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountID,
        refresh_url: "http://localhost:3000/api/v1/reauth",
        return_url: "http://localhost:3000/api/v1/return",
        type: "account_onboarding",
      });
      return res.status(200).json(accountLink);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  reauth(req, res) {
    // Inform users they need to re-authenticate or provide additional information
    res.send("Please re-authenticate or provide additional information.");
  },
  onboardingComplete(req, res) {
    res.render("success");
  },

  async cardAdd(req, res) {
    const { customerId, token } = req.body;
    try {
      const stripeResponse = await stripe.customers.createSource(customerId, {
        source: token,
      });
      return res.status(200).json(stripeResponse);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async confirmpayment(req, res) {
    const { paymentMethodId, transactionId } = req.body;

    try {
      // Fetch the transaction
      const transaction = await Transaction.findOne({ _id: transactionId });

      if (transaction.status === "success") {
        return res.status(400).json({
          message: "payment has already been successfully completed.",
        });
      }

      const stripeResponse = await stripe.paymentIntents.confirm(
        paymentMethodId,
        {
          payment_method: "pm_card_visa",
          return_url: "http://localhost:3000/api/v1/return",
        }
      );

      if (stripeResponse.status === "succeeded") {
        transaction.status = "success";
        transaction.date = Date.now();
        await transaction.save();
      }

      return res.status(200).json(stripeResponse);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
