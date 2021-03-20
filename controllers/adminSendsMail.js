const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')

const sendMails = (subject, text) => {
    const msg={
          personalizations: [
          {
            to: [
              {
                "email": "ece19032@go.uop.gr"
              }
            ],
            
          },
          {
            to: [
              {
                "email": "jimdaf11@gmail.com"
              }
            ],
            
          }
        ],
        from: 'jimitrakis11@gmail.com',
        subject: subject,
        text: text
    
    }
    
    sgMail.send(msg, function(err,info){
        if(err){
            console.log("email not sent")
        }else{
            console.log("Email sent")
        }
    });
}

module.exports= sendMails;


