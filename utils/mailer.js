const mailer = require('nodemailer');
require('dotenv').config();



async function sendToken(user, token) {

    const transporter = mailer.createTransport({
        service: 'gmail', // You can use any email service provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });
    const mailOptions = {
        from: `Favorite Vault <${process.env.EMAIL_USER}>`,
        to: user,
        subject: 'Password Reset',
        text: `Please use the following token to reset your password: ${token}`,
        html: `<p>Please use the following token to reset your password: <strong>${token}</strong></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent.');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

sendToken('ergordosesi@gmail.com','789101');