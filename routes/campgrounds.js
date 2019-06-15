var express=require('express');
var router=express.Router();
var Bootcamp = require("../models/campgrounds");

// if we require a directory "middleware", it will automatically require the contents of index.js
var middleware = require("../middleware");

// INDEX: show all campgrounds
router.get('/', (req, res)=> {
	// 	get all campgrounds from db
	Bootcamp.find({}, (err,allBootcamps)=>{
		if (err){
			console.log(err);
		}else {
			res.render('campgrounds/index', {bootCamps:allBootcamps, currentUser: req.user});
		}
	});
	
});

// NEW: show form to add new campground
router.get('/new', middleware.isLoggedIn, (req,res)=> {
	res.render('campgrounds/new');
});

// CREATE: Add new campground
router.post('/', middleware.isLoggedIn, (req,res)=>{
// 	get data from form and add to campground array
// 	redirect 
	var name= req.body.name;
	var image=req.body.image;
	var price=req.body.price;
	var description=req.body.description;
	var author= {
		id: req.user._id,
		username: req.user.username
	};
	var newBootcamp= {name: name, price: price, image: image, description: description, author: author};
	
	

// 	Create a new bootcamp and save to database
	Bootcamp.create(newBootcamp, (error, newlyCreated)=> {
		if (error){
			console.log(error);
		}else {
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
		});
});	

// SHOW - show more info about 1 campground
// need the /campground/new to be declared first
router.get("/:id", (req,res)=>{
// 	find the campground with provided ID
// 	render show template with that campground	
		Bootcamp.findById(req.params.id).populate("comments").exec((err,foundBootcamp)=> {
		if (err) {
			console.log(err);
		} else {
			console.log(foundBootcamp);
		}

		res.render("campgrounds/show", {bootcamp: foundBootcamp});

	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkBootcampOwnership, (req, res)=>{
	Bootcamp.findById(req.params.id, (err,foundBootcamp)=> {
	
		res.render("campgrounds/edit", {bootcamp: foundBootcamp});
	});
		   
	});
//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkBootcampOwnership, (req,res)=> {
	// find and update correct campground
	Bootcamp.findByIdAndUpdate(req.params.id,req.body.bootcamp, (err, updatedBootcamp)=> {
		if (err){
			res.redirect("/campgrounds");
		}else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
	//go back to show page
	
});

// DESTROY CAMPGROUND
router.delete("/:id", middleware.checkBootcampOwnership, (req,res)=> {
	Bootcamp.findByIdAndRemove(req.params.id, (err)=> {
		if (err){
			res.redirect("/campgrounds");
		}else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports=router; 