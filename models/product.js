var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: true
  }, //name of the product
  productimage: {
    type: String,
    required: true
  }, //image of the product
  seller: {
    //seller (which will be some user)
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  description: String, //description about the product
  price: { type: Number, required: true },
  likes: [
    //comments given by other users

    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ],

  comments: [
    //comments given by other users
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

//MAKING MODEL

module.exports = mongoose.model("Product", productSchema);
