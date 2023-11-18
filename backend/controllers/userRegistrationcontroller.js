const ErrorHandler=require("../utils/errorhandler")
const catchAyncError=require("../middleware/catchAyncError")
// model import
const User=require("../models/Registrationmodel")
const Profile=require("../models/profilemodel")
const Job=require("../models/jobmodel")
const Application=require("../models/applicationModel")
const sendToken=require("../utils/jwtToken");
const { reset } = require("nodemon");


// Register a user
exports.registerUser=catchAyncError( async(req,res,next)=>{
    const {firstName,lastName,email,password}=req.body;

    const user=await User.create({
        firstName:firstName,
        lastName:lastName,
        email:email,
        password:password
    });
    // Create a corresponding candidate profile
    const profile = await Profile.create({
      firstName: firstName,
      lastName: lastName,
      email:email,
    });

    // Link the profile to the signup
    user.profileId = profile._id;
    await user.save();

    const token=user.getJWTToken();
    res.status(201).json({
        success:true,
        user, 
        token
    })
});

// login user
exports.loginUser=catchAyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    // checking user entered both login id and password
    if(!email||!password){
        return next(new ErrorHandler("no email id or password entered",400))
    }
    const user=await User.findOne({email:email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401))
    }

    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401))
    }
    sendToken(user,200,res);
    // const token=user.getJWTToken();
    // res.status(200).json({
    //     success:true,
    //     token,
    // });
});


// Log out User
exports.logout=catchAyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
        success:true,
        message:"logout successfully"
    })
})

// Forget Password
exports.forgetPassword=catchAyncError(async(req,res,next)=>{
    const user=await User.findOne({
        email:req.body.email
    })
    if(!user){
        return next(new ErrorHandler("User not found",404))
    }
    // get reset password token
    const resetToken=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message=`Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n if you havent requested this mail then, please ignore it`;
    try{
        // await sendEmail({
        //     email:user.email
        // })
    }catch(error){
        user.resetPasswordExpire=undefined;
        user.resetPasswordToken=undefined;
        
    }


})

// PRofile api
exports.getProfile=catchAyncError(async (req, res,next) => {

      const profile = await Profile.findById(req.params.id);
      if (!profile) {
        return next(new ErrorHandler("profile not found",401));
      }
      res.status(200).json({
        success:"true",
        profile
    });
});

// Update Profile
exports.updateProfile=catchAyncError(async(req,res,next)=>{
    const profile = await Profile.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (!profile) {
        return next(new ErrorHandler("profile not found",401));
      }
      res.status(200).json({
        success:"true",
        profile
    });
      
})

// apply job
// router.post('/apply/:jobId',
exports.applyJob=catchAyncError(async (req, res,next) => {
    console.log(req.user);

      const jobId = req.params.jobId;
      const userId = req.user._id; 
  
      // Check if the job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return next(new ErrorHandler("Invalid job id",401))
      }
      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found",401))
      }
  
      // Check if the user has already applied to this job
      const existingApplication = await Application.findOne({ job: jobId, user: userId });
      if (existingApplication) {
        return next(new ErrorHandler("You have already applied for the job",409))
      }
  
      // Create a new application
      const newApplication = await Application.create({
        job: jobId,
        user: userId,
      });
  
      // Add the application reference to the job
      job.applications.push(newApplication._id);
      await job.save();
      // Add application reference to user
      user.applications.push(newApplication._id);
      await user.save();
  
      res.status(201).json({
        sucess:true,
        message: 'Application submitted successfully',
        newApplication
     });
    } 
  );
  
exports.getAllJob=(req,res)=>{
    console.log("ok")
    res.status(200).json({message:"Route is working fine"})
}