const mongoose=require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const data=require("./data.js");
const Listing=require("../models/listings.js");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    data.data=data.data.map((obj)=>({...obj,owner:"656f255c2cc34f583236ddc4"}));
    await Listing.insertMany(data.data);
    console.log("data was inserted");
}
initDB();

