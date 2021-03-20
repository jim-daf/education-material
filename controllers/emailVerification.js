const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('Insert your sendgrid Api Key')
const express = require('express')
const uploadFile=require("../controllers/uploadFilesToMongo");

// Send verification email
module.exports={
verification: function(req, res,email){
    var rand,host,link;
    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand;
    const msg={
        from: 'jimitrakis11@gmail.com',
        to : email,
        subject : "Confirm your Email account",
        html : "Hello,<br> Please click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
        
    sgMail.send(msg)
    
}
}
    


