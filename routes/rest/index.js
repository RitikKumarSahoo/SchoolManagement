const express = require("express");
const router = express.Router();
const expressJwt = require("express-jwt");
const checkJwt = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["RS256"],
}); // the JWT auth check middleware

const users = require("./users");
const login = require("./auth");
const signup = require("./auth/signup");
const forgotpassword = require("./auth/password");
const school = require("../rest/school");
const transaction = require("../rest/transaction");

router.post("/login", login.post); // UNAUTHENTICATED
router.post("/signup", signup.post); // UNAUTHENTICATED
router.post("/forgotpassword", forgotpassword.startWorkflow); // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword); // UNAUTHENTICATED; AJAX

//school
router.post("/createschool", school.Post);

//transaction
router.post("/transaction/create", transaction.studentTransaction);
router.get("/transaction/pendingfee", transaction.pendingPayment);

router.all("*", checkJwt); // use this auth middleware for ALL subsequent routes

router.get("/user/:id", users.get);

module.exports = router;
