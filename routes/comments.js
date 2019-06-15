
var express=require('express');
var router=express.Router({mergeParams: true});
var Bootcamp=require("../models/campgrounds");
var Comment=require("../models/comments");

var middleware = require("../middleware");

// Comments new
router.get("/new", middleware.isLoggedIn, (req,res)=>{
	Bootcamp.findById(req.params.id,(err,foundBootcamp)=> {
		if (err) {
			console.log(err);
		} else {
			console.log(foundBootcamp);
			res.render("comments/new", {bootcamp: foundBootcamp});
		}
	});
});

// Comments create

router.post("/",middleware.isLoggedIn, (req,res)=> {
// 	lookup bootcamp using id
	console.log("found you");
		Bootcamp.findById(req.params.id,(err,foundBootcamp)=> {
		if (err) {
			console.log(err);
			req.flash("error", "Something went wrong");
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err,comment)=>{
				if (err){
					console.log(err);
				}else {
					//add username & id to comment
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					
					//save comment
					comment.save();
					foundBootcamp.comments.push(comment);
					foundBootcamp.save();
					console.log(comment);
					req.flash("success", "Successfully created comment");
					res.redirect('/campgrounds/'+foundBootcamp._id);
				}
			});
		}
	});
// 	create new comment
// 	connect new comment to bootcamp
// 	redirect to bootcamp showpage
});

router.get("/:comments_id/edit",middleware.checkCommentOwnership,(req,res)=> {
	Comment.findById(req.params.comments_id, function(err, foundComment){
		if (err){
			res.redirect("back");
		}else {
			res.render('comments/edit', {bootcamp_id: req.params.id, comment: foundComment});
		}
	});
	
});

//Comment edit route
router.put("/:comments_id", middleware.checkCommentOwnership, (req,res)=>{
		   Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, (err, updatedComment)=> {
			   if (err){
				   res.redirect("back");
				   console.log("there is an error");
			   }else {
				   console.log("there is no error");
				   res.redirect("/campgrounds/"+ req.params.id);
			   }
			   
		   });
});

// DESTROY COMMENTS
router.delete("/:comments_id", middleware.checkCommentOwnership, (req,res)=> {
	Comment.findByIdAndRemove(req.params.comments_id, (err)=> {
		if (err){
			
			res.redirect("back");
		}else {
			req.flash("success", "Comments deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});


module.exports=router; 