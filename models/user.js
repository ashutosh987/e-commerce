var mongoose=require("mongoose");

var userSchema = new mongoose.Schema({
    username:String,
    userimage:String,
    password: String
});

//MAKING MODEL

module.exports  = mongoose.model("User",userSchema);