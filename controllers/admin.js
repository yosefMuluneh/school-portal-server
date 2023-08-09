const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../dbConnection')

const postNews = async(req,res)  =>{
    const {title, description}=req.body
    const admName = req.user.fName+" "+req.user.lName
    const query1 = `INSERT INTO news (title, description, createdAt, updatedAt, admId, postedBy) VALUES (?,?,?,?,?,?)`;
      connection.query(query1, [title, description, new Date(Date.now()), new Date(Date.now()), req.user.id, admName], (err, result) => {
        if (err) return res.status(500).json({ message: "Internal server error" });
          return res.status(201).json({ message: "message posted succcesfully"});
        })
}
const getNews = async(req,res) =>{

    const query = `SELECT * FROM news`;

        connection.query(query,async (err, results) => {
          if (err) {
            return res.status(500).json({message:'Internal server error'});
            
          }
      
          if (results.length === 0) {
            return res.status(404).json({message:'No notice has been posted'});
            
          }
          console.log(results[0])
          res.status(201).json({
            news:results
          })
        })
} 
const editNews = async(req,res)=>{
  const {newsId}=req.params
  const {editedtitle,editedDescr}=req.body
  const date = new Date();

// Get the year, month, day, hour, minute, and second from the Date object
const year = date.getFullYear();
const month = ('0' + (date.getMonth() + 1)).slice(-2);
const day = ('0' + date.getDate()).slice(-2);
const hour = ('0' + date.getHours()).slice(-2);
const minute = ('0' + date.getMinutes()).slice(-2);
const second = ('0' + date.getSeconds()).slice(-2);

// Create the datetime string in the desired format
const datetimeString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
 
  const query = `UPDATE news SET title='${editedtitle}', description='${editedDescr}', updatedAt='${datetimeString}' WHERE id=${parseInt(newsId)}`
  
  connection.query(query,(err,response)=>{
    if(err) {
      return res.status(500).json({message:"internal server error"})
  }
    return res.status(200).json({message:"News Edited successfully"})
  })
}
const deleteNews=async(req,res)=>{
  const {newsId}=req.params
  const query = `DELETE FROM news WHERE id = '${parseInt(newsId)}'`
  connection.query(query,(err,response)=>{
    if(err) return res.status(500).json({message:"Internal server error"})
    return res.status(200).json({message:"News deleted succesfully"})
  })
}
const registerTeacher = async (req,res)=>{
  const {teacherId,fName,lName,subject,password} = req.body
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt);

  const query1 = `INSERT INTO teacher (id,fName, lName, subject, password) VALUES (?,?,?,?,?)`;
      connection.query(query1, [teacherId,fName, lName, subject, passwordHash], (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" })};
          return res.status(201).json({ message: "succcesfully registered a teacher"});
        })
}

const assignTeachers = async (req,res)=>{
  const {classId}=req.params
  const {assignedTeachers}= req.body
  const query = `SELECT teacher FROM class WHERE id = '${classId}'`
   connection.query(query,(error,response)=>{
    if(error) {
      return res.status(500).json({message:"Internal Server Error"})
    }
      const answer = Object.keys(JSON.parse(response[0].teacher))
      const fromFront = assignedTeachers.map(element => Object.keys(JSON.parse(element))
      );
      const parsedObj=assignedTeachers.map(element =>JSON.parse(element))
      const intoOneObj = parsedObj.reduce((result,current)=>{
        return Object.assign(result,current)
      },{})
      const courses = Object.keys(intoOneObj)
      const assignedteachersToclass = courses.map(element=>{
        const key = intoOneObj[element].split(",")[1].slice(0,-1)
        return key
      })
      console.log("teachers assigned class",assignedClass)
      const conctFront = [].concat(...fromFront)
      const alreadyAssigned = conctFront.filter(element=>answer.includes(element))
      const newAssign = conctFront.filter(element=>!answer.includes(element))
      const filteredObject = Object.fromEntries(
        Object.entries(intoOneObj)
          .filter(([key, value]) => newAssign.includes(key))
      );
    let sql1 = `JSON_MERGE(teacher, '${JSON.stringify(filteredObject)}') `;
      
      let sql = `UPDATE class
      SET teacher = JSON_SET(
        ${sql1}
        `
      let toAppend  = `) WHERE id = "${classId}";`;

      if(alreadyAssigned.length >0){
      for (let entry of alreadyAssigned){
        sql += `,'$.${entry}','${intoOneObj[entry]}'`
      }
    }else{
      sql1 = `UPDATE class
      SET teacher = ${sql1} WHERE id = "${classId}";`
    }

  sql += toAppend
  connection.query(alreadyAssigned.length >0?sql:sql1, (error, results, fields) => {
    if (error) {
      return res.status(500).json({message:"Internal server error"})
    };
    // const secQuery = `UPDATE teacher SET assignedClasses = JSON_SET() WHERE id = '${}'`
    return res.status(200).json({message:"Successfully assigned teachers"})
  })
});
  
 
  

}

const getAllTeachers = async (req,res)=>{
  const query = `SELECT * FROM teacher`;

        connection.query(query,async (err, results) => {
          if (err) {
            return res.status(500).json({message:'Internal server error'});
            
          }
      
          if (results.length === 0) {
            return res.status(404).json({message:'No teacher registered yet'});
          }
          res.status(201).json({
            teachers:results
          })
        })
}
const getAllCourses = async (req,res)=>{
  const query = 'SELECT * FROM course'
  connection.query(query,(err,response)=>{
    if(err) return res.status(500).json({message:"Internal server error"})
    return res.status(200).json({courses: JSON.parse(response[0].course_name)})
  })
}
const getClasses = async (req,res)=>{
  const query = `SELECT * FROM class`;

        connection.query(query,async (err, results) => {
          if (err) {
            return res.status(500).json({message:'Internal server error'});
          }
      
          if (results.length === 0) {
            return res.status(404).json({message:'No teacher registered yet'});
          }
          return res.status(201).json({
            classes:results
          })
        })
}

const registerStudent = async (req,res)=>{
  const { studentId, fName, lName, classSection, password } = req.body;
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password, salt);
const today = new Date();
const year = parseInt(today.getFullYear().toString().slice(-2)) - 8;
const classId = classSection + year.toString();
const query1 = `INSERT INTO student (id, fName, lName, myclass, classId, password) VALUES (?, ?, ?, ?, ?, ?)`;

connection.query(query1, [studentId, fName, lName, classSection.slice(-2), classSection, passwordHash], (err, result) => {
  if (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
  const newStudent = `${fName} ${lName}`;
 const sql = `UPDATE class SET students = JSON_MERGE(students, '{"${studentId}": "${newStudent}"}') WHERE id = "${classSection}"`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(201).json({ message: "Successfully registered a student" });
  });
});}
module.exports = {
    postNews,
    getNews,
    editNews,
    deleteNews,
    registerTeacher,
    assignTeachers,
    getAllTeachers,
    getAllCourses,
    getClasses,
    registerStudent
}