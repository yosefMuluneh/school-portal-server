const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser")
const authRouter =require("./routes/auth.js");
const adminRoute = require('./routes/admin.js')
const cookieParser = require('cookie-parser');
const studentRoute = require("./routes/student.js");
const teacherRoute = require("./routes/teacher.js");
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:3000", credentials:true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//All the routes here

//auth route entry
app.use('/auth', authRouter);


//admin route entry
app.use('/admin', adminRoute)

//student entry point
app.use('/student',studentRoute)


//teacher route entry point
app.use('/teacher',teacherRoute)


const PORT = process.env.PORT || 5000;


app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
});
app.listen(PORT, () => {
    console.log('Server started on port '+PORT);
  });




