const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: process.env.API_KEY ||  'key-76646de3d9cc50b097e141b833c5c8a7',
        domain: process.env.DOMAIN || 'sandbox08535a1f8f3643ab8ea3a8429eab2f2e.mailgun.org' 
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));


const sendMail = (email, subject, text, cb) => {
    const mailOptions = {
        from: email, 
        to: 'ece19032@go.uop.gr',  
        subject,
        text
        
    };
    const mailOptions2 = {
        from: email, 
        to: 'jimitrakis11@gmail.com',
        subject,
        text
    }

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
            console.log("email sent TO ece19032@go.uop.gr!")
        }
    });
}

module.exports = sendMail;