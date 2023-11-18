const express=require("express");
const { registerUser, loginUser, logout, getProfile, updateProfile, applyJob } = require("../controllers/userRegistrationcontroller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router=express.Router();

/* Register User */
router.route("/register").post(registerUser)

/* Login User */
router.route("/login").post(loginUser)

/* Logout User */
router.route("/logout").get(logout)

router.route("/profile/:id").get(getProfile).put(updateProfile);

router.route("/apply/:jobId").post(isAuthenticatedUser,authorizeRoles("user"),applyJob)


module.exports=router;