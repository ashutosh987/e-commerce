var mongoose = require("mongoose");

var profileSchema = new mongoose.Schema({
  profilename: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
    
  },
  username: String,
  products: [
    //comments given by other users
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});

//MAKING MODEL

module.exports = mongoose.model("Profile", profileSchema);