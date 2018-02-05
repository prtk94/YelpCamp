//all the middleware goes here

//require the variables first
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next) {
	//check if authenticated
	if(req.isAuthenticated())
	{	
		Campground.findById(req.params.id, function (err,foundCampground) {
			if (err) {
				req.flash("error","Campground not found");
				res.redirect("/campgrounds");
			} else {
				//does user own the campground							
				if (foundCampground.author.id.equals(req.user._id)) //foundCampground.author.id is a Mongoose object and has the equals function which is handy for comparison; using === wont work her since one is a string and the other is a mongoose obj
					{
						next();
					} else {
						req.flash("error","You dont have permission to do that");
						res.redirect("back");
					}
			}
		})
	}
	else
	{

		res.redirect("back");
	}

}
middlewareObj.checkCommentOwnership = function (req,res,next) {
	//check if authenticated
	if(req.isAuthenticated())
	{
		Comment.findById(req.params.comment_id, function (err,foundComment) {
			if (err) {
				res.redirect("/campgrounds");
			} else {
				//does user own the comment
				if (foundComment.author.id.equals(req.user._id)) //foundComment.author.id is a Mongoose object and has the equals function which is handy for comparison; using === wont work her since one is a string and the other is a mongoose obj
					{
						next();
					} else {
						res.redirect("back");
					}
			}
		})
	}
	else
	{
		res.redirect("back");
	}

}

middlewareObj.isLoggedin = function(req,res,next) { 
//my custom middleware to stop loggedout/unsigned users to user privileges
	if(req.isAuthenticated())
	{
		return next();
	}	
		req.flash("error","Please Login first!");
		res.redirect("/login");
	
}



module.exports = middlewareObj