var express = require("express");
var router = express.Router();

var passport = require("passport");
var User = require("../models/user");
const middleware = require("../middleware/index");

module.exports = function(app, passport) {
  //HOME PAGE
  app.get("/", function(req, res) {
    res.render("landing", {
      //currentUser: req.user
    });
  });

  ////
  app.get("/login", function(req, res) {
    res.render("login");
  });
  /*
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })
  );
*/
  app.get("/register", function(req, res) {
    res.render("register");
  });

  app.post(
    "/register",
    passport.authenticate("local-signup", {
      successRedirect: "/",
      failureRedirect: "/register",
      failureFlash: true
    })
  );

  //************************************************************ */
  //  show register form
  /*
  app.get("/register", function(req, res) {
    res.render("register");
  });

  //handle sign  up logic
  app.post("/register", function(req, res) {
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
  app.get("/login", function(req, res) {
    res.render("login");
  });
  //handling  login using  middleware
  //app.post("/login",middleware,callback);*/
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/",
      failureRedirect: "/login"
    }),
    function(req, res) {}
  );
  //////*******************************************************************8 */
  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/"
    })
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  //logout route
  app.get("/logout", function(req, res) {
    req.logOut();
    res.redirect("/");
  });
  //middleware authentication
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
  //==============================================================================
};
