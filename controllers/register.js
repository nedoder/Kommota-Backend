const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const fs = require("fs");
const readline = require('readline');
const { google } = require('googleapis');
const path = require("path");

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const key = require('../auth.json')
const auth = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES)


const drive = google.drive({ version: "v3", auth });



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'finalprojectreactnode@gmail.com',
        pass: 'finalProject123'
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
        let filePath = "https://drive.google.com/file/d/1_-9zTrlAg_0CQoVn4tuU3ii9g75LibfG/view?usp=drivesdk";
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
                    let uploadPath = path.join(__dirname, "../", "/uploads/", fileName);
                    console.log(uploadPath);
                    var fileMetadata = {
                        'name': fileName,
                        'parents': ['1gHN9y7QD0r7U9wsMu5DsmEl43HCvJm_5']
                    };
                    var media = {
                        mimeType: 'image/jpeg',
                        body: fs.createReadStream(uploadPath)
                    };
                    let filePath = __dirname + "/uploads/" + fileName;

                    drive.files.create({

                        resource: fileMetadata,
                        media: media,
                        fields: '*'
                    }, async function(err, response) {
                        if (err) {
                            // Handle error
                            console.error(err);
                        } else {
                            console.log('File Id: ', response.data.webViewLink);
                            req.body.avatar = response.data.webViewLink;
                            let newUser = req.body;
                            try {
                                const user = await User.create(newUser);
                                res.status(201).json(user);


                            } catch (error) {
                                console.log(error);
                                res.json({ error: error });

                            }
                        }
                    });



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