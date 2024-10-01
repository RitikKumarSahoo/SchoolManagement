const express = require("express");
const router = express.Router();
const expressJwt = require("express-jwt");
const checkJwt = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
}); // the JWT auth check middleware

const users = require("./users");
const teacher = require("./teacher");
const classRoute = require("./class");
const transaction = require("./transaction");
const student = require("./student");
router.all("*", checkJwt); // use this auth middleware for ALL subsequent routes

router.get("/user/:id", users.get);

//transaction
router.post("/transaction/create", transaction.studentTransaction);
router.get("/transaction/pendingfee", transaction.pendingPayment);

// teacher
router.get("/teacher/find", teacher.find);
router.get("/teacher/get", teacher.get);
router.post("/teacher/create", teacher.createTeacher);
router.put("/teacher/update/:id", teacher.updateTeacher);
router.delete("/teacher/delete/:id", teacher.deleteTeacher);

router.post("/student/create", student.createStudent);

// class
router.post("/class/create", classRoute.Post);
router.get("/class/find", classRoute.find);
router.post("/class/assignclass", classRoute.assignClass);
module.exports = router;
