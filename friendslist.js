var express=require("express");
var app=express();
var path = require("path");
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')));
var friends=["alok","aman","praveen"];
app.get("/dog",function(req,res){
    res.render(path.resolve(__dirname + "/view/home"));
})
app.get("/friends",function(req,res){
    console.log("the  friends  list goes here!!!");
     
      res.render(path.resolve(__dirname + "/view/friends"),{friendslist:friends});
})

app.post("/addfriend",function(req,res){
    var newfriend=(req.body.newfriend);
    friends.push(newfriend);
    res.redirect("/friends");
});

app.listen(5000,function(){
    console.log("server has started!!");
});
