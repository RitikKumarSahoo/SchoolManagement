const express = require("express")
const router = express.Router()
const expressJwt = require("express-jwt")
const checkJwt = expressJwt({ secret: process.env.SECRET, algorithms: ['RS256'] }) // the JWT auth check middleware

const users = require("./users")
const studentRoutes = require("./student")


//list of all routers
router.post("/students/create-student", studentRoutes.createStudent)
router.put("/students/edit-student",studentRoutes.editStudentDetails)
router.get("/students/view-students/:SchoolId", studentRoutes.viewAllStudents)
router.get("/students/view-student/:studentId", studentRoutes.viewStudentDetails)
router.put("/students/deactivate/:studentId", studentRoutes.deactivateStudent)
router.get("/students/search/:query", studentRoutes.searchStudent)



router.all("*", checkJwt) // use this auth middleware for ALL subsequent routes

router.get("/user/:id", users.get)

module.exports = router
