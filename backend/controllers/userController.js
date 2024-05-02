const User = require("../models/userModel");
const validator = require("validator");
const jwt = require("jwt");

const signToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn :process.env,JWT_EXPIRES_IN,
    })
}


const createSendToken = (user,statusCode,res)=>{
const token = signToken(user._id);
res.status(statusCode).json({
    status:"success",
    token,
    data:{
        user,
    }
})
}


exports.signup = async(req,res)=>{
    try{

        const emailCheck = await User.findOne({ email: req.body.email })
        if(emailCheck){
            return res.status(409).json({message: "the email is already in use"});
        }

        if(validator.isEmail(req.body.email)){
            return res.status(400).json({message: "the email is not valid"});
        }

        if(req.body.password !== req.body.passwordConfirm){
            return res.status(400).json({message : "Password and the password confirm dont match"})
        }

        const newUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            password:req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
        });

        createSendToken(newUser , 201 , res)
    }catch(err){
        res.status(500).json({message: err.message});
        console.log(err);
    }
}



exports.login = async (req, res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        if(!(await user.checkPassword(password,user.password))){
            return res.status(401).json({message : "Incorrect pass or email"})
        }
        createSendToken(user, 201, res)
    } catch (err) {
        console.log(err);
    }
}