const express=require("express");
const router=express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");

//signup
router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
   try{
     let {name,email,password,role}=req.body;
    const newUser=new User({email,name,role});
    const registerUser=await User.register(newUser,password);
    if(registerUser.role=="admin"){
        registerUser.verified=true;
        await registerUser.save();
    }
    console.log(registerUser);
    if(registerUser.verified==="true"){
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Alumni-Connect");
        
        res.redirect(`/profile`);
    })
}
   }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
   }
}));


//login
router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
});

router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(async(req,res)=>{
    const loggedUser = req.user;
   
   if(loggedUser.role=="admin"){
    return res.redirect("/admin/dashboard");
   }
   req.flash("success","Welcome back to Alumni-connect");
  res.redirect(`/profile`);
}));


  router.get("/logout",(req,res,next)=>{

    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/");
    })
  });

module.exports=router;