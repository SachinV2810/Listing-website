const User=require("../models/users.js");

module.exports.signupPage=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signupPost=async(req,res,next)=>{
    try{
        let {emailid,username,password}=req.body;
        const newUser=new User({email:emailid,username:username});
        let registeredUser=await User.register(newUser,password); 
        req.login(registeredUser,(err)=>{   //login after signup
            if(err){
               return next(err); 
            }
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("failure",e.message);
        res.redirect("/signup");
    }
};
module.exports.loginPage=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.loginPost=async(req,res)=>{
    req.flash("success","Successfully Logged in to WanderLust");
    let saveUrl=res.locals.redirectUrl ||"/listing";
    res.redirect(saveUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are succesfully logged out");
        res.redirect("/listing");
    })
};