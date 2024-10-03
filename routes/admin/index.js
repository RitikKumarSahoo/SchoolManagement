const express = require("express")
const router = express.Router()
const expressJwt = require("express-jwt")
const checkJwt = expressJwt({ secret: process.env.SECRET, algorithms: ['RS256'] }) // the JWT auth check middleware

const users = require("./users")
const studentRoutes = require("./student")
const noticeRoutes = require("./notices")
const scheduleRoutes = require("./schedules")
const progressReportRoutes = require("./progressReport")

const multer = require('multer');
const upload = multer({ dest: '../../public/docs/uploads' });


router.all("*", checkJwt) // use this auth middleware for ALL subsequent routes

router.get("/user/:id", users.get)

//list of all routers
router.post("/students/create-student", studentRoutes.createStudent)
router.put("/students/edit-student",studentRoutes.editStudentDetails)
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
router.post("/progressReport/:studentId", progressReportRoutes.get)

module.exports = router
