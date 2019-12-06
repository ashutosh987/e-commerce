var express  = require("express");
var router   =  express.Router({mergeParams:true});
var Profile    = require("../models/profile");
var Product    = require("../models/product");
var Comment       = require("../models/comment");
var User          = require("../models/user");
var passport      =require("passport");
//show profile page
// adds new product
router.post("/",isLoggedIn,function(req,res){
  Profile.findOne({username :req.user.username}, function (err,foundprofile) {
    if(err)console.log(err);
    else  if(foundprofile){ 
      console.log(foundprofile);
      res.redirect("/profiles/"+foundprofile._id);
    }
    else{
      Profile.create(req.user._id,function(err,profile){
        if(err){
            console.log(err);
        }
        else{
            profile.profilename.id=req.user._id;
            profile.username=req.user.username;
            profile.save();
            console.log(profile);
            res.redirect("/profiles/"+profile._id);
        }
      })
    }
  })
    });


router.get("/:id", function (req, res) {
    Profile.findById(req.params.id)
      .populate("products")
      .exec(function (err, foundprofile) {
        if (err) {
          console.log(err);
        } else {
          res.render("show_profile", {
            profile: foundprofile, userName:foundprofile.username
          });
        }
      });
  });

// adds new product
router.post("/add/:prod_id",isLoggedIn,function(req,res){
  Product.findById(req.params.prod_id,function(err,foundProduct){
  Profile.findOne({username :req.user.username}, function (err,foundprofile) {
    if(err)console.log(err);
    else  if(foundprofile){ 
      foundprofile.products.push(foundProduct);
      foundprofile.save();
      console.log(foundprofile);
      res.redirect("/profiles/"+foundprofile._id);
    }
    else{
      Profile.create(req.user._id,function(err,profile){
        if(err){
            console.log(err);
        }
        else{
            profile.profilename.id=req.user._id;
            profile.username=req.user.username;
            profile.products.push(foundProduct);
            profile.save();
            console.log(profile);
            res.redirect("/profiles/"+profile._id);
        }
      })
    }
  })
    });
  });
        
        

//middleware authentication
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return  next();
    }
    res.redirect("/login");
}

module.exports = router;
