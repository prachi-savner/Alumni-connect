const express=require("express");
const router=express.Router();
const User = require("../models/user");


const {isLoggedIn,isOwner,isVerified}=require("../middleware.js");


// Profile route
router.get("/",isVerified, async(req, res) => {
    const id=res.locals.currUser._id;
    const user=await User.findById(id);
  res.render("users/profile.ejs", {user});
});

module.exports = router;