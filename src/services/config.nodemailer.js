const nodemailer = require("nodemailer");
//nodemailer.setApiKey(process.env.SENDGRID_API_KEY);

let sendMail = (email) => {
  let transporter = nodemailer.createTransport({
    // config mail server
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "hostmail101@gmail.com",
      pass: process.env.HOSTMAIL_PASS,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  let sms = {
    forgotPassword: `
    <div style="padding: 10px; background-color: #003375">
        <div style="padding: 10px; background-color: white;">
            <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
            <span style="color: black">Đây là mail test</span>
        </div>
    </div>
  `,
  };

  let mainOptions = {
    from: "NQH-Test nodemailer",
    to: email,
    subject: "Test Nodemailer",
    text: "Your text is here", // replace by html
    html: sms.forgotPassword,
  };

  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err);
      //req.flash("mess", "Lỗi gửi mail: " + err); //Gửi thông báo đến người dùng
      // res.redirect("/login");
    } else {
      console.log("Message sent: " + info.response);
      //req.flash("mess", "Một email đã được gửi đến tài khoản của bạn"); //Gửi thông báo đến người dùng
      // res.redirect("/login");
    }
  });
};

module.exports = sendMail;
