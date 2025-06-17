const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.addreview= async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);
    newreview.author= req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    res.redirect(`/listing/${req.params.id}`)
}

module.exports.deletereview=async (req, res) => {
    let { id, reviewId } = req.params;
    reviewId = reviewId.trim(); 
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}