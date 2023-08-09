const jwt = require("jsonwebtoken");

const verifyUserToken = async (req, res, next) => {
    let token = req.cookies.token;
    if (!token) return res.status(401).send("Access Denied / Unauthorized request");

    try {
        if (token === 'null' || !token) return res.status(401).json({message:'Unauthorized request'});
        let verifiedUser = jwt.verify(token, process.env.JWT_SECRET);   
        if (!verifiedUser) return res.status(401).json({message:'Unauthorized request'})

        req.user = verifiedUser;
        next();

    } catch (error) {
        return res.status(400).json({message:"Invalid Token"});
    }

}

const IsStudent =  (req, res, next) => {
    if (req.user.role === 'Student') {
       return next();
    }
    return res.status(401).send("Unauthorized!");   
}
const IsAdmin =  (req, res, next) => {
    if (req.user.role === "Admin") {
       return next();
    }

    return res.status(401).json({message:"Unauthorized!"});
}
const IsTeacher =  (req, res, next) => {
    console.log(req.user.role === "Teacher")
    if (req.user.role === "Teacher") {
       return next();
    }

    return res.status(401).send("Unauthorized!");
}
const IsNotStudent =  (req, res, next) => {
    if (req.user.role !== 'Student') {
       return next();
    }
    return res.status(401).send("Unauthorized!");   
}

const IsNotAdmin =  (req, res, next) => {
    if (req.user.role !== 'Admin') {
       return next();
    }
    return res.status(401).send("Unauthorized!");   
}
const IsNotTeacher = (req,res,next)=>{

    if (req.user.role !== 'Teacher') {
        return next();
     }
     return res.status(401).send("Unauthorized!");
}

module.exports = {
    verifyUserToken,
    IsAdmin,
    IsStudent,
    IsTeacher,
    IsNotAdmin,
    IsNotStudent,
    IsNotTeacher
}