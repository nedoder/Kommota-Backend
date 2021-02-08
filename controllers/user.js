const User = require("../models/user");

async function loginUser(req, res) {
    let userMail = req.body.email;
    let password = req.body.password;
    try {
        const user = await User.find({ email: userMail }).exec();
        if (user.length === 0) {
            throw "User does not exist in database. ";
        } else if (user.length === 1) {
            if (password === user[0].password) {
                res.status(201).json(user[0]._id);
            } else {
                throw "Invalid password. ";
            }
        }
    } catch (err) {
        console.log(err);
        res.json({ error: err });
    }

}

async function signupUser(req, res) {
    let userEmail = req.body.email;
    const newUser = req.body;
    try {
        const emailExist = await User.find({ email: userEmail }).exec();
        if (emailExist.length > 0) {
            throw "This email already exists in database. ";
        } else {
            const user = await User.create(newUser);
            res.status(201).json(user);
        }
    } catch (error) {
        console.log(error)
        res.json({ error: error });

    }
}
async function findAllUsers(req, res) {
    const users = await User.find({}).lean().exec();
    try {
        if (users.length === 0) {
            throw "There are no users in database. ";
        } else {
            res.status(201).json(users);
        }
    } catch (error) {
        console.log(error)
        res.json({ error: error });

    }
}

async function deleteUser(req, res) {
    let id = req.body.id;
    try {
        const user = await User.deleteOne({ _id: id }).exec();
        console.log(user);
        if (user.n === 0) { throw "User does not exist in db" } else {
            res.status(201).json(id);
        }
    } catch (err) {
        console.log(err)
        res.json({ error: err })
    }

}

module.exports = {
    signupUser,
    findAllUsers,
    deleteUser,
    loginUser
}