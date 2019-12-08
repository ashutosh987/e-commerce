var express = require("express");
var router = express.Router({ mergeParams: true });
var Product = require("../models/product");
var Comment = require("../models/comment");
var User = require("../models/user");
var passport = require("passport");

//new comment
router.get("/new", isLoggedIn, function(req, res) {
  Product.findById(req.params.id, function(err, foundProduct) {
    if (err) {
      console.log(err);
    } else {
      res.render("new_comment", {
        product: foundProduct
      });
    }
  });
});

// handles new comment
router.post("/", isLoggedIn, function(req, res) {
  Product.findById(req.params.id, function(err, foundProduct) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          //add username  and id to comment and save it
          comment.author.user_id = req.user._id;
          if (req.user.local.username)
            comment.author.username = req.user.local.username;
          else if (req.user.facebook.name)
            comment.author.username = req.user.facebook.name;
          else {
            comment.author.username = req.user.google.name;
          }

          comment.product_name.product_id = foundProduct._id;
          comment.product_name.productname = foundProduct.productname;
          comment.save();
          foundProduct.comments.push(comment);
          foundProduct.save();
          res.redirect("/products/" + foundProduct._id);
        }
      });
    }
  });
});

//EDIT  ROUTE FOR  COMMENT
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("edit_comment", {
        product_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

//UPDATE COMMENT  ROUTE
router.put("/:comment_id", checkCommentOwnership, function(req, res) {
  //find and update the campground
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    updatedcomment
  ) {
    if (err) {
      res.redirect("/products");
    } else {
      res.redirect("/products/" + req.params.id);
    }
  });
});

//DELETE  ROUTE
router.delete("/:comment_id", checkCommentOwnership, function(req, res) {
  //find and update the campground
  Comment.findByIdAndRemove(req.params.comment_id, function(
    err,
    updatedcomment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/products/" + req.params.id);
    }
  });
});

//middleware authentication
function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("/products");
      } else {
        //does user  own the comment
        if (foundComment.author.user_id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}
//middleware authentication
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
