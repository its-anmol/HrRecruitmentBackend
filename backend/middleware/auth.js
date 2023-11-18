const ErrorHandler = require("../utils/errorhandler");
const catchAyncError = require("./catchAyncError");
const User=require("../models/Registrationmodel")

const jwt=require("jsonwebtoken")

exports.isAuthenticatedUser=catchAyncError(async (req,res,next)=>{
    const {token}=req.cookies;
    console.log(token)
    if(!token){
        return next(new ErrorHandler("Please login to access the ressource",401))
    }

    const decodedData=jwt.verify(token,process.env.JWt_SECRET)

    req.user=await User.findById(decodedData.id)
    next();
})

exports.authorizeRoles=(...roles)=>{
    return(req,res,next)=>{
        console.log(roles)
        if(!roles.includes(req.user.role)){
            next(new ErrorHandler(`Role:${req.user.role } is not allowd to to use this ressource`,401))}
        next();
    }

}