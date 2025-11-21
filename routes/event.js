
const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Event = require("../models/event");
const {isLoggedIn,isAlumni,isVerified}=require("../middleware.js");

//index route
router.get("/",isLoggedIn,isVerified,async(req,res)=>{
    const events= await Event.find().populate({path:"host",populate:{path:"name"}});
        res.render("event/index.ejs",{events});
});

//new event 

router.get("/new",isLoggedIn,isAlumni,isVerified,(req,res)=>{
    res.render("event/new.ejs");
});

router.post("/new",isLoggedIn,isAlumni,isVerified,wrapAsync(async (req,res,next)=>{
    let event=req.body.event;
    const newEvent=new Event(event);
    req.flash("success","event created successfully");
    newEvent.host=req.user._id;
    console.log(newEvent);
    await newEvent.save();
    res.redirect("/event");
}));

//show event 
router.get("/:id",isLoggedIn,isVerified,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const event=await Event.findById(id);
    console.log(event);
    if(!event){
        req.flash("error","event you requested for does not exists");
         return res.redirect("/event");
    }
    res.render("event/show.ejs",{event});
}));



//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const event=await Event.findById(id);
    console.log(event);
    if(!event){
        req.flash("error","event you want to edit for does not exists");
         return res.redirect("/event");
    }
    res.render("event/edit.ejs",{event});
}));

//update route
router.put("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    if(!req.body.event){
        throw new ExpressError(400,"Send valid data for event");
    }
    const {id}=req.params;
     await Event.findByIdAndUpdate(id,{...req.body.event});
     req.flash("success","event updated successfully");
     res.redirect(`/event/${id}`)
}));

//delete route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    const {id}=req.params;
     let deletedEvent=await Event.findByIdAndDelete(id);
     console.log(deletedEvent);
     req.flash("success","event deleted successfully");
     res.redirect("/event");
}));


module.exports=router;