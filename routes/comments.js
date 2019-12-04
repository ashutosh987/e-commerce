var express  = require("express");
var router   =  express.Router({mergeParams:true});
var Product    = require("../models/product");
var Comment       = require("../models/comment");
var User          = require("../models/user");
var passport      =require("passport");

//new comment
router.get("/new",isLoggedIn,function(req,res){
    Product.findById(req.params.id,function(err,foundProduct){
        if(err){
            console.log(err);
        }
        else{
            res.render("new_comment",{product:foundProduct});
        }
    });
    
});

// handles new comment
router.post("/",isLoggedIn,function(req,res){
    Product.findById(req.params.id,function(err,foundProduct){
        if(err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    //add username  and id to comment and save it
                    comment.author.user_id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.product_name.product_id=foundProduct._id ;
                    comment.product_name.productname=foundProduct.productname;
                    comment.save();
                    foundProduct.comments.push(comment);
                    foundProduct.save();
                    res.redirect("/products/"+foundProduct._id);
                }
            });
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