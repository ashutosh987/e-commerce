const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
var Comment = require("../models/comment");
var User = require("../models/user");

const Product = require("../models/product");

const path = require("path");
const crypto = require("crypto");
const middleware = require("../middleware/index");
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
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");

    Product.find({ productname: regex }, function(err, allproducts) {
      if (err) {
        console.log(err);
      } else {
        res.render("products/index", {
          products: allproducts,
          currentUser: req.user
        });
      }
    });
  } else {
    Product.find({}, function(err, allproducts) {
      if (err) {
        console.log(err);
      } else {
        res.render("products/index", {
          products: allproducts,
          currentUser: req.user
        });
      }
    });
  }
});

//@route get/
//@desc loads form
router.get("/upload", middleware.isLoggedIn, (req, res) => {
  res.render("product_regi", { files: false });
});

//@route POST/upload
//@desc uploads file
router.post(
  "/upload",
  middleware.isLoggedIn,
  upload.single("file"),
  (req, res) => {
    //res.json({ file: req.file });
    var t;
    if (req.user.local.username) t = req.user.local.username;
    else if (req.user.facebook.name) t = req.user.facebook.name;
    else {
      t = req.user.google.name;
    }

    const product = new Product({
      productname: req.body.productname,
      price: req.body.price,
      productimage: req.file.filename,
      seller: {
        id: req.user._id,

        username: t
      }
    });

    product.save();
    res.redirect("/");
  }
);

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
        var t = 0;
        var flag = 0;
        foundproduct.likes.forEach(myFunction);

        function myFunction(value) {
          if (value.valueOf().equals(req.user._id)) {
            t = 1;
            // res.redirect("/products/" + foundProduct._id);
          }
        }

        //  console.log(foundproduct);
        res.render("products/show", {
          product: foundproduct,
          currentUser: req.user,
          flag: t
        });
      }
    });
});
mongoose.set("useFindAndModify", false);
//update campground route
//EDIT canpground route
router.delete("/:id", middleware.checkProductOwnership, (req, res) => {
  Product.findById(req.params.id).exec(function(err, foundproduct) {
    if (err) {
      return res.render("landing", {
        currentUser: req.user
      });
    } else {
      gfs.remove(
        { filename: foundproduct.productimage, root: "uploads" },
        (err, gridStore) => {
          if (err) {
            return res.render("landing", {
              currentUser: req.user
            });
          }

          Product.findByIdAndRemove(foundproduct._id, function(err) {
            if (err) {
              return res.render("landing", {
                currentUser: req.user
              });
            } else {
              return res.render("landing", {
                currentUser: req.user
              });
            }
          });

          return res.render("landing", {
            currentUser: req.user
          });
        }
      );
    }
  });
});

router.put("/like/:id", middleware.isLoggedIn, (req, res) => {
  //check if post has already been liked
  Product.findById(req.params.id, function(err, foundProduct) {
    if (err) {
      console.log(err);
    } else {
      var t = 0;
      foundProduct.likes.forEach(myFunction);

      function myFunction(value) {
        if (value.valueOf().equals(req.user._id)) {
          t = 1;
          // res.redirect("/products/" + foundProduct._id);
        }
      }

      if (t == 0) {
        foundProduct.likes.push(req.user);
        foundProduct.save();
        console.log("already likeasfd");
      }

      if (t == 1) {
        foundProduct.likes.forEach(myFunction);

        function myFunction(value) {
          if (value.valueOf().equals(req.user._id)) {
            var index = foundProduct.likes.indexOf(value);
            if (index > -1) {
              foundProduct.likes.splice(index, 1);
            }
          }
        }
        console.log("already liked");
      }

      res.redirect("/products/" + foundProduct._id);
    }
  });
});

router.put("/unlike/:id", middleware.isLoggedIn, (req, res) => {
  //check if post has already been liked
  Product.findById(req.params.id, function(err, foundProduct) {
    if (err) {
      console.log(err);
    } else {
      var t = 0;
      foundProduct.likes.forEach(myFunction);

      function myFunction(value) {
        if (value.valueOf().equals(req.user._id)) {
          t = 1;
          // res.redirect("/products/" + foundProduct._id);
        }
      }

      if (t == 0) {
        console.log("you dont have likes");
      }

      if (t == 1) {
        foundProduct.likes.forEach(myFunction);

        function myFunction(value) {
          if (value.valueOf().equals(req.user._id)) {
            var index = foundProduct.likes.indexOf(value);
            if (index > -1) {
              foundProduct.likes.splice(index, 1);
              foundProduct.save();
            }
          }
        }
        console.log("now you have no likes");
      }

      res.redirect("/products/" + foundProduct._id);
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
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
