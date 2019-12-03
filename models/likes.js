var mongoose = require("mongoose");

var likeSchema = new mongoose.Schema({
  //what the comment is
  author: {
    //who has given the comment
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  //not sure about product_id should be attached with the comment or not:-)
  product_name: {
    //the comment is for which product
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    productname: String
  }
});

//MAKING MODEL

module.exports = mongoose.model("like", likeSchema);
