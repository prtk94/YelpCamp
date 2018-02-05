var express = require('express');
var router = express.Router(); 
var User = require("../models/user");
var passport = require("passport");
//landing page
router.get("/", function(req, res) {
	res.render("landing");
})



//AUTH routes
router.get("/register", function (req,res) {
	res.render("register");
});
//handle signup
router.post("/register", function (req,res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			/*console.log(err);
			req.flash("error",err.message);
			return res.render("register");*/
			 return res.render("register", {"error": err.message});
		} 
		passport.authenticate("local")(req, res, function (argument) {
			req.flash("success","Welcome to YelpCamp " +user.username);
			res.redirect("/campgrounds");
		})
	})
});	
//login
router.get("/login", function (req,res) {
	res.render("login");
});
router.post("/login",
	//middleware fn"
	passport.authenticate("local",{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}),
 function (req,res) {
	//call back function-not used yet

});
//logout
router.get("/logout", function (req,res) {
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/campgrounds");
});




module.exports = router;