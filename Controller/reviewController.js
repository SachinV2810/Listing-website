const Listing=require("../models/listings.js");
const Review=require("../models/review.js");

module.exports.reviewNew=async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review);
    newReview.author=res.locals.curUser;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","review is added");
    res.redirect(`/listing/${req.params.id}`);
  };

  module.exports.reviewDelete=async(req,res)=>{
    await Review.findByIdAndDelete(req.params.reviewId);
    await Listing.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.reviewId}});
    req.flash("success","review Deleted");
    res.redirect(`/listing/${req.params.id}`);
  };