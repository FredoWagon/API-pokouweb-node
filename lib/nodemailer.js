const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const fs = require('fs');
const ejs = require('ejs')
require('dotenv').config({ path: '.env' });



const mail = async (object) => {
    try {
        console.log('lobjet dans le mail')
        const clientData = object
        console.log(object)



        const transporter = nodemailer.createTransport(smtpTransport({
            port: 587,
            host: 'mail.infomaniak.com',
            secure: false,
            auth: {
                user: process.env.SENDER_MAIL,
                pass: process.env.SENDER_MAIL_PASSWORD
            }
        }));

        const htmlTemplate = await ejs.renderFile(process.cwd() + "/views/simpleEmail.ejs")

        const mailData = {
            from: `PokoùWeb | Agence digitale <${process.env.SENDER_MAIL}>`,  // sender address
            to: `${clientData.email}`,   // list of receivers
            subject: `coucouille`,
            text: `\n
Nous avons créé un site internet pour notre recherche d'appartement
afin de nous présenter et vous permettre de consulter notre dossier. \n
 \n
 En attendant d'avoir de vos nouvelles,
 nous vous souhaitons une belle journée ! \n
 Fred & Barbara`,
            html: htmlTemplate
        };
        transporter.sendMail(mailData, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    } catch (error) {
        console.log(error)
    }
}


module.exports = { mail };
