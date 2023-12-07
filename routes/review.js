const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const reviewController=require("../Controller/reviewController.js");

const {reviewValidation, isLoggedin,isAuthor}=require("../middleware.js");


router.post("/reviews",isLoggedin,reviewValidation,wrapAsync(reviewController.reviewNew))
  
  //delete review route
  router.delete("/reviews/:reviewId",isLoggedin,isAuthor,reviewController.reviewDelete);
  
module.exports=router;