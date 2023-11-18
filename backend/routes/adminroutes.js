const express=require("express");
const { postjob, viewAllJob, updateJob, deleteJob, getjobdetail, viewAllApplication } = require("../controllers/admincontroller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router=express.Router();

// POST JOB APPLICATION
router.route("/admin/postjob").post(isAuthenticatedUser,postjob)

/* view JOb */
// router.route("/admin/viewjob").get(isAuthenticatedUser,authorizeRoles("user"),viewAllJob)
router.route("/admin/viewjob").get(viewAllJob)

/* update job */
router.route("/admin/updatejob/:id").put(updateJob)

/* Get job detail */
router.route("/admin/jobdetail/:id").get(getjobdetail)

/* Delete job */
router.route("/admin/deleteNotification/:id").delete(deleteJob)

/* view all application */
router.route("/admin/job/:id").get(viewAllApplication)





module.exports=router;