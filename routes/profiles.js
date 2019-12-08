var express  = require("express");
var router   =  express.Router({mergeParams:true});
var Profile    = require("../models/profile");
var Product    = require("../models/product");
var Comment       = require("../models/comment");
var User          = require("../models/user");
var passport      =require("passport");
//show profile page
router.post("/",isLoggedIn,function(req,res){
  Profile.findOne({id:req.user._id}, function (err,foundprofile) {
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
            profile.id=req.user._id;
            profile.username=req.user.username;
            profile.save();
            console.log(profile);
            res.redirect("/profiles/"+profile._id);
        }
      })
    }
  })
    });
//new profile(get route)
router.get("/new", function (req, res) {
      res.render("new_profile");
    });
//handle the post route
router.post("/new",function(req,res){
      Profile.create(req.user._id,function(err,profile){
        if(err){
            console.log(err);
        }
        else{
            profile.id=req.user._id;
            profile.username=req.user.username;
            profile.name=req.body.name;
            profile.image=req.body.image;
            profile.email=req.body.email;
            profile.save();
            console.log(profile);
            res.redirect("/profiles/"+profile._id);
        }
          });
    });

router.get("/:id", function (req, res) {
    Profile.findById(req.params.id)
      .populate("products")
      .exec(function (err, foundprofile) {
        if (err) {
          console.log(err);
        } else {
          var cost=0;
          foundprofile.products.forEach(function(product){
          cost=cost+product.price ;  
          });
          res.render("show_profile", {
            profile: foundprofile,totalcost:cost
          });
        }
      });
  });

// adds new product
router.post("/add/:prod_id",isLoggedIn,function(req,res){
  Product.findById(req.params.prod_id,function(err,foundProduct){
  Profile.findOne({id:req.user._id}, function (err,foundprofile) {
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
            profile.id=req.user._id;
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


//EDIT  ROUTE FOR  PROFILE
router.get("/:id/edit",  function(req, res) {
  Profile.findById(req.params.id, function(err, foundProfile) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("edit_profile", {
        profile: foundProfile
      });
    }
  });
});


//UPDATE PROFILE  ROUTE
router.post("/:id", function(req, res) {
  //find and update the campground
  Profile.findById(req.params.id,  function(
    err,
    profile
  ) {
    if (err) {
      res.redirect("/profiles/req.params.id");
    } else {
            profile.name=req.body.name;
            profile.image=req.body.image;
            profile.email=req.body.email;
            profile.save();
      res.redirect("/profiles/" + req.params.id);
    }
  });
});

  //DELETE  PRODUCT
router.delete("/:id/:prod_id",  function(req, res) {
  //find the profile
  Profile.update( {_id: req.params.id}, 
  { $pull: {products: req.params.prod_id } }, function(err,cb){
    if(err)console.log(err);
    else{
      Product.findById(req.params.prod_id,function(err,fp){
        if(err)console.log(err);
        else{
          Profile.findById(req.params.id,function(err,foundProfile){
            if(err)console.log(err);
            else{
              
              res.redirect("/profiles/" + req.params.id);
            }
          })
        }
      })
      
    }
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
