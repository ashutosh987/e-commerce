var express = require("express");
var router = express.Router({ mergeParams: true });
var Profile = require("../models/profile");
var Product = require("../models/product");
var Comment = require("../models/comment");
var User = require("../models/user");
var passport = require("passport");
//show profile page
router.post("/", isLoggedIn, function(req, res) {
  Profile.findOne({ id: req.user._id }, function(err, foundprofile) {
    if (err) console.log(err);
    else if (foundprofile) {
      console.log(foundprofile);
      res.redirect("/profiles/" + foundprofile._id);
    } else {
      var profile = new Profile();
      profile.id = req.user._id;
      profile.save();
      console.log(profile);
      res.redirect("/profiles/" + profile._id);
    }
  });
});
//new profile(get route)
router.get("/new", function(req, res) {
  Profile.findOne({ id: req.user._id }, function(err, foundprofile) {
    if (err) console.log(err);
    else if (foundprofile) {
      console.log(foundprofile);
      res.redirect("/profiles/" + foundprofile._id);
    } else {
      res.render("new_profile");
    }
  });
});

//handle the post route
router.post("/new", function(req, res) {
  var profile = new Profile();
  profile.id = req.user._id;
  profile.name = req.body.name;
  if (req.user.img) profile.image = req.user.img;
  if (!req.user.img)
    profile.image =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEXk5ueutLepsLPo6uursbXJzc/p6+zj5ea2u76orrKvtbi0ubzZ3N3O0dPAxcfg4uPMz9HU19i8wcPDx8qKXtGiAAAFTElEQVR4nO2d3XqzIAyAhUD916L3f6+f1m7tVvtNINFg8x5tZ32fQAIoMcsEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQTghAJD1jWtnXJPP/54IgNzZQulSmxvTH6oYXX4WS+ivhTbqBa1r26cvCdCu6i0YXbdZ0o4A1rzV+5IcE3YE+z58T45lqo7g1Aa/JY5tgoqQF3qb382x7lNzBLcxft+O17QUYfQI4IIeklKsPSN4i6LKj/7Zm8n99RbHJpEw9gEBXNBpKIYLJqKYRwjOikf//r+J8ZsVuacbqCMNleI9TqGLGqMzhnVdBOdd6F/RlrFijiCoVMk320CBIahUxTWI0KKEcJqKbMdpdJb5QvdHq6wCI5qhKlgGMS/RBHkubWDAE+QZxB4xhCyDiDkLZxgGEVdQldzSKbTIhmZkFkSEPcVvmBn2SMuZB9od7fQDsMiDdKJjFUSCQarM5WirZ3C2TT/htYnyPcPfgrFHWz0BI74gr6J/IZiGUxAZGQLqmvQLTrtE/Go4YxhVRIpEw+sww1IIcqr5NKmUUzLF3d4/qPkYIp2T/obPuemlojFUR4t9Q2Vojhb7BmgElWHzLPH8hucfpefPNFTVgs9h1AdU/Pin96vwWbWdf+X9Absn3OdO34aMdsDnP8WgKYisTqI6CkNGqZQo1XA6Ef6AU32SJzOcBukHPF07/xNSgmHKa5BOhtezv6mA/rYJpwXNAnbRZ1XuF3BzDcO3vpA3+ny2909gbqE4hhD3LIPhLLyBNhPZvbZ3B+3tPYa18A7auSlXQayKwTPNLKDcuOB0xPYKDPFTkWsevQPRZ1J8Hji9I1KQ34r7hZhrwNwOZ97QxNx0drwn4QI0wQk1DcEsfKCWKdxVvxPSNUIp/knmAXT+nT+Ko3+0H96rcNb3m1fx7MBTJdeBJ7uFcWsc0wvgAsC4pROW0l2inbAmIBv/7GZmuhQH6API2rr8T0e6yuZJ+80A9LZeG62T3tik31XwxtwZcizKuTHkMjB1WdZde4Kmic/A5ZI3rr1ae21d08PlVHYfAaxw9G9CYRbJ+8ZdbTcMRV1XM3VdF0M32vtoTdZ0+u29s0OttJ5bz64UwinjaFMVY9vkqc3KKSxN21Xl+0L4Q3Vuv1tYl0pqnX6ms4XetFz7gdZVAgUEoJntfOUe4ZwsHd9FzqQ3Vv6xe41l0XJcqcKl6TZvlv7ClAW3BsqQW4X7ypApB8dmTgK4IX5wvqIVj33HtD2qSG4BqznxdIefL27Y4sahi0MdIdvUsDva8agGGbCtITmCY31MHD2O0uIdh/0rJDQ1VX5Zdxz3rR2QDbv6qXl9vudzqQtGm1Jv9LDXOsfvvB7VcZ8PDKD0mQ1VHPYQ9O+Yj4hR1IUD8rBnn3ho2m8oQMxbCFiKlL2ioSW5heeJqegED52CzxCtcGD3Kv8Wms9EYLyUhwaFIhSMBClevWEmiK/Iaogu4H7sg6ppQhQG8RUqivuTGOAJOg6FfgW0q0M0PQMRMEgXaeNf3SYDZ8PIMI0+wHgr/MgN7wYwpiLjCCqM6ydUDZLQiB6nDdNC8SDyig3jPPpFXGcC9O8BUBDVmgBY59E7Md/35Loe/UVEECEJwYggJjELZ4J71SaQSBeC02n4Da29CayJNA28SAhd2CQyC1Xw6pSmGSINQVuMhAZp4DClan9MgmkDDNmezqwS8sgtlXK/EPBhoaSmYVC/F7IO1jQEdHOlabpKh3+jzLQSTUiq4X2I+Ip/zU8rlaqAvkS21ElR+gqu3zbjjL+hIAiCIAiCIAiCIAiCsCf/AKrfVhSbvA+DAAAAAElFTkSuQmCC";
  profile.email = req.body.email;
  profile.save();
  console.log(profile);
  res.redirect("/profiles/" + profile._id);
});

