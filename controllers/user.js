const User= require("../models/user.js")

module.exports.userlogin=async (req, res) => {
    req.flash("success","Welcome to Wanderlust! You are logged in!");
    let redirectedUrl= res.locals.redirectUrl ||"/listing" ;
    res.redirect(redirectedUrl);
  
  }

  module.exports.usersignup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
  
    console.log(registeredUser); // log registered user to terminal
    req.login(registeredUser, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listing");
     });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/user/signup");
    }
  }

  module.exports.userlogout= (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
     req.flash("success", "logged you out!");
    res.redirect("/listing");
  });
   
}