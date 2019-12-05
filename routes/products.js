const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
var Comment = require("../models/comment");
var User = require("../models/user");

const Product = require("../models/product");
const path = require("path");
const crypto = require("crypto");

const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const mongoURI = "mongodb://localhost:27017/e__web";
/*
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

*/

const conn = mongoose.createConnection("mongodb://localhost:27017/e__web", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});
let gfs;

conn.once("open", () => {
  //Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  // all set!
});

//create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

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

//@route get/
//@desc loads form
router.get("/upload", (req, res) => {
  res.render("product_regi", { files: false });
});

//@route POST/upload
//@desc uploads file
router.post("/upload", upload.single("file"), (req, res) => {
  //res.json({ file: req.file });
  const product = new Product({
    productname: req.body.productname,
    price: req.body.price,
    productimage: req.file.filename
  });
  product.save();
  res.redirect("/");
});

//@route GET/files
//@desc display all file in json

router.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no files exists"
      });
    }

    return res.json(files);
  });
});

//@route GET/files/:filename
//@desc display single file object

router.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "no files exists"
      });
    }
    return res.json(file);
  });
});
//@route GET/image/:filename
//@desc display image

router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "no files exists"
      });
    }
    //check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      //read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "not an image"
      });
    }
  });
});
router.get("/:id", function(req, res) {
  Product.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundproduct) {
      if (err) {
        console.log(err);
      } else {
        //  console.log(foundproduct);
        res.render("products/show", {
          product: foundproduct,
          currentUser: req.user
        });
      }
    });
});

//***************************************************************** */
/*

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
/*

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
