const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
 firstName:{
    type:String , 
    required : [true , "please enter your firstname"],
    minLength :3 ,
    trim: true
 },
 lastName:{
    type:String , 
    required : [true , "please enter your firstname"],
    minLength :3 ,
    trim: true
 },
 email:{
    type:String,
    unique : true,
    trim : true,
    lowercase: true,
    required: [true , "please enter your email"]
 },
 username:{
    type:String,
    unique : true,
    trim : true,
    lowercase: true,
    required: [true , "please enter your username"]
 },

 password:{
    type: String,
    minLength:8,
    trim:true,
    required:[true, "please enter your password"]
 },
 passwordConfirm:{
    type: String,
    minLength:8,
    trim:true,
    required:[true, "please confirm your password"]
 },
 passwordChangedAt : Date,

 role:{
    type:String, 
    default:"user",
    enum: ["admin" , "user"],
 },

 orders:[
    {
        type: Schema.Types.ObjectId,
        ref:"order",
    },
 ],



},
{timestamps:true}
);

userSchema.pre("save", async function(next){
   try {
      if(!this.isModified("password")){
         return next();
      }

      this.password = await bcrypt.hash(this.password,12);
      this.passwordConfirm = undefined;
   } catch (err) {
      console.log(err);
   }
})

userSchema.methods.checkPassword = async function(candidatePassword,userPassword){
   return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model("User", userSchema)