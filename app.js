var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  server = app.listen(process.env.PORT || 3000, listening),
  bodyParser = require("body-parser"),
  Comment = require("./models/comment"),
  Product = require("./models/product"),
  Profile = require("./models/profile"),
  User = require("./models/user"),
  indexRoutes = require("./routes/index"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  commentRoutes = require("./routes/comments"),
  productRoutes = require("./routes/products"),
  profileRoutes = require("./routes/profiles");
//************************************************ */
const cors = require("cors");
require("dotenv").config();
const { initPayment, responsePayment } = require("./paytm/services/index");
app.use(cors());
app.use(express.static(__dirname + "/views"));

app.get("/paywithpaytm", (req, res) => {
  initPayment(req.query.amount).then(
    success => {
      res.render("paytmRedirect.ejs", {
        resultData: success,
        paytmFinalUrl: process.env.PAYTM_FINAL_URL
      });
    },
    error => {
      res.send(error);
    }
  );
});

//*****************************************88 */
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
var flash = require("connect-flash");
var configDB = require("./config/database.js");
var session = require("express-session");

mongoose.connect(configDB.url);
require("./config/passport")(passport);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: "anystringoftext", saveUninitialized: true, resave: true })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  if (req.user) {
    Profile.findOne({ id: req.user._id }, function(foundprofile) {
      res.locals.currentProfile = foundprofile;
    });
  }
  next();
});

app.set("view engine", "ejs");
require("./routes/index")(app, passport);
//************************************************* */

const path = require("path");
const crypto = require("crypto");

const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

//************************************************** */

app.use(express.static("uploads"));
app.use(bodyParser.json());
app.use("/divisima", express.static("divisima"));
/*

app.use(
  require("express-session")({
    secret: "my name is alok garg!!!",
    resave: false,
    saveUninitialized: false
  })
);

*/

app.use(methodOverride("_method"));
app.use(passport.initialize());
//app.use(passport.session());

//passport.use(new LocalStrategy(User.authenticate()));
/*passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({ extended: true }));
*/
app.set("view engine", "ejs");

//app.use(indexRoutes);
app.use("/products/:id/comments", commentRoutes);
app.use("/profiles", profileRoutes);

var mongoURI = process.env.MONGO_URL;
// "mongodb://localhost:27017/yelp_";

mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

const conn = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

app.use("/products", productRoutes);

app.post("/paywithpaytmresponse", (req, res) => {
  responsePayment(req.body).then(
    success => {
      if (success["STATUS"] === "TXN_SUCCESS") {
        Profile.findOne({ id: req.user._id }, function(err, foundprofile) {
          if (err) console.log(err);
          else {
            foundprofile.products = [];
            foundprofile.save();
          }
        });
      }

      res.render("response.ejs", { resultData: "true", responseData: success });
    },
    error => {
      res.send(error);
    }
  );
});

//==============================================================================
function listening() {
  console.log("server is running");
}
