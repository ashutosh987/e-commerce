var express  = require("express");
var router   =  express.Router();
var path          = require("path");
var passport      =require("passport");
var User          = require("../models/user");

//HOME PAGE
router.get("/",function(req,res){
    res.render(path.resolve(__dirname + "/../views/landing"));
});

//  show register form
router.get("/register",function(req,res){
    res.render(path.resolve(__dirname + "/../views/register"));
});

//handle sign  up logic
router.post("/register",function(req,res){
        var newUser=new User({
            name : req.body.name ,
            email : req.body.email,
            image : req.body.image,
        });
        User.register(newUser,req.body.password,function(err,user){
            if(err){
                console.log(err);  
                return res.render(path.resolve(__dirname + "/../views/register"));
            }
            else{
                passport.authenticate("local")(req,res,function(){
                    console.log(user);
                    res.redirect("/");
                });
            }
        });
});

//show login form
router.get("/login",function(req,res){
    res.render(path.resolve(__dirname + "/../views/login"));
});
//handling  login using  middleware
//app.post("/login",middleware,callback);
router.post("/login", passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}) , function(req,res){    
});

//logout route
router.get("/logout",function(req,res){
    req.logOut();
    res.render(path.resolve(__dirname + "/../views/landing"));
});
//middleware authentication
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return  next();
    }
    res.redirect("/login");
}
//==============================================================================
module.exports = router;