

const nodemailer = require('nodemailer');

const sendBulkEmails = async (emails, subject, body) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const emailPromises = emails.map(email => {
        return transporter.sendMail({
            from: '"Bulk Email Sender" <no-reply@example.com>',
            to: email,
            subject,
            text: body
        });
    });

    await Promise.all(emailPromises);
};

module.exports = { sendBulkEmails };
