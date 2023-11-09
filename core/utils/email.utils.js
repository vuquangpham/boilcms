const nodemailer = require('nodemailer');

/**
 * Mail transporter for sending email with nodemailer
 * */
const mailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});


/**
 * Default mail information
 * */
const defaultInformation = {
    from: process.env.EMAIL_ADDRESS,
    to: '',
    subject: 'BoilCMS Subject',
    text: ''
};


/**
 * Sending email
 * @param information {Object}
 * @return {Promise}
 * */
const sendEmail = (information) => {
    const validateInformation = {...defaultInformation, ...information};
    return mailTransporter.sendMail(validateInformation);
};

module.exports = {sendEmail};