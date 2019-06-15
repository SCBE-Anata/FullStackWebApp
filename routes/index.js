var express=require('express');
var router=express.Router();

var passport=require('passport');
var User=require("../models/user");

// root route
router.get('/', (req,res)=> {

	res.render('landing');
});

// register form route
router.get('/register', (req,res)=> {
	res.render('register');
});
//Handle sign up logic
router.post("/register", (req,res)=> {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=> {
		if (err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, ()=>{
			req.flash("success", "Welcome to Anata "+ user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show log in form
router.get('/login', (req, res)=> {
	res.render("login");
});

//Log in route

router.post('/login', passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"}), (req, res)=> {
});

function isLoggedIn(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//Log out route
router.get('/logout', (req,res)=> {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports=router;