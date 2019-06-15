// all the middleware goes here

var Bootcamp=require("../models/campgrounds");
var Comment=require("../models/comments");

var middlewareObj = {};

middlewareObj.checkBootcampOwnership= function(req,res,next){
	if (req.isAuthenticated()){
		Bootcamp.findById(req.params.id, (err, foundBootcamp)=> {
			if (err){
				req.flash("error", "Bootcamp not found");
				console.log("what is happening");
				res.redirect("back");
			}else {
				if(!foundBootcamp){
					req.flash("error", "Item not found");
					return res.redirect("back");
				}
				if (foundBootcamp.author.id.equals(req.user._id)){
					next();
				}else {
					req.flash("error", "You do not have permission to do that");
					res.redirect("back");
				}
			}
	});
	}else {
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership= function(req,res,next){
	if (req.isAuthenticated()){
		Comment.findById(req.params.comments_id, (err, foundComment)=> {
			if (err){
				
				res.redirect("back");
			}else {
				if (foundComment.author.id.equals(req.user._id)){
					next();
				}else {
					req.flash("error", "You don't have permission to edit");
					res.redirect("back");
				}
			}
	});
	}else {
		req.flash("error", "You need to be looged in");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn= function(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
// 	Just adding the below line won't display anything
// 	Just saying for the next request, add please login first in flash
// 	Need to place this line before redirecting
	req.flash("error", "You need to be logged in.");
	res.redirect("/login");
};


module.exports = middlewareObj;