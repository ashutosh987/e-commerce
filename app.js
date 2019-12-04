var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  server = app.listen(3000, listening),
  bodyParser = require("body-parser"),
  Comment = require("./models/comment"),
  Product = require("./models/product"),
  User = require("./models/user"),
  indexRoutes = require("./routes/index"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  commentRoutes = require("./routes/comments"),
  productRoutes = require("./routes/products");

app.use(express.static("uploads"));

app.use(
  require("express-session")({
    secret: "my name is alok garg!!!",
    resave: false,
    saveUninitialized: false
  })
);
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(indexRoutes);
app.use("/products/:id/comments", commentRoutes);
mongoose.connect("mongodb://localhost:27017/e_web", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

app.use("/products", productRoutes);

//==============================================================================
function listening() {
  console.log("server is running");
}
