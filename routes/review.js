const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedin, isReviewAuthor, validateReview}= require("../middlewares.js");
const reviewController = require("../controllers/review.js");

//post review route
router.post("/",isLoggedin, validateReview, wrapAsync(reviewController.addreview))

// Delete Review Route
router.delete("/:reviewId",isLoggedin,isReviewAuthor, wrapAsync(reviewController.deletereview));

module.exports=router;