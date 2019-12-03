var mongoose=require("mongoose");

var productSchema = new mongoose.Schema({
    productname:String, //name of the product
    productimage:String, //image of the product
    seller:{             //seller (which will be some user)
        id:{
            type:  mongoose.Schema.Types.ObjectId ,
            ref  : "User"
        },
        username:String
    },
    description: String, //description about the product

    comments :[ //comments given by other users
        {
            type:  mongoose.Schema.Types.ObjectId ,
            ref  : "Comment"
        }
    ]
    
});

//MAKING MODEL

module.exports  = mongoose.model("Product",productSchema);