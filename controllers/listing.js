const Listing = require("../models/listing.js");

module.exports.index= async (req,res)=>{
     const allListings = await Listing.find({});
    res.render("listing/index.ejs", {allListings});
}

module.exports.addnew = (req,res)=>{
    res.render("listing/new.ejs");
}

module.exports.postnew = async (req,res)=>{
   let url = req.file.path;
   let filename = req.file.filename;
   console.log(url, filename)
    const newlisting= new Listing(req.body.listing);
    newlisting.owner= req.user._id;
    newlisting.image = { url, filename };
    console.log(newlisting)
    await newlisting.save();
    req.flash("success", "new listing created!");
    res.redirect("/listing")
}

module.exports.viewlisting= async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" } // ✅ fixed quotes
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "The listing does not exist!");
    return res.redirect("/listing"); // ✅ added return
  }

  res.render("listing/item.ejs", { listing });
}

module.exports.editlisting= async (req,res)=>{
    const listing= await Listing.findById(req.params.id);
    if(!listing){
         req.flash("error", "The listing doesnot exist!");
         res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
res.render("listing/edit.ejs", { listing, originalImageUrl });
}

module.exports.updatelisting= async (req,res)=>{
    let {id}= req.params;
  const listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
  if(req.file) {
  const url = req.file.path;
  const filename = req.file.filename;
  listing.image = { url, filename };
  await listing.save();
}

    //  console.log(listing);
    req.flash("success", "The listing is edited succesfully!");
     res.redirect(`/listing/${id}`);
}

module.exports.destroylisting= async (req,res)=>{
     const id = req.params.id.trim();
     const dellisting= await Listing.findByIdAndDelete(id);
     console.log(dellisting);
      req.flash("success", "The listing is deleted successfully!");
     res.redirect("/listing");
}