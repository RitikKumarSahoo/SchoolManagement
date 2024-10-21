const User = require("../models/user/index");
const School = require("../models/school");
const Transaction = require("../models/transaction");
const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);

module.exports = {
  /**
   * @api {post} /transaction/paymentfee Pay Fee
   * @apiName PayFee
   * @apiGroup Transaction
   *
   * @apiHeader {String} Authorization Bearer token for student access.
   *
   * @apiParam {Number} amount Amount to be paid for fees.
   * @apiParam {Number} busFee Additional bus fee.
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "clientSecret": "pi_1J...2I_secret_...k4",
   *   "paymentIntent": {
   *     "id": "pi_1J...2I",
   *     "object": "payment_intent",
   *     "amount": 5000,
   *     "currency": "usd",
   *     // additional properties...
   *   },
   *   "transactionId": "60d5f60c9b4d7635e8aebaf7",
   *   "message": "Payment intent created, ready to confirm payment."
   * }
   *
   * @apiError StudentNotFound The student does not exist.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reasn": "student not found"
   * }
   *
   * @apiError SchoolNotFound The school associated with the student does not exist.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": "School not found"
   * }
   *
   * @apiError InternalServerError Internal server error during payment processing.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": "Internal server error"
   * }
   */
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

  /**
   * @api {post} /stripe/verifyconnectedaccount Verify Connected Account
   * @apiName VerifyConnectedAccount
   * @apiGroup Transaction
   *
   * @apiParam {String} accountID ID of the connected Stripe account.
   *
   * @apiSuccess {Object} accountLink Stripe account link object.
   * @apiSuccess {String} accountLink.url URL for onboarding or verification.
   * @apiSuccess {String} accountLink.id ID of the account link.
   * @apiSuccess {String} accountLink.object The type of the object returned (e.g., "account_link").
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "url": "https://stripe.com/connect/account_links/abc123",
   *   "id": "acct_link_123456789",
   *   "object": "account_link"
   * }
   *
   * @apiError InternalServerError Internal server error during account verification.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": "Error message detailing the issue"
   * }
   */

  async verifyConnectedAccount(req, res) {
    const { accountID } = req.body;
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountID,
        refresh_url: "http://localhost:3000/admin/v1/reauth",
        return_url: "http://localhost:3000/admin/v1/return",
        type: "account_onboarding",
      });
      return res.status(200).json(accountLink);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * @api {get} /reauth Re-authentication Required
   * @apiName Reauth
   * @apiGroup Transaction
   *
   * @apiDescription This endpoint informs users that they need to re-authenticate or provide additional information for their connected Stripe account.
   *
   * @apiSuccess {String} message Message indicating that re-authentication is required.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "message": "Please re-authenticate or provide additional information."
   * }
   */
  reauth(req, res) {
    // Inform users they need to re-authenticate or provide additional information
    res.send("Please re-authenticate or provide additional information.");
  },

  /**
   * @api {get} /return Onboarding Complete
   * @apiName OnboardingComplete
   * @apiGroup Stripe
   *
   * @apiDescription This endpoint renders a success page indicating that the onboarding process is complete.
   *
   * @apiSuccess {String} success Message indicating successful onboarding.
   *
   */
  onboardingComplete(req, res) {
    res.render("success");
  },

  /**
   * @api {post} /stripe/addcard Add Card to Customer
   * @apiName CardAdd
   * @apiGroup Stripe
   *
   * @apiParam {String} customerId ID of the Stripe customer.
   * @apiParam {String} token Token representing the card details.
   *
   * @apiDescription This endpoint allows adding a new card to a customer's account in Stripe.
   *
   * @apiSuccess {Object} stripeResponse Response from Stripe with the details of the added card.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "id": "card_1IRgAs2eZvKYlo2C6aZsDgYZ",
   *   "object": "card",
   *   "brand": "Visa",
   *   "last4": "4242",
   *   "exp_month": 12,
   *   "exp_year": 2025,
   *   ...
   * }
   *
   * @apiError {String} error Error message describing the issue.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": "Invalid card details."
   * }
   */
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

  /**
   * @api {post} /stripe/confirmpayment Confirm Payment
   * @apiName ConfirmPayment
   * @apiGroup Stripe
   *
   * @apiParam {String} paymentMethodId ID of the payment method to be confirmed.
   * @apiParam {String} transactionId ID of the transaction associated with the payment.
   *
   * @apiDescription This endpoint confirms a payment for a transaction using Stripe.
   *
   * @apiSuccess {Object} stripeResponse Response from Stripe with the details of the payment confirmation.
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "id": "pi_1IRgAs2eZvKYlo2C6aZsDgYZ",
   *   "object": "payment_intent",
   *   "status": "succeeded",
   *   ...
   * }
   *
   * @apiError {String} error Error message describing the issue.
   * @apiError {String} message Specific message if payment has already been successfully completed.
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": "Invalid payment method ID."
   * }
   *
   * @apiErrorExample {json} Already-Completed-Response:
   * {
   *   "message": "Payment has already been successfully completed."
   * }
   */
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
