var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;

var User = require("../models/user");
var configAuth = require("./auth");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  /*
  passport.use(
    "local",
    new LocalStrategy(function(username, password, done) {
      User.findOne({ username: local.username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!user.local.validPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );
  */
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        process.nextTick(function() {
          User.findOne({ "local.username": email }, function(err, user) {
            if (user) {
              console.log(111);
              return done(null, false);
            } else {
              var newUser = new User();
              newUser.local.username = email;
              newUser.local.password = newUser.generateHash(password);
              console.log(33);
              newUser.save();
              return done(null, newUser);
            }
          });
        });
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        process.nextTick(function() {
          User.findOne({ "local.username": email }, function(err, user) {
            if (err) return done(err);
            if (!user)
              return done(
                null,
                false,
                req.flash("loginMessage", "No User found")
              );
            if (!user.validPassword(password)) {
              return done(
                null,
                false,
                req.flash("loginMessage", "invalid password")
              );
            }
            return done(null, user);
          });
        });
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
          User.findOne({ "facebook.id": profile.id }, function(err, user) {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
              var newUser = new User();
              newUser.facebook.id = profile.id;
              newUser.facebook.token = accessToken;
              newUser.facebook.name = profile.displayName;
              //profile.name.givenName + " " + profile.name.familyName;
              //newUser.facebook.email = profile.emails[0].value;

              newUser.save(function(err) {
                if (err) throw err;
                return done(null, newUser);
              });
              console.log(profile.displayName + 3);
            }
          });
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
          User.findOne({ "google.id": profile.id }, function(err, user) {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
              var newUser = new User();
              newUser.google.id = profile.id;
              newUser.google.token = accessToken;
              newUser.google.name = profile.displayName;
              newUser.google.email = profile.emails[0].value;
              newUser.img = profile._json.picture;

              newUser.save(function(err) {
                if (err) throw err;
                return done(null, newUser);
              });
              console.log(profile._json.picture);
              console.log(345346346213);
            }
          });
        });
      }
    )
  );
};
