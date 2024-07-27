const nodemailer = require('nodemailer');

function sendEmail(recipientEmail, subject, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAILADD,
            pass: process.env.GMAILPW
        }
    });

    const mailOptions = {
        from: process.env.GMAILADD, //sender address
        to: recipientEmail,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    });
}

module.exports = sendEmail;