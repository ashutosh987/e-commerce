const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
var Comment       = require("../models/comment");
var User          = require("../models/user");

const Product = require("../models/product");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});
//***************************************************************** */
router.get("/", function(req, res) {
  Product.find({}, function(err, allproducts) {
    if (err) {
      console.log(err);
    } else {
      res.render("products/index", {
        products: allproducts
        // currentUser: req.user
      });
    }
  });
});

router.get("/new", (req, res, next) => {
  res.render("product_regi");
});

router.post("/new", upload.single("product"), (req, res, next) => {
  console.log(req.body.productimage);
  const product = new Product({
    productname: req.body.productname,
    price: req.body.price,
    productimage: req.file.path
  });

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          productname: result.productname,
          price: result.price,

          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
/************************************************************************************** */
//SHOW ROUTE--for detail about each campgrounds
router.get("/:id", function(req, res) {
  Product.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundproduct) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundproduct);
        res.render("products/show", { product: foundproduct ,currentUser:req.user });
      }
    });
});
/*

router.get("/product_regi", (req, res, next) => {
  res.sendFile("views" + "/product_regi.ejs");
});


router.post("/product_regi", function(req, res) {
  console.log(req.files);
  if (req.files.product) {
    const product = new Product({
      productname: req.body.productname,
      price: req.body.price,
      productimage: req.files.path
    });
    product.save();
    var file = req.files.product,
      filename = file.name;
    file.mv(__dirname + "uploads/" + filename, function(err) {
      if (err) {
        console.log(err);
        res.send("error occured");
      } else {
        res.send("done!");
      }
    });
  }
});
*/
module.exports = router;
