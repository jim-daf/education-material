require('dotenv').config();
const express = require('express')
const expressLayouts=require('express-ejs-layouts')
const app=express()
const mongoose=require('mongoose')
const flash=require('connect-flash')
const session=require('express-session')
const passport = require('passport')
const methodOverride=require('method-override')

// Include routes
const user=require("./controllers/registration")

// User schema
const User=require("./models/User")

//Require static files
app.use( express.static("public"));
app.use("/assets",express.static(__dirname+'public/assets'))
app.use("/media",express.static(__dirname+'public/media/'))
app.use("/images",express.static(__dirname+'public/images/'))
app.use("/training_material",express.static(__dirname+'public/assets/training_material'))

//passport config
require('./config/passport')(passport)

//DB config
const db=require('./config/keys').MongoURI;
const { MongoURI } = require('./config/keys');

//connect to Mongo DB
mongoose.connect(db,{ useNewUrlParser: true,useUnifiedTopology: true })
    .then(()=> {
        console.log('MongoDB connected')
        
    })
    .catch((err => console.log(err)))

//Bodyparser
app.use(express.urlencoded({extended:false}))

// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//middleware
app.use(methodOverride('_method'))

// Connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next();
})


//Routes
app.use("/",require('./routes/index'))
app.use("/users",require('./routes/users'))

//EJS
app.use(expressLayouts);
app.set('layout','layout')
app.set('view engine','ejs');

// Server listens to port 5000
const PORT=process.env.PORT || 5000;
app.listen(PORT,console.log(`Server started on port ${PORT}`));

// Verify user's email
app.get('/verify',function(req,res){
    
    User.updateOne({role:"basic",email_verified:false,email:user.getEmail()},  
    {email_verified:true}, function (err, docs) { 
    
    if (err){ 
        console.log(err);
        return err;
    } 
    else{ 
        console.log("Updated Docs : ", docs); 
        
        req.flash('success_msg', 'Email successfully verified');
        return res.redirect('/users/login');
    } 
});
});


