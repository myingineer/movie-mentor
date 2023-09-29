const nodemailer = require('nodemailer');

const sendPasswordResetEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const emailOptions = {
        from: 'Movie-Mentor Support Team<support@moviementor.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(emailOptions);
};

module.exports = sendPasswordResetEmail;