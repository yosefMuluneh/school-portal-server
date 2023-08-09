const express = require("express")
const {signupAdmin,loginUser, logout, myProfile, getNews }= require("../controllers/auth.js")
const { verifyUserToken } = require("../middleware/authorize.js")

const authRouter = express.Router()

//signup admin
authRouter.post('/signup', signupAdmin)

//Login
authRouter.post('/login', loginUser)

//logout
authRouter.get('/logout',logout)

//my profile
authRouter.get('/my-profile/:myId',verifyUserToken,myProfile)


//get news
authRouter.get('/notices',verifyUserToken,getNews)
module.exports=authRouter;