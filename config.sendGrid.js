const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "anhquoc1104@gmail.com",
  from: "anhquoc1104@gmail.com",
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>"
};
let sendMail = sgMail
  .send(msg)
  .then(() => {
    // Celebrate
    console.log("Success!!");
  })
  .catch(error => {
    // Log friendly error
    console.error(error);
    console.log("ERROR!!!");
    if (error.response) {
      // Extract error msg
      const { message, code, response } = error;
      // Extract response msg
      const { headers, body } = response;
      console.error(body);
    }
  });

module.exports = sendMail;
