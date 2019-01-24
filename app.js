var express              =require("express");
var mongoose             =require("mongoose");
var User                 =require("./models/user");
var engine              =require("ejs-mate");
var passport             =require("passport");
var ejs                  =require('ejs');
var bodyparser           =require("body-parser");
var LocalStrategy        =require("passport-local");

var passportLocalMongoose=require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/bus_demo_app");

var port = process.env.PORT || 8080;
var app=express();
console.log(__dirname);
app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname + "/css"));
app.use(express.static(__dirname + "/vendor"));
app.use(express.static(__dirname + "/fonts"));

app.use(require("express-session")({
		secret:"whats up",
		resave:false,
		saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.engine('ejs',engine);
app.set('views', __dirname + '/views');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});
//Auth Routes

// app.get("/",function(req,res){ 
// 		res.render("home");
// });

app.get("/login",function(req,res){//render login form
    res.render("index");
});

app.get("/register",function(req,res){//show signUp page 
		res.render("register");
});
app.post("/register",function(req,res){//handling user sign up 
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
			if(err)
				res.render("register");
			else
			{
			passport.authenticate("local")(req,res,function(){
			res.redirect("/profile");})
			}
				
})
});

app.get("/profile",isLoggedIn,function(req,res){
		res.render("profile");
});

app.get("/profile/:id",isLoggedIn,function(req,res){
	res.render("bus_detail",{bus_id:req.params.id});
	// console.log(req.params.id);
	
});
//login routes


//login logic
//middleware
app.post("/login",passport.authenticate("local",{
			successRedirect:"/profile",
			failureRedirect:"/login"
}),function(req,res){

});

app.get("/logout",function(req,res){
		req.logout();
		res.redirect("/login");
});

function isLoggedIn(req,res,next){
		if(req.isAuthenticated()){
			return next();
		}
	res.redirect("/login");	
}

app.listen(8080,function(){
		console.log("server is running");
});