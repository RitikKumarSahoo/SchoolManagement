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
const message = require("../rest/message");

router.post("/login", login.post); // UNAUTHENTICATED
router.post("/forgotpassword", forgotpassword.startWorkflow); // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword); // UNAUTHENTICATED; AJAX

router.all("*", checkJwt); // use this auth middleware for ALL subsequent routes

router.post("/deactivate/:id", signup.Deactive);
router.get("/admin/getAll", signup.getAllAdmin);
router.get("/admin/get/:id", signup.get);
router.put("/admin/update/:id", login.updateAdmin);
router.delete("/admin/delete/:id", signup.deleteAdmin);

//school
router.get("/school/getAll", school.getAllSchool);
router.get("/school/:id", school.schoolDetails);
router.post("/school/createschool", school.Post);
router.put("/school/update/:id", school.updateSchool);
router.delete("/school/delete/:id", school.deleteSchool);
//transaction

router.get("/attendance/getstudents", attendance.getClassStudentsForAttendance); //specific class
router.post("/attendance/mark", attendance.markAttendance);
router.get("/attendance/absent", attendance.getAbsentStudents);
router.get("/attendance/percentage", attendance.getStudentAttendancePercentage);
router.get("/attendance/viewattendance", attendance.viewAttendance);
router.put("/attendance/update", attendance.updateAttendance);

//checkin
router.post("/attendance/checkin", attendance.checkIn);
router.get("/attendance/getcheckin", attendance.getTeacherCheckIns);

//class
router.get("/class/getallassignclass", classRoute.getAllAssignedClasses);

// message
router.post("/message/permission", message.messagePermission);
router.post("/message/createthread/:userId", message.createChatThread);
router.post("/message/sendmessage", message.sendMessage);
router.get("/message/readmessage/:id", message.getMessages);
router.get("/message/thread/:id", message.getChatThread);

router.get("/user/:id", users.get);

module.exports = router;
