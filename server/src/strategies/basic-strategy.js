const { BasicStrategy } = require('passport-http');
const model = require('../models/user-model');
const bcrypt = require('bcrypt');

const verifyPassword = async function (user, password) {
    return await bcrypt.compare(password, user.password);
}

const authenticateUser = async (email, password, done) => {
    let user;
    
    try {
        user = await model.getUserByEmail(email);
    } catch (err) {
        console.error("Error fetching user by email:", err);
        return done(err);
    }

    if (!user || !(await verifyPassword(user, password))) {
        return done(null, false);
    }

    delete user.password;
    return done(null, user);
}

const strategy = new BasicStrategy(authenticateUser);
module.exports = strategy;
