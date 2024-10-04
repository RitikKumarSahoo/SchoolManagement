const express = require("express")
const router = express.Router()
const expressJwt = require("express-jwt")
const checkJwt = expressJwt({ secret: process.env.SECRET, algorithms: ['HS256'] }) // the JWT auth check middleware

const users = require("./users")
const studentRoutes = require("./student")
const noticeRoutes = require("./notices")
const scheduleRoutes = require("./schedules")
const progressReportRoutes = require("./progressReport")

const multer = require('multer');
const upload = multer({ dest: '../../public/docs/uploads' });

const teacher = require("./teacher");
const classRoute = require("./class");
const transaction = require("./transaction");
const stripe = require("../../lib/stripe");

//stripe
router.get("/return", stripe.onboardingComplete);
router.get("/reauth", stripe.reauth);
router.post("/stripe/verifyconnectedaccount", stripe.verifyConnectedAccount);
router.post("/stripe/addcard", stripe.cardAdd);
router.post("/confirmpayment", stripe.confirmpayment);

router.all("*", checkJwt);

//list of all routers
router.post("/students/create-student", studentRoutes.createStudent)
router.put("/student/edit/:id",studentRoutes.editStudentDetails)
router.get("/students/view-students/:SchoolId", studentRoutes.viewAllStudents)
router.get("/students/view-student/:studentId", studentRoutes.viewStudentDetails)
router.put("/students/deactivate/:studentId", studentRoutes.deactivateStudent)
router.get("/students/search/:query", studentRoutes.searchStudents)

// Noice board Rute
router.get("/notices", noticeRoutes.find); // Fetch all notices
router.get("/notice/:id",  noticeRoutes.get); // Get a notice by ID
router.post("/notice",  noticeRoutes.post); // Create a new notice
router.put("/notice/:id",  noticeRoutes.put); // Edit a notice by ID
router.delete("/notice/:id",  noticeRoutes.delete); // Delete a notice by ID

//Schedule Route
router.get("/schedules", scheduleRoutes.find); // Fetch all schedules
router.get("/schedule/:id",  scheduleRoutes.get); // Get a schedule by ID
router.post("/schedule",  scheduleRoutes.post); // Create a new schedule
router.put("/schedule/:id",  scheduleRoutes.put); // Edit a schedule by ID
router.delete("/schedule/:id",  scheduleRoutes.delete); // Delete a schedule by ID

//Progress Report Rooute
router.post("/progressReport/create-progress-report", upload.single('csvFile'), progressReportRoutes.post);
router.get("/progressReport/:studentId", progressReportRoutes.get)

module.exports = router
router.get("/user/:id", users.get);

//transaction
// router.post("/transaction/create", transaction.studentTransaction);
router.get("/transaction/pendingfee", transaction.pendingPayment);
router.post("/transaction/paymentfee", stripe.pay);

// teacher
router.get("/teacher/find", teacher.find);
router.get("/teacher/get", teacher.get);
router.post("/teacher/create", teacher.createTeacher);
router.put("/teacher/update/:id", teacher.updateTeacher);
router.delete("/teacher/delete/:id", teacher.deleteTeacher);

// class
router.post("/class/create", classRoute.Post);
router.get("/class/find", classRoute.find);
router.post("/class/assignclass", classRoute.assignClass);
module.exports = router;
