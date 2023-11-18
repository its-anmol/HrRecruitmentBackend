const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Internship'],
    required: true,
  },
  salary: {
    type: Number,
  },
  qualifications: {
    type: [String],
    required: true,
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  user:{
    type: mongoose.Schema.ObjectId,
    ref:"Candidate",
    required:true,
  },
  status: {
    type: Boolean,
    default: true, // Default to an active job posting
  },
  applications: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Application',
  }],
  // You can add more fields as needed, e.g., application submission instructions, company info, etc.
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
