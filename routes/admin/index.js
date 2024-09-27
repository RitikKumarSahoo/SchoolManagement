const express = require("express");
const router = express.Router();
const expressJwt = require("express-jwt");
const checkJwt = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["RS256"],
}); // the JWT auth check middleware

const teacher = require("./teacher");

router.all("*", checkJwt); // use this auth middleware for ALL subsequent routes

router.get("/user/:id", users.get);

// teacher
router.post("/teacher/create", teacher.createTeacher);
router.put("/teacher/update/:id", teacher.updateTeacher);
router.delete("/teacher/delete/:id", teacher.deleteTeacher);

module.exports = router;
