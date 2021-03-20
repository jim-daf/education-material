require('dotenv').config();
const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const passport=require("passport");


const userSendMail = require('../controllers/userSendsMail');
const adminSendMail = require('../controllers/adminSendsMail');

const{registration}=require('../controllers/registration');
const uploadFile=require('../controllers/uploadFilesToMongo')
// sendgrid
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')

// Mongo URI
const db=require('../config/keys').MongoURI;

// User model
const User=require("../models/User")

// Authentication and role management
const {alreadyLoggedIn, checkifAdmin,checkIfAccepted}=require("../config/auth")
const {ensureAuthenticated,ensureEmailVerified}=require("../config/auth");

const { MongoURI } = require('../config/keys');
const { verification } = require('../controllers/emailVerification');

//Login Page
router.get("/login",alreadyLoggedIn,(req,res)=>res.render("login"))

//Register Page
router.get("/register",alreadyLoggedIn,(req,res)=>res.render("register"))

 //Training Course Page
router.get("/trainingCourse",ensureAuthenticated,checkIfAccepted,(req,res)=>res.render("trainingCourse"))

 //Training Material Page
router.get("/trainingMaterial",ensureAuthenticated,checkIfAccepted,(req,res)=>res.render("trainingMaterial"))

//Accept Or Decline Page
router.get('/acceptOrDecline',checkifAdmin,async function(req, res) {
    
    User.find({}, function(err, data) {
        // data is array of objects
        res.render('acceptOrDecline.ejs', {
            user:req.user,
            data:data
        });
    });
});

// Logout
router.get('/logout', (req, res) => {

    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');

});

 //Contact Page
router.get("/contact",(req,res)=>res.render("contact"))

// Notify Students Page
router.get("/notifyStudents",checkifAdmin,(req,res)=>res.render("notifyStudents"))

// Upload File Page
router.get('/uploadFile',(req,res)=>res.render('uploadFile'))

// Display file to browser
router.get('/files/:filename', (req, res) => {
  
  uploadFile.gfs.files.findOne({ filename:req.params.filename}, (err, file) => {
    // Check if file exists
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // Display the file to the browser
    uploadFile.gridFSBucket.openDownloadStreamByName(file.filename).pipe(res);
    
  });
});

module.exports=router;


// Register Handle
router.post('/register',registration)

router.post('/uploadFile',uploadFile.upload,(req,res)=>{
    console.log(req.file)
    req.flash('success_msg','You are now registered. Please wait for the admin to give you access to all the pages.')
    res.redirect('/users/login')
})

// Login
router.post('/login',(req, res, next) => {
  
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Handle user requests
// Accept request
router.post('/accept',(req, res, next)=>{

    User.updateOne({role:"basic",email:req.body.link},  
    {checked:true}, function (err, docs) { 
    
    if (err){ 
        console.log(err) ;
        return err;
    } 
    else{ 
        console.log("Updated Docs : ", docs); 
        
        req.flash('success_msg', 'User has been successfully checked by admin');
        return res.redirect('back');
    } 
});
});

// Decline request
router.post('/decline',(req, res, next)=>{
    
    User.deleteOne({email:req.body.link}, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    req.flash('success_msg','User has successfully been removed from database');
    return res.redirect("back");
  });
})


// User sends mail
router.post('/contact', (req, res) => {
    const { subject, email, text } = req.body;
    console.log('Data: ', req.body);

    userSendMail(email, subject, text, function(err, data) {
        if (err) {
            console.log('ERROR: ', err);
            return res.status(500).json({ message: err.message || 'Internal Error' });
        }
        console.log('Email sent!');
        return res.json({ message: 'Email sent!' });
    });
});	
// Admin sends mail
router.post('/notifyStudents',(req,res)=>{
    const {subject,text} =req.body;
    console.log('Data: ',req.body);
    adminSendMail(subject, text, function(err, data){
        if(err){
            console.log('ERROR: ', err);
            return res.status(500).json({ message: err.message || 'Internal Error '});
        }
        console.log('Email sent!');
        
        return res.json({ message: 'Email sent!' });
    })
    res.redirect('back');
})

/*router.post('/verify',(req,res)=>{
    const{ name,email,password,password2,graddep,diplomaProject,msc1,msc2,msc3,exp1,exp2,exp3,activityArea,phoneNumber,CV}=req.body;
    User.updateOne({role:"basic",email:email},  
    {email_verified:true}, function (err, docs) { 
    
    if (err){ 
        console.log(err) ;
        return err;
    } 
    else{ 
        console.log("Updated Docs : ", docs); 
        
        req.flash('success_msg', 'User has been successfully checked by admin');
        return res.redirect('/users/login');
    } 
});
    
})*/

module.exports=router;