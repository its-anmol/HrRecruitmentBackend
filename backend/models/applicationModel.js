const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Candidate',
    required: true,
  },
  
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Accepted', 'Rejected'],
    default: 'Applied',
  },
  appliedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
