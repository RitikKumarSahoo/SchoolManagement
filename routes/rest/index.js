const express = require("express")
const expressJwt = require("express-jwt")
const router = express.Router()
const checkJwt = expressJwt({ secret: process.env.SECRET, algorithms: ['HS256'] }) // the JWT auth check middleware


const multer = require('multer');
const upload = multer({ dest: '../../public/docs/uploads' });

const users = require("./users")
const login = require("./auth")
const signup = require("./auth/signup")
const forgotpassword = require("./auth/password")
const progressReportRoutes = require("./progressReport")

router.post("/login", login.post) // UNAUTHENTICATED
router.post("/signup", signup.post) // UNAUTHENTICATED
router.post("/forgotpassword", forgotpassword.startWorkflow) // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword) // UNAUTHENTICATED; AJAX

router.all("*", checkJwt) // use this auth middleware for ALL subsequent routes

router.get("/user/:id", users.get)
router.post("/user/edit-profile/:id", users.editData)

router.post("/progressReport/teachers/create-progress-report", upload.single('csvFile'), progressReportRoutes.post);
router.get("/progressReport/:id", progressReportRoutes.get)


module.exports = router
