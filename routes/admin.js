const express=require("express");
const router=express.Router();
const User = require("../models/user");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,isAdmin}=require("../middleware.js");
const multer  = require('multer');

const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });



//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const admin=await User.findById(id);
    console.log(admin);
    if(!admin){
        req.flash("error","admin you want to edit for does not exists");
         return res.redirect("/admin");
    }
    res.render("admin/edit.ejs",{admin});
}));

//update route
router.put("/:id",isLoggedIn,isOwner,upload.single("admin[profilePic]"),wrapAsync(async (req,res)=>{
    if(!req.body.admin){
        throw new ExpressError(400,"Send valid data for listing");
    }
    const {id}=req.params;
    let user= await User.findByIdAndUpdate(id,{...req.body.admin});
     let url=req.file.path;
    let filename=req.file.filename;
    user.profilePic={
        url,filename
    }
    await user.save();
     req.flash("success","admin updated successfully");
     res.redirect(`/admin/${id}`)
}));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    const {id}=req.params;
     let deletedUser=await User.findByIdAndDelete(id);
     console.log(deletedUser);
     req.flash("success","User deleted successfully");
     res.redirect("/admin");
}));

// admin dashboard
router.get("/dashboard", isAdmin, async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalAlumni = await User.countDocuments({ role: "alumni" });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    //const totalMessages = await Message.countDocuments();  // if you have chat

    // Recent 5 users
    const recentUsers = await User.find({})
        .sort({ createdAt: -1 })
        .limit(5);

    // Daily registrations (analytics)
    const last7Days = await User.aggregate([
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.render("admin/dashboard.ejs", {
        totalUsers,
        totalAlumni,
        totalStudents,
        totalAdmins,
        recentUsers,
        last7Days
    });
});


// list all users
router.get("/users", isAdmin,async (req, res) => {
    const users = await User.find();
    res.render("admin/users.ejs", { users });
});

// delete user
router.delete("/users/:id", isAdmin, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash("success", "User deleted");
    res.redirect("/admin/users");
});


// List all unverified users
router.get("/pending", isAdmin, async (req, res) => {
    const pendingUsers = await User.find({ verified: false });
    res.render("admin/pendingUsers", { pendingUsers });
});

// Verify a user
router.put("/verify/:id", isAdmin, async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { verified: true });
    req.flash("success", "User has been verified");
    res.redirect("/admin/pending");
});

// Reject / delete user
router.delete("/reject/:id", isAdmin, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash("success", "User has been rejected & removed");
    res.redirect("/admin/pending");
});

module.exports = router;
