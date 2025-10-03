const express=require("express");
const router =express.Router();
const Listing=require("../models/listing.js")
const wrapAsync=require("../utils/wrapAsync.js")
const multer  = require('multer')
const{cloudinary,storage}=require("../cloudCongig.js")
const upload = multer({ storage })

const {isLoggedIn,isOwner,validateData,isAssign}=require("../middleware.js")
const listingController= require("../controllers/listings.js")
router.route("/")
.all((req,res,next)=>{console.log("router route middleware");next()})
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("data[image]"),validateData,wrapAsync(listingController.createListing))

router.route("/:id")
.get(isAssign,wrapAsync(listingController.showListing))
.patch(isLoggedIn,isOwner,upload.single("data[image]"),validateData,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

router.get("/new/list",isLoggedIn,listingController.renderNewForm)
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))
router.get("/nav/:category",wrapAsync(listingController.category))

module.exports=router