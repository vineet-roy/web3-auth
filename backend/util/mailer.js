const nodemailer = require("nodemailer");

const sendMail = async (email, info) => {
    try {
        let transporter = await nodemailer.createTransport({
            // host: "smtp.ethereal.email",
            // port: 587,
            // secure: false, // true for 465, false for other ports
            service: 'gmail',
            auth: {
                user: process.env.MAILEREMAIL, // TODO: your gmail account
                pass: process.env.MAILERPASSWORD // TODO: your gmail password
            }
        });

        let datails = await transporter.sendMail(info);
        return datails;

    } catch (error) {
        throw Error(error);
    }
}

module.exports = {
    sendMail
}