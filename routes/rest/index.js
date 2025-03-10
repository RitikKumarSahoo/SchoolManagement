const express = require("express");
const router = express.Router();
const expressJwt = require("express-jwt");
const multer = require("multer");
const checkJwt = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
}); // the JWT auth check middleware

const users = require("./users");
const login = require("./auth/index");
const signup = require("./auth/signup");
const forgotpassword = require("./auth/password");
const school = require("../rest/school");
const attendance = require("../rest/attendance");
const classRoute = require("../rest/class");
const message = require("../rest/message");
const progressReportRoutes = require("../rest/progressReport");
const settings = require("../../routes/rest/settings");

// admin file
const adminUsers = require("./adminUsers");
const adminStudentRoutes = require("./adminStudent");
const adminNoticeRoutes = require("./adminNotices");
const adminScheduleRoutes = require("./adminSchedules");
const adminProgressReportRoutes = require("./adminProgressReport");
const adminTeacher = require("./adminTeacher");
const adminClassRoute = require("./adminClass");
const adminTransaction = require("./adminTransaction");
const adminStripe = require("../../lib/stripe");
const leave = require("./leave");
const video = require("./uploadvideo")
const upload = multer({ dest: "../public/uploads" });

router.get("/data",adminClassRoute.getData)
router.post("/login", login.post); // UNAUTHENTICATED
router.post("/forgotpassword", forgotpassword.startWorkflow); // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword); // UNAUTHENTICATED; AJAX

// Leave
router.get("/leave/:id", leave.get);

// upload video
router.post("/uploadvideo",upload.single('video'), video.uploadVideoToS3)

router.all("*", checkJwt); // use this auth middleware for ALL subsequent routes

router.post("/activatedeactivate/:id", signup.Deactive);
router.post("/admins", signup.getAllAdmin);
router.get("/admindetails/:id", signup.get);
router.put("/admin/update/:id", login.updateAdmin);
router.delete("/admin/delete/:id", signup.deleteUser);
router.post("/admin/find", signup.find);
router.post("/createadmin/:id", login.createAdmin);

//school
router.post("/schools", school.getAllSchool);
router.get("/school/:id", school.schoolDetails);
router.post("/createschool", school.Post);
router.put("/school", school.updateSchool);
router.delete("/school/delete/:id", school.deleteSchool);
//transaction

router.get("/user/:id", users.get);
router.put("/updateprofile/", users.editData);
router.post("/changepassword", users.changePassword);

const uplodFile = multer();
// router.post(
//   "/progressReport/teachers/create-progress-report",
//   upload.single("csvFile"),
//   progressReportRoutes.post
// );
// router.get("/progressReport/:id", progressReportRoutes.get);

router.post("/class/students", attendance.getClassStudentsForAttendance); //specific class
router.post("/markattendance", attendance.markAttendance);
router.get("/attendance/absent", attendance.getAbsentStudents);
router.get(
  "/attendance/percentage/:id",
  attendance.getStudentAttendancePercentage
);
router.post("/attendance/viewattendance", attendance.viewAttendance);
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

router.get("/profile", users.get);

// admin api

//stripe
router.get("/admin/return", adminStripe.onboardingComplete);
router.get("/admin/reauth", adminStripe.reauth);
router.post(
  "/admin/stripe/verifyconnectedaccount",
  adminStripe.verifyConnectedAccount
);
router.post("/admin/stripe/addcard", adminStripe.cardAdd);
router.post("/admin/confirmpayment", adminStripe.confirmpayment);

//list of all Student routers
router.post(
  "/admin/students/view-students",
  adminStudentRoutes.viewAllStudents
);
router.get("/admin/student/:id", adminStudentRoutes.viewStudentDetails);
router.post("/admin/student", adminStudentRoutes.createStudent);
router.post(
  "/admin/students/bulk-upload",
  uplodFile.single("studentCSV"),
  adminStudentRoutes.bulkCreateFromCSV
);
router.put("/admin/student/:id", adminStudentRoutes.editStudentDetails);
router.put(
  "/admin/student/change-status/:id",
  adminStudentRoutes.changeStudentStatus
);
//  router.get("/admin/students/search", adminStudentRoutes.searchStudents);
router.get("/admin/classsection/:id", adminStudentRoutes.fetchAllClassList);
router.post("/admin/lastrollnumber", adminStudentRoutes.getLastRollNumber);

