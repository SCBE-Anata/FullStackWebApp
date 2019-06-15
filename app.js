const express=require('express'),
	  app=express(),
	  bodyParser=require('body-parser'),
	  mongoose=require('mongoose'),
	  passport=require('passport'),
	  LocalStrategy=require('passport-local'),
	  methodOverride=require('method-override'),
	  flash= require("connect-flash");
var Bootcamp=require('./models/campgrounds'),
	Comment=require('./models/comments'),
	User=require('./models/user');
var seedDB=require('./seeds');

// requiring routes
var commentRoutes=require('./routes/comments'),
	campgroundRoutes=require('./routes/campgrounds'),
	indexRoutes=require('./routes/index');

// prefer to use environment variables

var url=process.env.DATABASEURL|| "mongodb://localhost:27017/anata_workshops_v12";
mongoose.connect(url,{useNewUrlParser: true});

// mongoose.connect("mongodb+srv://charleneolive:[2Ph2c6]@cluster0-ktxv5.mongodb.net/test?retryWrites=true&w=majority", 
// 				 {useNewUrlParser: true, 
// 				  useCreateIndex: true}).then(()=> {
// 	console.log("Connected to DB");
// }).catch(err=> {
// 	console.log("ERROR: ", err.message);
// });


app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(flash());
// seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res, next)=> {
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//=====================================
app.listen(process.env.PORT || 3000, ()=> {
	console.log('hey');
});