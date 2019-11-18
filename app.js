var express              =require("express");
var mongoose             =require("mongoose");
var User                 =require("./models/user");
var engine              =require("ejs-mate");
var passport             =require("passport");
var ejs                  =require('ejs');
var bodyparser           =require("body-parser");
var LocalStrategy        =require("passport-local");
var fetch=require("node-fetch");
//var JsonData = require(' json-data');
//var url="http://intermediasutra-env.w84r34bwj9.ap-south-1.elasticbeanstalk.com/webapi/vehicle/getVehicle";
// var firebase = require('firebase');
// firebase.initializeApp({
// 	databaseURL: "https://transport-managment.firebaseio.com"
//    });
   
//    var dbRef = firebase.database().ref("buses");
//    dbRef.on("value", snap => {
	
// 	console.log(snap.val()); // this method will return full user data object
//  });
 
   //console.log("Hi");
   //dbRef.orderByChild("vehicleName").on("child_added", snap => {
	   
// 	console.log(snap.val());
//    });
   //console.log(dbRef);
   
// var serviceAccount = require('./google-services.json');
// var defaultApp = admin.initializeApp({
// 	projectId: "transport-managment",
//     clientEmail: 'firebase-adminsdk-8yis9@transport-managment.iam.gserviceaccount.com',
//     privateKey: 'DwnccHazaKtNNQD5JXZK3o0CcGfooAFVGzSU0fBu'
//   });
//fetch("http://intermediasutra-env.w84r34bwj9.ap-south-1.elasticbeanstalk.com/")
// .then(function(response){
//     return response.json();
// })

// var data = new JsonData();
// data.append( "json", JSON.stringify( payload ) );

var request = require('request');

const busDetails = (weekday)=>{
	var payload = {
		"endLocation": "",
		"startLocation": "",
		"timing": {
		  "weekDay": "" + weekday.toString(),
		  "startDate": "2019",
		  "startTime": "153100"
		},
		"limit": 12,
		"sortOrder": false,
		"start": 0
	};
	var options = {
		uri: 'http://intermediasutra-env.w84r34bwj9.ap-south-1.elasticbeanstalk.com/webapi/vehicle/getVehicle',
		method: 'POST',
		json: payload
	};
	return options; 
}
  

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

app.get("/",function(req,res){ 
	res.render("home");
});

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

app.get("/profile/:id",isLoggedIn, function(req,res){
	//
	//res = busDetails;
	var option_1 =  busDetails(1);
	var bid=req.params.id;
	 request(option_1, function (error, response, body_1) {
		var bus_detail = [];
		var count = 0;
		var current_bus_detail = {};
		if (!error && response.statusCode == 200) {
			body_1.vehicleList.forEach(element => {
					bus_detail.push(element);
					count++;
					if(element.uId === req.params.id){
						current_bus_detail = element;
					}
				
			});
			console.log(current_bus_detail);
						
			//res.render("bus_detail",{bid:bid,bus_details:bus_detail,bus_count:count,current_bus_details:current_bus_detail});
			res.render("test");		
		}
	});
	
	//res.render("bus_detail");

});
//var x;
//app.get("/profile/suspicious",isLoggedIn,function(req,res){

	// var requestLoop =   setInterval(function(){
	// 	request({
	// 			url: "http://intermediasutra-env.w84r34bwj9.ap-south-1.elasticbeanstalk.com/webapi/liveStatus/getStatus",
	// 			method: "GET",
	// 			timeout: 5000,
	// 			followRedirect: true,
	// 			maxRedirects: 1000
	// 	},function(error, response, body){
	// 	//	var suspi;
	// 			if(!error && response.statusCode == 200){
	// 					console.log('success'+(response.body));
						
	// 					//console.log('busid'+response.message);
	// 					 suspi=JSON.parse(response.body).uId;
							
	// 					console.log("suspi",suspi);
	// 					 var r = {
	// 						 "vehicleId" : suspi
	// 					 }
	// 					  suspiAct = (weekday)=>{
							 
	// 						var option = {
	// 							uri: 'http://intermediasutra-env.w84r34bwj9.ap-south-1.elasticbeanstalk.com/webapi/vehicle/get',
	// 							method: 'POST',
	// 							json: r 
	// 						};
	// 						return option; 
	// 					}
				
	// 			}else{
	// 				//res.send(response.statuscode);
	// 					console.log('error' + response.statusCode);
	// 			}
	// 			return suspi;
	// 	});
	// }, 5000);



	app.get("/profile",isLoggedIn,function(req,res){
				var option_1 = busDetails(1);
  
			request(option_1, function (error, response, body_1) {
				console.log(response);
			   var bus_detail = [];
			   var count = 0;
			   if (!error && response.statusCode == 200) {
				   body_1.vehicleList.forEach(element => {
						   bus_detail.push(element);
						   count++;
					   
				   });
				   res.render("profile",{bus_details:bus_detail,bus_count:count});
					   
			   }
		   });
	 }
);
//});

