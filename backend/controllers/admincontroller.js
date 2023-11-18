const Job =require("../models/jobmodel")
const User=require("../models/Registrationmodel")
const Profile=require("../models/profilemodel")
const Application=require("../models/applicationModel")

const ErrorHandler = require("../utils/errorhandler")
const catchAysncError=require("../middleware/catchAyncError");
const ApiFeatures = require("../utils/apifeatures");
// POST JOB
exports.postjob=catchAysncError(async (req,res,next)=>{
    console.log(req.user);
    req.body.user=req.user.id;
    const job=await Job.create(req.body)
    res.status(201).json({
        success:true,
        job
    });
});
// View all job
exports.viewAllJob=catchAysncError(async (req,res,next)=>{
    const resultPerPage=5;
    const jobCount=await Job.countDocuments();
    console.log(jobCount)
    const apifeatures=new ApiFeatures(Job.find(),req.query).Search().filter().pagination(resultPerPage);
    const job=await apifeatures.query;
    res.status(201).json({
        success:true,
        job
    });
});
// edit job --ADMIN
exports.updateJob=catchAysncError(async (req,res,next)=>{
    let job=await Job.findById(req.params.id);
    if(!job){
        return res.status(500).json({
            success:false,
            message:"Job Not Find"
        })
    };
    job= await Job.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false}
    );
    res.status(200).json({
        success:true,
        job
    });
});

// delete job

exports.deleteJob=catchAysncError(async(req,res,next)=>{
    const job=await Job.findById(req.params.id);
    if(!job){
        res.status(500).json({
            success:false,
            message:"Job notificaation not found"
        })

    }
    await Job.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success:true,
        message:"Job notification Deleted"
    });
});

//get single job detail using id
exports.getjobdetail=catchAysncError(async(req,res,next)=>{
    const job=await Job.findById(req.params.id);
    if(!job){

        return next(new ErrorHandler("Job Id not found",404));
        
    }
    res.status(200).json({
        success:true,
        job
    });
});


// view all applicant

exports.viewAllApplication=catchAysncError(async (req, res,next) => {

    const jobId = req.params.id;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorHandler("Job Id invalid",404))
    }

    // Populate the 'applications' field to get candidate details
    // await job.populate('applications')
    // await job.populate('user')
    await job.populate({
        path: 'applications',
        populate: {
          path: 'user',
          model: 'Candidate',
          select: '_id firstName lastName email phone',
          populate: {
            path: 'profileId',
            model: 'Profile',
            select: '_id skills education experience'
          },
        },
      })
    const applications = job.applications;
    const count=applications.length;
    res.status(200).json({ 
        applications,
        applicationCount:count
    });
  } 
);


