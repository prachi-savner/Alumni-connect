const User = require("./models/user");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isAlumni=(req,res,next)=>{
    if(res.locals.currUser.role==="student"){
        req.flash("error","You don't have permission!");
        return res.redirect("/job");
    }
    next();
}


module.exports.isOwner =async (req,res,next)=>{
    let {id}=req.params;
    console.log(id);
    let user=await User.findById(id);
    
    if(!user._id.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permission");
        return res.redirect(`/${user.role}/${id}`);
    }
    next();
};
module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        req.flash("error", "You are not authorized to access admin panel");
        return res.redirect("/");
    }
    next();
};


module.exports.isVerified = (req, res, next) => {
    if(req.user.role=="admin"){
        req.user.verified=true;
    }
    if (!req.user.verified) {
        req.flash("error", "Your account is pending admin approval.");
        return res.redirect("/pending-approval");
    }
    next();
};
