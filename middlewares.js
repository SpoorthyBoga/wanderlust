const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema}= require("./schema.js")
const ExpressError = require("./utils/ExpressError");


module.exports.isLoggedin= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in first!");
        return res.redirect("/user/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  id = id.trim(); 
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listing");
  }
  if (!listing.owner.equals(res.locals.CurrUser._id)) {
    req.flash("error", "You don't have permission to edit.");
    return res.redirect(`/listing/${id}`);
  }
  next(); 
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewId, id } = req.params;
  reviewId = reviewId.trim(); // ✅ Fix: remove any extra spaces

  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.CurrUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg); 
    }else{
        next();
    }
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
       let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg); 
    }else{
        next();
    }
}


