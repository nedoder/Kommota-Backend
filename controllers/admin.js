const User = require('../models/user');
const { google } = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const key = require('../auth.json');
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);

function isAdmin(req, res, next) {
    const role = req.body.role;
    if (role === true) {
        next();
    } else {
        res.json({ error: "Nemate pristup ovoj stranici." });
    }
}



module.exports = {
    isAdmin
}