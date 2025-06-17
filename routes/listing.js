const express= require("express");
const router= express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedin, isOwner, validateListing}= require("../middlewares.js")
const listingController= require("../controllers/listing.js")
const multer = require('multer');
const {storage}= require("../config.js");
const upload = multer({ storage }); 

//validating the schema of listing object


// all listing route
router.get("/", wrapAsync(listingController.index));

//new listing route
router.get("/new",isLoggedin, listingController.addnew)

// adding new listing
router.post("/",isLoggedin, upload.single("listing[image]"),validateListing, wrapAsync(listingController.postnew))
// router.post("/", (req, res) => {
//   res.send(req.file);
// });


//show route
router.get("/:id", wrapAsync(listingController.viewlisting));

//edit route
router.get("/:id/edit",isLoggedin,isOwner, wrapAsync(listingController.editlisting))

// Update route
router.put("/:id",isLoggedin,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updatelisting))


//delete route
router.delete("/:id",isLoggedin,isOwner, wrapAsync(listingController.destroylisting))

module.exports=router;