// console.log(requestLoop);

  
//login routes
// app.get('/profile/:id/new',function(req,res){
	
// 		   // request(option_2, function (error, response, body_2) {
// 		   // 	if (!error && response.statusCode == 200) {
// 		   // 		console.log(body_2.vehicleList);
// 		   // 		res.render("bus_detail",{response1:body_1,response2:body_2});
// 		   // 	}
// 		   // 	});	
// 		   var option_2 =  busDetails(1);
// 		   request(option_2, function (error, response, body_2) {
// 			  if (!error && response.statusCode == 200) {
// 				  // console.log(body_1.vehicleList);
// 				  var current_bus2 = "bus_"+req.params.id;
// 				  var current_bus_detail2 = [];
// 				  var count2 = 0;
// 				  body_2.vehicleList.forEach(element => {
// 					  if(element.vehicleName === current_bus2){
// 						  current_bus_detail2.push(element);
// 						  count2++;
// 					  }
// 				  });
// 				  // console.log(count);
// 				  res.render("new",{current_bus_details:current_bus_detail2,id:req.params.id});	
// 			  }
// 		  });
		
// });

//login logic
//middleware



app.get("/profile/:id/edit",function(req,res){
	var option_1 =  busDetails(1);
	var bid=req.params.id;
	 request(option_1, function (error, response, body_1) {
		var bus_detail = [];
		var count = 0;
		var current_bus_detail = {};
		if (!error && response.statusCode == 200) {
			body_1.vehicleList.forEach(element => {
					bus_detail.push(element);
					count++;
					if(element.uId === req.params.id){
						current_bus_detail = element;
					}
				
			});
			console.log(current_bus_detail);
						
			res.render("edit",{bid:bid,bus_details:bus_detail,bus_count:count,current_bus_details:current_bus_detail});
					
		}
	});
});

app.put("/profile/:id",function(req,res){//update route
	//var option_1 =  busDetails(1);
	var routeInfo=req.body.routeInfo;
	var startTime=req.body.startTime;
	var driverName=req.body.driverName;
	var mobileNum=req.body.mobileNum;
	var fare=req.body.fare;
	//var updateData={routeInfo:routeInfo,startTime:startTime,driverName:driverName,mobileNum:mobileNum,fare:fare};
// 	request(updateData,function(err,driverUpdate){//edit route
// //function given by mongoose
// 	if(err)
// 		console.log(err);
// 	else
// 		res.redirect("/profile/"+req.params.id);
// });
request.post('http://intermediasutra-env.w84r34bwj9.ap-south-1.elasticbeanstalk.com/webapi/vehicle/getVehicle',
'UPDATE tutorials_tbl SET tutorial_title="Learning JAVA" WHERE tutorial_id=3', (error, res, body) => {
	if (error) {
	  console.error(error)
	}
	else
	res.redirect("/profile/"+req.params.id);
  })
});

app.post("/login",passport.authenticate("local",{
			successRedirect:"/profile",
			failureRedirect:"/login"
}),);
// app.get("/redirect_r/:uId",(req,res,next)=>{
// 	res.redirect("/profile/"+req.params.uId);
// })
//if(isLoggedin){
// 			var requestLoop = setInterval(function(){
// 		request({
// 				url: "http://intermediasutra-env.w84r34bwj9.ap-south-1.elasticbeanstalk.com/webapi/liveStatus/getStatus",
// 				method: "GET",
// 				timeout: 2000,
// 				followRedirect: true,
// 				maxRedirects: 10
// 		},function(error, response, body){
// 			let data=JSON.parse(response.body);
// 			let udata=parseInt(data.uId);
// 		//console.log(data);
// 				if(data.baseResponse.statusCode === '999'){
// 				console.log(data.message);
// 				// app.get('/',function(req,res){
// 				// 			console.log("redirected");
// 				// 			res.redirect('/profile');
// 				// });
// 				//window.location.replace("https://www.google.com");
// 					//  request({
// 					// 	host: 'localhost:8080',
// 					// 	path: '/redirect_r/'+udata,
// 					// }, function (response) {
// 					// 	console.log("done redirecting");
// 					// });
// 				}else{
// 					//res.send(response.statuscode);
// 						console.log('error' + response.statusCode);
// 				}
// 		});
// 	}, 10000);
// //}

app.get("/logout",function(req,res){
		req.logout();
		res.redirect("/login");
});

// app.get("/profile/maps",function(req,res){
// 	res.render("/maps");
// });
function isLoggedin(req,res,next){
	if(req.isAuthenticated()){
		return true;
	}
	return false;
}

function isLoggedIn(req,res,next){
		if(req.isAuthenticated()){
			return next();
		}
	res.redirect("/login");	
}

app.listen(8080,function(){
		console.log("server is running");
});