const express = require("express")
const {postNews, getNews, registerTeacher, getAllTeachers, getClasses, registerStudent, editNews, deleteNews, getAllCourses, assignTeachers }= require("../controllers/admin.js")
const { IsAdmin, verifyUserToken, IsNotStudent, IsNotTeacher } = require("../middleware/authorize.js")
const adminRoute = express.Router()

adminRoute.use(verifyUserToken,IsAdmin,IsNotStudent,IsNotTeacher)
//post news
adminRoute.post('/post',postNews)

//get news
adminRoute.get('/news',getNews)

//edit news
adminRoute.put('/edit-news/:newsId',editNews)

//delete news
adminRoute.delete('/delete-news/:newsId',deleteNews)

//register a teacher
adminRoute.post('/new-teacher',registerTeacher)

//assign teachers
adminRoute.post('/assign-teachers/:classId',assignTeachers)

//get all teachers
adminRoute.get("/teachers",getAllTeachers)

//get all courses
adminRoute.get('/all-courses',getAllCourses)

//get all classes
adminRoute.get('/all-classes',getClasses)

//register a student
adminRoute.post('/new-student',registerStudent)

module.exports = adminRoute