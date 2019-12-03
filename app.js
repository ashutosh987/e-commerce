var express = require("express"),
  app       = express(),
  mongoose  = require("mongoose"),
  server    = app.listen(3000, listening),
 bodyParser = require("body-parser");

//******************************************for connecting to MONGODB-ATLAS database****************************** */
//var mongoURI =
//"mongodb+srv://ashutosh:ashu@firstcluster-qp4ft.mongodb.net/test?retryWrites=true&w=majority";
// "mongodb://localhost:27017/yelp_";
//******************************************for connecting to MONGODB-ATLAS database****************************** */

app.get("/", (req, res) => res.send("api running"));
function listening() {
  console.log("server is running");
}
mongoose.connect("mongodb://localhost:27017/e_web", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});
