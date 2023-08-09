const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../dbConnection')

//signup admin
const signupAdmin = async (req,res) =>{
    const {userId,password,fName,lName} = req.body;
    const salt = await bcrypt.genSalt(10)
    console.log(req.body)
    const passwordHash = await bcrypt.hash(password, salt);
    const query = `INSERT INTO admin (id, password, fName, lName) VALUES (?,?,?,?)`;

  connection.query(query,[userId,passwordHash,fName,lName], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal server error');
      return;
    }
    console.log('User added to MySQL database with ID:', result.insertId);
    res.status(200).json({user:'User registered successfully!'});
  });
}

//login user
const loginUser = async (req, res) => {
    const { userId, password } = req.body;
    console.log(req.body)
    let role = ''
    let table = ''
    if(userId.includes("ADM")){ 
      role = "Admin"
      table = "admin"
    }
    if(userId.includes("STU")){ 
      role = "Student"
      table = "student"
    }
    if(userId.includes("TCH")) {
      role = "Teacher"
      table = "teacher"
    }

    const query = `SELECT * FROM ${table} WHERE id = '${userId}' `

    try {

        connection.query(query,async (err, results) => {
          if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send('Internal server error');
            return;
          }
      
          if (results.length === 0) {
            res.status(404).json({message:'Invalid user ID'});
            return;
          }
      
          const user = results[0];
          console.log("user while loggin in",user)
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({message:"Invalid Password"});
  
          const payload = { id: user.id, role: role, fName:user.fName, lName:user.lName }; 
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

          res.cookie("token", token, { httpOnly: true, secure: true });
          res["token"] = token
          res.status(200).json({ token , role:payload.role,userId:payload.id,fName:user.fName,lName:user.lName});
        });
  
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }

  const logout = (req,res)=>{
    var cookieNames = Object.keys(req.cookies);
    console.log(cookieNames)
    cookieNames.forEach(cook=>{
      res.clearCookie(cook)
      
    })
    if(req.session){
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      }
      // redirect user to login page
      res.redirect('/');
    });
    }else{
      res.redirect('/')
    }
    
  }

  const myProfile = async(req,res)=>{
    const {myId}=req.params
    let mytable = ''
    if (myId.includes('ADM')) mytable = 'admin'
    else if (myId.includes('TCH')) mytable = 'teacher'
    else if (myId.includes('STU')) mytable = 'student'
    const char = '/'
    const userId = myId.slice(0, 3) + char + myId.slice(3);
    const query = `SELECT * FROM ${mytable} WHERE id = '${userId}'`
    connection.query(query,(error,response)=>{
      if (error) return res.status(500).json({message:"Internal server error"})
      return res.status(200).json({user:response[0]})
    })
  
  
  }

  const getNews = async(req,res) =>{

    const query = `SELECT * FROM news`;

        connection.query(query,async (err, results) => {
          if (err) {
            console.log("error over here",err)
            return res.status(500).json({message:'Internal server error'});
            
          }
      
          if (results.length === 0) {
            return res.status(404).json({message:'No notice has been posted'});
            
          }
          
          return res.status(201).json({
            news:results
          })
        })
} 

module.exports = {
  signupAdmin,
  loginUser,
  logout,
  myProfile,
  getNews
}