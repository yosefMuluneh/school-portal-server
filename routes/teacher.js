const express = require('express')
const { verifyUserToken, IsTeacher, IsNotStudent, IsNotAdmin } = require('../middleware/authorize')
const { classStudents, studentAssessment, submitAssessment } = require('../controllers/teacher')

const teacherRoute = express.Router()

teacherRoute.use(verifyUserToken,IsTeacher,IsNotStudent,IsNotAdmin)

//retrieve students from a class
teacherRoute.get('/class-students/:classId',classStudents)

//get students assessments from a class
teacherRoute.get('/student-assessment/:classId/:mysubject',studentAssessment)

//submit assessments
teacherRoute.post('/submit-assessment/:classId/:mysubject',submitAssessment)

module.exports = teacherRoute