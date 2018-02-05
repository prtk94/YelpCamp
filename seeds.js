var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");

var data = [
	{
		name: "Clouds Rest",
		image: 
	}
	

]


function seedDB(argument) {
		Campground.remove({}, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("deleted");
		}
		})
		//
		campgrounds
}

module.exports = seedDB;	