const { query } = require('express')
const connection = require('../dbConnection.js')


  const classStudents = async(req,res)=>{
    const {classId}=req.params
    if(classId){
      console.log("undefine or what",classId)
    const query = `SELECT * FROM class WHERE id = '${classId}'`
    connection.query(query,(error,response)=>{
      if (error) return res.status(500).json({message:"Internal server error"})
      console.log("students",response)
      const students = JSON.parse(response[0].students)
      return res.status(200).json({students})
    })
    }else{
      res.status(500).json({message:"Internal server error, try again"})
    }
  
  }

  const studentAssessment = async (req,res)=>{
    const {classId,mysubject} = req.params
    if(classId && mysubject){
      console.log("check truthy value",classId && mysubject)
    const query = `SELECT * FROM assessments WHERE myclass = '${classId}' AND mycourse='${mysubject}'`
  connection.query(query,(error,response)=>{
    if(error){
      return res.status(500).json({message:"Internal Server Error"})
    }
    console.log(response)
    return res.status(200).json({myassessment:response})
  })
}else{
  return res.status(500).json({message:"Internal Server Error, try again"})

}
  }

  const submitAssessment = async(req,res)=>{
    const {classId,mysubject} = req.params
    const {assessname,baseMark,marks,students,myname} = req.body
    const studentIds = Object.keys(marks)
console.log(req.params,req.body)
const query1 = `SELECT assessments FROM assessments WHERE myclass = '${classId}' AND mycourse='${mysubject}'`
    let eachassess = []
    connection.query(query1,(error,response)=>{
      if(error) {
        console.log("my error", error)
        return res.status(500).json({message:"internal server error"})
      }
        console.log("the assemnest",response[0])
       eachassess = Object.keys(JSON.parse(response[0]? response[0].assessments : '{}'))
      console.log("the assessments",eachassess)

    

      if(eachassess.length === 0){
        let query = ``
    for (ids of studentIds){
      const stuId = ids.split('/')[0] + ids.split('/')[1]
      const mymark = [parseInt(marks[ids]),baseMark]
      console.log(mymark)
      const stuname = students[ids]
      query += `INSERT INTO assessments (stuId, myname,myclass,myteacher,assessments,mycourse) VALUES ('${stuId}','${stuname}','${classId}','${myname}','{"${assessname}":[${mymark}]}','${mysubject}'); `
    }
  
  console.log(query)
  connection.query(query,(error,response)=>{
    if(error){
      console.log(error)
      return res.status(500).json({message:"Internal server error, try again!"})
    }
    console.log(response)
    return res.status(201).json({message:"Successfully set assessments"})
  })
      }
    else if(!eachassess.includes(assessname)){
      let query = ``
    for (ids of studentIds){
      const stuId = ids.split('/')[0] + ids.split('/')[1]
      const mymark = [parseInt(marks[ids]),baseMark]
      console.log(mymark)

      query += `UPDATE assessments SET assessments = JSON_MERGE(assessments,'{"${assessname}":[${mymark}]}') WHERE stuId = '${stuId}' AND myclass = '${classId}' AND  mycourse = '${mysubject}'; `
    }
  
  console.log(query)
  connection.query(query,(error,response)=>{
    if(error){
      console.log(error)
      return res.status(500).json({message:"Internal server error, try again!"})
    }
    console.log(response)
    return res.status(201).json({message:"Successfully set assessments"})
  })
}else{
return res.status(409).json({message:"Assessment name already found, rename it please"})
}
  })
  }
  module.exports = {
    classStudents,
    studentAssessment,
    submitAssessment
  }