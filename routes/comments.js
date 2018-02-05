var express = require('express');
var router = express.Router({mergeParams: true}); 
var Comment = require("../models/comment");
var Campground = require("../models/campgrounds");
var middleware = require("../middleware")
//COMMENTS Route
router.get("/new",middleware.isLoggedin,function (req,res) {
	//find campground by id
	Campground.findById(req.params.id, function (err,foundCampground ) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new",{campground: foundCampground});		
		}
	})
	
})

router.post("/",middleware.isLoggedin, function (req,res) {
	//lookup campground by id
	Campground.findById(req.params.id, function (err,foundCampground ) {
		if (err) {
			console.log(err);
			res.redirect("/campground");
		} else {
			
			Comment.create(req.body.comment, function (err,createdComment) {
				if (err) {
							req.flash("error","Comment failed");
						console.log(err);
				}
				else{
						//add username and id to comment 
						createdComment.author.id = req.user._id; //req.user has the user obj
						createdComment.author.username = req.user.username;
						//save the new comment
						createdComment.save();
						
						foundCampground.comments.push(createdComment._id);
						foundCampground.save();
						req.flash("success","Comment created successfully");
						res.redirect('/campgrounds/' + foundCampground._id);
				}
			})
		}
	})
})
//edit routes
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function (req, res) {
	Comment.findById(req.params.comment_id, function (err, foundComment) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	})
	
});
//update route
router.put("/:comment_id/",middleware.checkCommentOwnership, function (req,res) {
	//find,update and redirect to showpage
	 Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
	 	if (err) {
	 		res.redirect("/campgrounds"); 
	 	} else {
	 		res.redirect("/campgrounds/"+req.params.id); 
	 	}
	 })	
})
//delete comment route
router.delete("/:comment_id", middleware.checkCommentOwnership	,function (req,res) {
	Comment.findByIdAndRemove(req.params.comment_id, function (err) {
		if (err) {
			res.redirect("back")
		} else {
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/"+req.params.id)
		}

	});
});

module.exports = router;