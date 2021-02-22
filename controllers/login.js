const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

//checking if user exists in database and generating token
async function logIn(req, res) {
    let userMail = req.body.email;
    let password = crypto.createHash('sha256').update(req.body["password"]).digest('hex');
    try {
        const user = await User.find({ email: userMail }).exec();
        if (user.length === 0) {
            throw "User does not exist in database. ";
        } else if (user.length === 1) {
            if (password === user[0].password) {
                jwt.sign({ user }, "lalal", { expiresIn: "1h" }, (err, token) => {
                    res.json({ token, user });
                });
            } else {
                throw "Invalid password. ";
            }

        } else {
            res.status(401).json("Wrong username or password");
        }
    } catch (err) {
        res.status(401).json("Authentication failed");
    }
}

//verify token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403).json({ "error": "Authentication failed!" });;
    }

}

module.exports = {
    verifyToken,
    logIn
}