// Noice board Rute
router.post("/admin/notices/allnotices", adminNoticeRoutes.findAllNotices); // Fetch all notices
router.get("/admin/notice/getNotice/:id", adminNoticeRoutes.get); // Get a notice by ID
router.post("/admin/notice/createnotice", adminNoticeRoutes.post); // Create a new notice
router.get("/awstempcreds", adminNoticeRoutes.getAwsKey); // Get AWS credentials
router.put("/admin/notice/editnotice/:id", adminNoticeRoutes.put); // Edit a notice by ID
router.post("/admin/notice/deletenotice/:id", adminNoticeRoutes.delete); // Delete a notice by ID

//Schedule Route
router.get("/admin/schedules/find-all-schedules", adminScheduleRoutes.find); // Fetch all schedules
router.get("/admin/schedule/get-schedule/", adminScheduleRoutes.get); // Get a schedule by ID
router.post("/admin/schedule/create-schedule", adminScheduleRoutes.post); // Create a new schedule
router.put("/admin/schedule/edit-schedule/:id", adminScheduleRoutes.put); // Edit a schedule by ID
router.delete("/admin/schedule/:id", adminScheduleRoutes.delete); // Delete a schedule by ID
router.post("/admin/fetchavailableteachers", adminScheduleRoutes.fetchAvailableTeachers);

//Progress Report Rooutec
router.post(
  "/admin/progressReport/createprogressreport",
  uplodFile.single("csvFile"),
  adminProgressReportRoutes.post
);
router.get(
  "/admin/progressReport/getprogressreport/:studentId",
  adminProgressReportRoutes.get
);
router.post("/getallprogressreport", adminProgressReportRoutes.getAllProgressReport);




router.get("/admin/user/:id", users.get);

//transaction
router.get("/admin/transaction/get/:id", adminTransaction.get);
router.get("/admin/transaction/pendingfee", adminTransaction.pendingPayment);
router.post("/admin/transaction/paymentfee", adminStripe.pay);
router.post("/admin/transaction/create", adminTransaction.createTransaction);
router.put("/admin/transaction/update", adminTransaction.updateTransaction);
router.post("/admin/salary", adminTransaction.Salary)
router.post("/user/transaction", adminTransaction.ownTransactionDetails)
router.post("/admin/transactions", adminTransaction.allTransaction)

// teacher
router.post("/admin/teachers", adminTeacher.getAllTeachers);
router.post("/admin/teacher/find", adminTeacher.find);
router.get("/admin/teacher/get/:id", adminTeacher.get);
router.post("/admin/teacher/create", adminTeacher.createTeacher);
router.put("/admin/teacher/update/:id", adminTeacher.updateTeacher);
router.delete("/admin/teacher/delete/:id", adminTeacher.deleteTeacher);
router.post(
  "/admin/teacher/bulkupload",
  uplodFile.single("teacherCSV"),
  adminTeacher.bulkCreateTeachers
);

// class
router.post("/admin/class/create", adminClassRoute.Post);
router.get("/admin/class/find", adminClassRoute.find);
router.get("/admin/class/get/:id", adminClassRoute.get);
router.post("/admin/class/assignclass", adminClassRoute.assignClass);

//settings
router.get("/admin/settings", settings.get);
router.post("/admin/setsettings", settings.settings);
router.put("/admin/updatesettings", settings.updateSettings);
router.delete("/admin/deletesetting", settings.deleteSetting);
router.post("/admin/setscheduletime", settings.setScheduleTime);

//Leave
router.post("/teacher/leave", leave.applyLeave);
router.post("/leave/get", leave.getLeaves);
router.post("/leave/find", leave.find);
router.post("/leaves", leave.allLeaves);
router.post("/leavestatus/:id", leave.leaveStatus);
router.get("/remainingleave", leave.remainingLeave)
router.get("/leave/:id", leave.get) // get a leave by ID

module.exports = router;
