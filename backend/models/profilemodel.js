const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
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
  phone: {
    type: String,
  },
  resume: {
    type: String, // You may want to store the file path or use a different type if storing actual files
  },
  skills: {
    type: [String],
  },
  education: {
    type: [
      {
        degree: String,
        institution: String,
        graduationYear: Number,
      },
    ],
  },
  experience: {
    type: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
      },
    ],
  },
  // Add more fields as needed
});

const Profile = mongoose.model('Profile', candidateProfileSchema);

module.exports = Profile;
