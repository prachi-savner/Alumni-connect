const User = require("./models/user");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isAlumni=(req,res,next)=>{
    if(res.locals.currUser.role!="alumni"){
        req.flash("error","You must be an alumni!");
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