const User=require("../models/User")
const sendMail = require('../controllers/userSendsMail');
const dialog=require('dialog')
module.exports = {
  // Check if user is authenticated
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  // Check if user is logged in
  alreadyLoggedIn:function (req,res,next){
      if(!req.isAuthenticated()) return next();
      
      const{ name,email,password,password2,graddep,diplomaProject,msc1,msc2,msc3,exp1,exp2,exp3,activityArea,phoneNumber}=req.body;
      User.findOne({email:email})
            .then(user => {
                if(req.user.role=='admin'){
                    
                  return res.redirect('/adminPanel');
                  
                }else if(req.user.role=='basic'){
                  return res.redirect('/dashboard_loggedIn')
                }
                
            })
  },
  // Check if user is the admin
  checkifAdmin:function(req,res,next){
    if (req.isAuthenticated()) {
      const{ name,email,password,password2,graddep,diplomaProject,msc1,msc2,msc3,exp1,exp2,exp3,activityArea,phoneNumber}=req.body;
      User.findOne({email:email})
            .then(user => {
                if(req.user.role=='admin'){
                    
                    return next();
                }else{
                  dialog.info('Only administrator can access this page')
                  
                  return res.redirect('back');
                }
            })
    }else{
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/users/login');
    }
    
    
  },
  // Check if Admin has accepted user
  checkIfAccepted:function(req,res,next){
    const{ name,email,password,password2,graddep,diplomaProject,msc1,msc2,msc3,exp1,exp2,exp3,activityArea,phoneNumber}=req.body;
    User.findOne({email:email})
            .then(user => {
                if(req.user.checked==true || req.user.role=="admin"){
                    
                    return next();
                }else{
                  dialog.info('Please wait for the admin to give you access to all the pages')
                  
                  return res.redirect('back');
                }
            })
  },
  // Check if user's email is verified
  ensureEmailVerified:function(req,res,next){
    
    User.findOne({email:req.body.email})
            .then(user => {
                if(req.user.role=="admin" || req.user.email_verified==true){
                    return next();
                }else{
                  
                  req.logout();
                  req.flash('error_msg', 'Please verify your email account');
                  res.redirect('/users/login');
                  
                }
            })
  }
};