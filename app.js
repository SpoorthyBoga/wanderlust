// require('dotenv').config()

const express=require("express");
const app=express();
const path= require("path");
const port=8080;
const mongoose = require("mongoose");

const methodOverride = require('method-override');
app.use(methodOverride('_method'))

const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);

const session= require("express-session");
const flash= require("connect-flash");
const passport= require("passport");
const localStrategy= require("passport-local");
const MongoStore = require('connect-mongo');

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const User= require("./models/user.js")
const ExpressError = require("./utils/ExpressError");


const MONGO_URL = process.env.ATLAS_URL;
main().then(()=>{
    console.log("SUccesful!");
}).catch((err)=>
    console.log(err)
);

async function main() {
    await mongoose.connect(MONGO_URL); 
    
}
app.set("view engine", "ejs" );
app.set("views",path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
});


store.on("error", ()=>{
    console.log("error in mongo sessions", err);
})

const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
          expires:Date.now() + 1000*60*60*24*3,
          maxAge: 1000*60*60*24*3,
          httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.CurrUser= req.user;
    next();
})

app.listen(port, ()=>{
    console.log("listening!");
});

const listingroute= require("./routes/listing.js")
const reviewroute= require("./routes/review.js")
const userroute= require("./routes/user.js")


app.get("/", (req,res)=>{
    res.redirect("/listing");
})
app.use("/listing", listingroute);
app.use("/listing/:id/reviews", reviewroute);
app.use("/user", userroute);


app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page not found!"));
})

app.use((err,req,res,next)=>{
    const {status=500, message="Something Went Wrong!"}=err;
    res.render("error.ejs", {message});
    // res.status(status).send(message);
})