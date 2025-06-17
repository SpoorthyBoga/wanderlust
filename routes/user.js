const express= require("express");
const router= express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const passport= require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const userController= require("../controllers/user.js")
//sigup form

router.get("/signup", (req,res)=>{
    res.render("user/signup.ejs");
});

//registering new users
router.post("/signup", wrapAsync(userController.usersignup));

router.get("/login", (req, res)=>{
    res.render("user/login.ejs");
})

//user authentication
router.post("/login", saveRedirectUrl, 
    passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  userController.userlogin
);

router.get("/logout", userController.userlogout);

module.exports=router;
