const cart = require("./shoppingCart");
const nodemailer = require("nodemailer");
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'finalprojectreactnode@gmail.com',
        pass: 'finalProject123'
    }
});

const checkout = async function(req, res) {

    var mailOptions = {
        from: 'finalprojectreactnode@gmail.com',
        to: req.body.email,
        subject: 'Uspješna narudžbina',
        text: 'Uspješno ste poručili proizvode sa našeg webshop-a. Za dostavu i plaćanje ćete biti kontaktirani od strane kurira. Srdačan pozdrav od našeg tima.'
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email poslat: ' + info.response);
        }
    });

};

module.exports = {
    checkout
}