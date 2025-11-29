const express=require("express");
const router=express.Router();
const User = require("../models/user");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,isVerified}=require("../middleware.js");
const multer  = require('multer')

const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});


//student profile
router.get("/",isLoggedIn,wrapAsync(async (req,res)=>{
    const students= await User.find({role:"student"});
    res.render("student/index.ejs",{students});
}));

//show student
router.get("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const student=await User.findById(id);
    if(!student){
        req.flash("error","student you requested for does not exists");
         return res.redirect("/student");
    }
    res.render("student/show.ejs",{student});
}));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,isVerified,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const student=await User.findById(id);
    if(!student){
        req.flash("error","student you requested for does not exists");
         return res.redirect("/student");
    }
    res.render("student/edit.ejs",{student});
}));

//update route
router.put("/:id",isLoggedIn,isOwner,isVerified,upload.single('student[profilePic]'),wrapAsync(async (req,res)=>{
    if(!req.body.student){
        throw new ExpressError(400,"Send valid data for listing");
    }
    const {id}=req.params;
     let user=await User.findByIdAndUpdate(id,{...req.body.student});
     if(req.file){
         let url=req.file.path;
    let filename=req.file.filename;
    user.profilePic={
        url,filename
    }
    await user.save();
      }
     req.flash("success","user updated successfully");
    //  res.redirect(`/student/${id}`)
    res.send(req.file);
}));

//delete route
router.delete("/:id",isLoggedIn,isOwner,isVerified,wrapAsync(async (req,res)=>{
    const {id}=req.params;
     let deletedUser=await User.findByIdAndDelete(id);
     console.log(deletedUser);
     req.flash("success","User deleted successfully");
     res.redirect("/student");
}));

module.exports=router;