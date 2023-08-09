const express = require("express")
const { verifyUserToken, IsStudent, IsNotAdmin, IsNotTeacher } = require("../middleware/authorize")
const {  myAssessment } = require("../controllers/student")
const studentRoute = express.Router()


studentRoute.use(verifyUserToken,IsStudent,IsNotTeacher,IsNotAdmin)

//load my assessments
studentRoute.get('/my-assessment/:userId',myAssessment)

module.exports = studentRoute