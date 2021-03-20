const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

// Authenticate sender's email
const auth = {
    auth: {
        api_key: process.env.API_KEY ||  'insert your mailgun api key',
        domain: process.env.DOMAIN || 'insert your mailgun domain' 
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));


const sendMail = (email, subject, text, cb) => {
    const mailOptions = {
        from: email, 
        to: "receiver's email",  
        subject,
        text
        
    };
    const mailOptions2 = {
        from: email, 
        to: "receiver's email",
        subject,
        text
    }
    //Send email
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, data);
    });
    transporter.sendMail(mailOptions2, function (err, data) {
        if (err){
            return err
        }
        else{
            console.log("email sent TO receiver's email!")
        }
    });
}

module.exports = sendMail;
