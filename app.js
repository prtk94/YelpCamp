var express = require('express');
var app = express();
app.set("view engine","ejs");
var bodyParser = require("body-parser"); //to deal with POST requests
app.use(bodyParser.urlencoded({extended : true}));

//get the routes from the files
var campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index"),
	commentRoutes = require("./routes/comments")

//mongoose for db connect
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");
//SCHEMAs
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var User = require("./models/user");

//connect-flash: to deliver flash messages to website to improve UX
var flash = require("connect-flash");
app.use(flash());

// var seedDB = require("./seeds");
// seedDB();
app.use(express.static(__dirname + '/public'))

//Passport and config
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
app.use(require('express-session')({
	secret: "dogs are cool",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()); //User.serializeUser() is the function added by passportLocalMongoose and we pass it as parameter to serializeUser method.
passport.deserializeUser(User.deserializeUser());

//methodoverride
var methodOverride= require("method-override");
app.use(methodOverride("_method"));
//middleware 
//sends current user info to every template, also error/success messages
app.use(function (req,res,next) {
	res.locals.currentUser = req.user; //res.locals has data which is accesible by all the templates
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();	
})




//use the routes
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//catch all route
app.get("*", function (req,res) {
	res.send("Site doesnt exist yet. You lost m8?");
});

app.listen(3000, () => console.log('YELPCamp app listening on port 3000!'))