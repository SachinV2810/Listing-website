const Listing=require("../models/listings.js");


module.exports.listingIndex=async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.listingNew=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.listingNewPost=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const listing=new Listing(req.body.listing);
    listing.owner=req.user._id;
    listing.image={url,filename};
    await listing.save();
    req.flash("success","New Listing successfully Created");
    res.redirect("/listing");
}

module.exports.listingEdit=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not existed");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl.replace("/upload","/upload/e_blur:300");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.listingEditPut=async( req,res)=>{
    let {id}=req.params;
    await Listing.findById(id);
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing was Edited!");
    res.redirect(`/listing/${id}`);
}

module.exports.listingShow=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not existed");
        res.redirect("/listings");
    }
    
    res.render("listings/show.ejs",{listing});
}

module.exports.listingDelete=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  };