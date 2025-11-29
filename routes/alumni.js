const express=require("express");
const router=express.Router();
const User = require("../models/user");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,isVerified}=require("../middleware.js");
const multer  = require('multer');
 const {storage}=require("../cloudConfig");
const upload = multer({storage});

//alumni profile
router.get("/",isLoggedIn,isVerified,wrapAsync(async (req,res)=>{
    const alumnis = await User.find({ role: "alumni" }).sort({ createdAt: -1 });

    res.render("alumni/index.ejs",{alumnis});
}));

//show alumni
router.get("/:id",isLoggedIn,isVerified,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const alumni=await User.findById(id);
    if(!alumni){
        req.flash("error","alumni you requested for does not exists");
         return res.redirect("/");
    }
    res.render("alumni/show.ejs",{alumni});
}));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,isVerified,wrapAsync(async (req,res)=>{
    
    const {id}=req.params;
    const alumni=await User.findById(id);
    console.log(alumni);
    if(!alumni){
        req.flash("error","alumni you want to edit for does not exists");
         return res.redirect("/alumni");
    }
    res.render("alumni/edit.ejs",{alumni});
}));

//update route
router.put("/:id",isLoggedIn,isOwner,isVerified,upload.single("alumni[profilePic]"),wrapAsync(async (req,res)=>{
  
    if(!req.body.alumni){
        throw new ExpressError(400,"Send valid data");
    }
    const {id}=req.params;

    console.log("image received")
     let user=await User.findByIdAndUpdate(id,{...req.body.alumni});
    
      if(req.file){
         let url=req.file.path;
    let filename=req.file.filename;
    user.profilePic={
        url,filename
    }
    await user.save();
      }
     req.flash("success","alumni updated successfully");
     res.redirect(`/alumni/${id}`)
    
}));

//delete route
router.delete("/:id",isLoggedIn,isOwner,isVerified,wrapAsync(async (req,res)=>{
    const {id}=req.params;
     let deletedUser=await User.findByIdAndDelete(id);
     console.log(deletedUser);
     req.flash("success","User deleted successfully");
     res.redirect("/alumni");
}));
module.exports=router;