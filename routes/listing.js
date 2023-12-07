const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedin,listingValidation,isOwner}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});
const listingController=require("../Controller/listingController.js");

router.route("/")
.get(wrapAsync(listingController.listingIndex))
.post(upload.single('listing[image]'),isLoggedin,listingValidation,wrapAsync(listingController.listingNewPost));

router.route("/new")
.get(isLoggedin,listingController.listingNew);


router.route("/:id/edit")
.get(isLoggedin,isOwner,wrapAsync(listingController.listingEdit));

router.route("/:id")
.put(isOwner,upload.single("listing[image]"),listingValidation,wrapAsync(listingController.listingEditPut))
.get(wrapAsync(listingController.listingShow))
.delete(isLoggedin,isOwner,wrapAsync(listingController.listingDelete));


module.exports=router;