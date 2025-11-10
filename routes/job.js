
const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Job = require("../models/job");
const {isLoggedIn,isAlumni}=require("../middleware.js");

//index route
router.get("/",isLoggedIn,async(req,res)=>{
    const jobs= await Job.find();
        res.render("job/index.ejs",{jobs});
});

//new job 

router.get("/new",isLoggedIn,isAlumni,(req,res)=>{
    res.render("job/new.ejs");
});

router.post("/new",isLoggedIn,isAlumni,wrapAsync(async (req,res,)=>{
    let job=req.body.job;
    const newJob=new Job(job);
    req.flash("success","job created successfully");
    newJob.postedBy=req.user._id;
    console.log(newJob);
    await newJob.save();
    res.redirect("/job");
}));

//show job 
router.get("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const job=await Job.findById(id);
    console.log(job.postedBy._id);
    if(!job){
        req.flash("error","job you requested for does not exists");
         return res.redirect("/job");
    }
    res.render("job/show.ejs",{job});
}));


//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const job=await Job.findById(id);
    console.log(job);
    if(!job){
        req.flash("error","job you want to edit for does not exists");
         return res.redirect("/job");
    }
    res.render("job/edit.ejs",{job});
}));

//update route
router.put("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    if(!req.body.job){
        throw new ExpressError(400,"Send valid data for job");
    }
    const {id}=req.params;
     await Job.findByIdAndUpdate(id,{...req.body.job});
     req.flash("success","job updated successfully");
     res.redirect(`/job/${id}`)
}));

//delete route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    const {id}=req.params;
     let deletedJob=await Job.findByIdAndDelete(id);
     console.log(deletedJob);
     req.flash("success","job deleted successfully");
     res.redirect("/job");
}));

module.exports=router;