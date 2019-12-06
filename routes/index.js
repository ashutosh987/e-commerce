var express = require("express");
var router = express.Router();

var passport = require("passport");
var User = require("../models/user");
const middleware = require("../middleware/index");
//HOME PAGE
router.get("/", function(req, res) {
  res.render("landing", {
    currentUser: req.user
  });
});

//  show register form
router.get("/register", function(req, res) {
  res.render("register");
});

//handle sign  up logic
router.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req, res, function() {
        console.log(user);
        res.redirect("/profiles/new");
      });
    }
  });
});

//show login form
router.get("/login", function(req, res) {
  res.render("login");
});
//handling  login using  middleware
//app.post("/login",middleware,callback);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

//logout route
router.get("/logout", function(req, res) {
  req.logOut();
  res.render("landing");
});
//middleware authentication
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
//==============================================================================
module.exports = router;
