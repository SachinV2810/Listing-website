const express=require("express");
const passport = require("passport");
const router=express.Router();
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../Controller/userController.js");

router.route("/signup")
.get(userController.signupPage)
.post(userController.signupPost);

router.route("/login")
.get(userController.loginPage)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),userController.loginPost);

router.route("/logout")
.get(userController.logout);

module.exports=router;