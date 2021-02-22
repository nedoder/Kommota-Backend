const User = require('../models/user');
const { google } = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const key = require('../auth.json');
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);

function isAdmin(req, res, next) {
    const role = req.body.role;
    if (role === 1) {
        next();
    } else {
        res.json({ error: "Nemate pristup ovoj stranici." });
    }
}

async function getData() {
    const response = await jwt.authorize()
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + 237886533,
        'start-date': '30daysAgo',
        'end-date': 'today',
        'metrics': 'ga:pageviews'
    })

    console.dir(result)
}

getData();

module.exports = {
    isAdmin,
    getData
}