const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'finalprojectreactnode@gmail.com',
        pass: process.env.PASSWORD
    }
});

async function signupUser(req, res) {
    let userEmail = req.body.email;
    req.body["password"] = crypto.createHash('sha256').update(req.body["password"]).digest('hex');


    try {
        const emailExist = await User.find({ email: userEmail }).exec();
        if (emailExist.length > 0) {
            throw "This email already exists in database. ";

        }
    } catch (error) {
        console.log(error)
        res.json({ error: error });

    }

    const file = req.files;
    if (file === false || !file || typeof file === "undefined") {
        let filePath = "";
        req.body.avatar = filePath;
        let newUser = req.body;
        try {
            const user = await User.create(newUser);

            res.status(201).json(user);

        } catch (error) {
            console.log(error);
            res.json({ error: error });

        }

        var mailOptions = {
            from: 'finalprojectreactnode@gmail.com',
            to: req.body.email,
            subject: 'Successfully registered',
            text: 'You registered successfully to our webshop. Please login and enjoy. Kind regards from our team'
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } else {
        let file = req.files.avatar;
        let fileName = Date.now() + req.files.avatar.name;
        file.mv('./uploads/' + fileName, (err) => {
            if (err) {
                console.log(err);
            } else {
                async function uploadAvatar() {
                    let filePath = __dirname + "/uploads/" + fileName;
                    req.body.avatar = filePath;
                    let newUser = req.body;
                    try {
                        const user = await User.create(newUser);
                        sendMail();
                        res.status(201).json(user);


                    } catch (error) {
                        console.log(error);
                        res.json({ error: error });

                    }
                }


                uploadAvatar();

                var mailOptions = {
                    from: 'finalprojectreactnode@gmail.com',
                    to: req.body.email,
                    subject: 'Successfully registered',
                    text: 'You registered successfully to our webshop. Please login and enjoy. Kind regards from our team'
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });


            }
        })
    }

}


module.exports = {
    signupUser
}