const mongoose =require("mongoose");
const {Schema}=mongoose;
const Review=require("./review.js");
const User=require("./users.js");

const listingschema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
      description: String,
      image: {
        url: String,
        filename:String
      },
      price: Number,
      location: String,
      country: String,
      reviews:[
{type:Schema.Types.ObjectId,
        ref:"Review"}
      ],
      owner:
        {type:Schema.Types.ObjectId,
        ref:"User"}
})


listingschema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
})

const Listing= new mongoose.model("Listing",listingschema);
module.exports=Listing;