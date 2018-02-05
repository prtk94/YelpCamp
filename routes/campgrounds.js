var express = require('express');
var router = express.Router(); 
var Campground = require("../models/campgrounds");
var middleware = require("../middleware")
//campgrounds routes
router.get("/", function(req, res) {
	//Get all campgrounds from db
	Campground.find({},function (err,allCampgrounds) {
		if (err) {
			console.log(err)
		} else {
			res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user}); //Passport gives user info in req.user object		
		}
	})
	//
})

//CREATE- add new campgrounds to the db
router.post("/", middleware.isLoggedin ,function (req,res) {
	//get data from form
	var name =req.body.name ;
	var image =req.body.image;
	var description = req.body.description;
	
	//get the user data. A cleaner way is to declare and object and get the data
	var author = {
		id: req.user._id, //req.user has all the info of user logged in
		username: req.user.username
	};
	
	//create new obj and push it in array
	var newCamp = {
		name : name,
		image: image,
		description: description,
		author: author
	}
	//Save to db 
	Campground.create(newCamp,function (err,newlyCreatedCampground) {
		if (err) {
			console.log(err);
		} else {
			
			res.redirect("/campgrounds");		
		}
	});
	
})

router.get("/new", middleware.isLoggedin,function (req, res) {
	res.render("campgrounds/new");
});

//SHOW- show details of one campground
router.get("/:id",function (req,res) {
	// res.render("show");
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show",{campground: foundCampground});		
		}
	});
})

/// EDIT Routes
router.get("/:id/edit", middleware.checkCampgroundOwnership,function (req, res) {
	Campground.findById(req.params.id, function (err, foundCampground) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			req.flash("success","Campground edited!");
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	})
	
});
///UPDATE Route
router.put("/:id/", middleware.checkCampgroundOwnership,function (req,res) {
	//find,update and redirect to showpage
	 Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
	 	if (err) {
	 		res.redirect("/campgrounds"); 
	 	} else {
	 		res.redirect("/campgrounds/"+req.params.id); //+ updatedCampground._id can also be done
	 	}
	 })	
})

//DELETE/ DESTROY Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function (req,res) {
	Campground.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds")
		}

	});
});

module.exports = router; 