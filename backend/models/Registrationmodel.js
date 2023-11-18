const mongoose = require('mongoose');
const bcrypt=require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto=require("crypto");
const Profile=require("../models/profilemodel")

const candidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    default:"user"
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },
  applications: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Application',
  }],
  resetPasswordToken:String,
  resetPasswordExpire:Date,
  // You can add more basic details as needed for the signup process
});

candidateSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10)
})
 
// JWT TOKEN
candidateSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
}

// compare password   
candidateSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

// Generating Password Token
candidateSchema.methods.getResetPasswordToken= function(){
  // generating Token
  const resetToken=crypto.randomBytes(20).toString("hex");
  // Hashing and adding to user Schema
  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire=Date.now()+15*60*1000;

  return resetToken;
}

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
