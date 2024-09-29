

const nodemailer = require('nodemailer');

const sendBulkEmails = async (emails, subject, body, user) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: user.smtpUser,
            pass: user.smtpPass, // Ensure this is hashed/encrypted in the User model for security
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const emailPromises = emails.map(email => {
        return transporter.sendMail({
            from: `"Your App" <${user.smtpUser}>`,
            to: email,
            subject,
            text: body
        });
    });

    await Promise.all(emailPromises);
};

module.exports = { sendBulkEmails };
