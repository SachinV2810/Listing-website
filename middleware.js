const {listingSchema}=require("./schema.js");
const ExpressError=require("./utils/expressError.js");
const {reviewSchema}=require("./schema.js");
const Listing=require("./models/listings.js");
const Review=require("./models/review.js");
const wrapAsync=require("./utils/wrapAsync.js");
module.exports.listingValidation=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
}

module.exports.reviewValidation=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  }

module.exports.isLoggedin= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","login to wanderlust");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }

    next();
}

module.exports.isOwner=wrapAsync(async (req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);

  if( !listing.owner._id.equals(res.locals.curUser._id)){
    req.flash("error","you are not permitted .");
    return res.redirect(`/listing/${id}`); 
}
next();
})

module.exports.isAuthor=wrapAsync(async (req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if( !review.author.equals(res.locals.curUser._id)){
    req.flash("error","you are not permitted .");
    return res.redirect(`/listing/${id}`); 
}
next();
})