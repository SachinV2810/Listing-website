if(process.env.NODE_ENV!="production"){
  require('dotenv').config()
}
const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;
const User=require("./models/users.js");
const methodOverride = require('method-override');
const ejsmate=require("ejs-mate");
const ExpressError=require("./utils/expressError.js");
const LocalStrategy=require('passport-local');
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport = require("passport");

const store=MongoStore.create({
  mongoUrl:dbUrl,
  touchAfter:24*3600,
  crypto:{
    secret:"mysupersecretcode",
  }
  

})

const sessionOptions={
  store:store,
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*3600*1000,
    maxAge:7*24*3600*1000,
    httpOnly:true
  },
};

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsmate);
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(session(sessionOptions));
app.use(flash());

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

//Index route




//for other routes
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.curUser=req.user;
  next();
})

app.use("/listing",listingRouter);
app.use("/listing/:id",reviewRouter);
app.use("/",userRouter);
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});
//error handler
app.use((err,req,res,next)=>{
  let {statusCode=500,message="bad request"}=err;
  res.status(statusCode).render("error.ejs",{message});
})
app.listen(8080,()=>{
  console.log("app is listening to port 8080");
})