const nodemailer = require("nodemailer");
const mainOptions = require("./sms.nodemailer");

let sendMail = (email, verifyLink) => {
    let transporter = nodemailer.createTransport({
        // config mail server
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "hostmail101@gmail.com",
            pass: process.env.HOSTMAIL_PASS,
        },
        // logger: true,
        // debug: true,
        secureConnection: false,
        ignoreTLS: true,
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    transporter.sendMail(
        mainOptions.registerAccount(email, verifyLink),
        function (err, info) {
            if (err) {
                console.log(err);
                //req.flash("mess", "Lỗi gửi mail: " + err); //Gửi thông báo đến người dùng
                // res.redirect("/login");
            } else {
                console.log("Message sent: " + info.response);
                //req.flash("mess", "Một email đã được gửi đến tài khoản của bạn"); //Gửi thông báo đến người dùng
                // res.redirect("/login");
            }
        }
    );
};

module.exports = sendMail;
