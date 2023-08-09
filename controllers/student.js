const connection = require('../dbConnection')




const myAssessment = async(req,res)=>{
  const {userId}=req.params
  const query = `SELECT * FROM assessments WHERE stuId = '${userId}'`
  connection.query(query,(error,response)=>{
    if(error){
      console.log(error)
      return res.status(500).json({message:"Internal Server Error"})
    }
    if(response.length === 0) return res.status(404).json({message:"No assessments submitted yet by teacher"})
    console.log("assssssss",response)
    return res.status(200).json({myassessment:response})
  })
}

module.exports ={
  myAssessment
}