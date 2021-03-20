const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('insert your sendgrid Api Key')

const sendMails = (subject, text) => {
    const msg={
          personalizations: [
          {
            to: [
              {
                "email": "insert receiver's email"
              }
            ],
            
          },
          {
            to: [
              {
                "email": "insert receiver's email"
              }
            ],
            
          }
        ],
        from: "insert sender's email",
        subject: subject,
        text: text
    
    }
    // Send email
    
    sgMail.send(msg, function(err,info){
        if(err){
            console.log("email not sent")
        }else{
            console.log("Email sent")
        }
    });
}

module.exports= sendMails;


