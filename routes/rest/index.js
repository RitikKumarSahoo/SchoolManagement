const express = require("express");
const router = express.Router();
const expressJwt = require("express-jwt");
const checkJwt = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
}); // the JWT auth check middleware

const users = require("./users");
const login = require("./auth");
const signup = require("./auth/signup");
const forgotpassword = require("./auth/password");
const school = require("../rest/school");
const attendance = require("../rest/attendance");
const classRoute = require("../rest/class");

router.post("/login", login.post); // UNAUTHENTICATED
router.post("/signup", signup.post); // UNAUTHENTICATED
router.post("/signup/admin", signup.signupByAdmin);
router.post("/forgotpassword", forgotpassword.startWorkflow); // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword); // UNAUTHENTICATED; AJAX

router.all("*", checkJwt); // use this auth middleware for ALL subsequent routes
//school
router.post("/createschool", school.Post);

//transaction

router.get("/attendance/getstudents", attendance.getClassStudentsForAttendance); //specific class
router.post("/attendance/mark", attendance.markAttendance);
router.get("/attendance/absent", attendance.getAbsentStudents);
router.get("/attendance/percentage", attendance.getStudentAttendancePercentage);

//class
router.get("/class/getallassignclass", classRoute.getAssignedClasses);

router.get("/user/:id", users.get);

module.exports = router;