router.get("/:id", function(req, res) {
  Profile.findById(req.params.id)
    .populate("products")
    .exec(function(err, foundprofile) {
      if (err) {
        console.log(err);
      } else {
        var cost = 0;
        foundprofile.products.forEach(function(product) {
          cost = cost + product.price;
        });
        res.render("show_profile", {
          profile: foundprofile,
          totalcost: cost
        });
      }
    });
});

// adds new product
router.post("/add/:prod_id", isLoggedIn, function(req, res) {
  Product.findById(req.params.prod_id, function(err, foundProduct) {
    Profile.findOne({ id: req.user._id }, function(err, foundprofile) {
      if (err) console.log(err);
      else if (foundprofile) {
        foundprofile.products.push(foundProduct);
        foundprofile.save();
        console.log(foundprofile);
        res.redirect("/profiles/" + foundprofile._id);
      } else {
        var profile = new Profile();
        profile.id = req.user._id;
        profile.products.push(foundProduct);
        profile.save();
        console.log(profile);
        res.redirect("/profiles/" + profile._id);
      }
    });
  });
});

//EDIT  ROUTE FOR  PROFILE
router.get("/:id/edit", function(req, res) {
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
  Profile.findById(req.params.id, function(err, profile) {
    if (err) {
      res.redirect("/profiles/req.params.id");
    } else {
      profile.name = req.body.name;
      profile.image = req.body.image;
      profile.email = req.body.email;
      profile.save();
      res.redirect("/profiles/" + req.params.id);
    }
  });
});

//DELETE  PRODUCT
router.delete("/:id/:prod_id", function(req, res) {
  //find the profile
  Profile.update(
    { _id: req.params.id },
    { $pull: { products: req.params.prod_id } },
    function(err, cb) {
      if (err) console.log(err);
      else {
        Product.findById(req.params.prod_id, function(err, fp) {
          if (err) console.log(err);
          else {
            Profile.findById(req.params.id, function(err, foundProfile) {
              if (err) console.log(err);
              else {
                res.redirect("/profiles/" + req.params.id);
              }
            });
          }
        });
      }
    }
  );
});

//middleware authentication
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
