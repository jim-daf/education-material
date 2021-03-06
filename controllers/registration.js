const bcrypt=require("bcryptjs");
const express = require('express');
const app=express();
const {verification}=require("../controllers/emailVerification");
// Mongo URI
const db=require('../config/keys').MongoURI;

// User model
const User=require("../models/User")

module.exports={
    registration:function(req,res){
        function getEmail(){
            return req.body.email;
        }
        module.exports.getEmail = getEmail;

        const{ name,email,password,password2,graddep,diplomaProject,msc1,msc2,msc3,exp1,exp2,exp3,activityArea,phoneNumber}=req.body;
    
        
    
        let errors=[]
    
        //check required fields
        if(!name || !email || !password || !password2 || !graddep){
            errors.push({msg:"Please fill all required fields"})
            
        }
        if(password!==password2){
            errors.push({msg:"Passwords do not match"})
            
        }
        if(password.length<6){
            errors.push({msg:"Password must be at least 6 characters"})
            
        }
        if(errors.length>0){
            res.render("register",{
                errors,
                name,
                email,
                password,
                password2,
                graddep,
                diplomaProject,
                msc1,
                msc2,
                msc3,
                exp1,
                exp2,
                exp3,
                activityArea,
                phoneNumber
            })
            
        }else{
            User.findOne({email:email})
                .then(user => {
                    // Check if user exists
                    if(user){
                        errors.push({msg:'Email is already registered'})
                        res.render("register",{
                        errors,
                        name,
                        email,
                        password,
                        password2,
                        graddep,
                        diplomaProject,
                        msc1,
                        msc2,
                        msc3,
                        exp1,
                        exp2,
                        exp3,
                        activityArea,
                        phoneNumber
                    })
                    
                    }else{
                        // Create new user
                        const newUser=new User({
                            ??????????????????????????:name,
                            email,
                            password,
                            ??????????_??????????????????????:graddep,
                            ????????????_????????????????????????_????????????????:diplomaProject,
                            ??????????????????????????_????????????_1:msc1,
                            ??????????????????????????_????????????_2:msc2,
                            ??????????????????????????_????????????_3:msc3,
                            ??????????????????_????????????????_1:exp1,
                            ??????????????????_????????????????_2:exp2,
                            ??????????????????_????????????????_3:exp3,
                            ??????????????_????????????????????????????????:activityArea,
                            ????????????????:phoneNumber
                        });
                        
                        //Hash Password
                        bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err){
                                throw err;
                            }
                            
                            //Set password to hashed
                            newUser.password=hash;
                            //Save user
                            newUser.save()
                                .then(user=>{
                                    console.log('User saved to database')
                                    
                                })
                                .catch(err=>console.log(err));
                        }))
                        
                        verification(req,res,email)
                        res.redirect('/users/uploadFile')
                    }
                })
        }
    }
}
