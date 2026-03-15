const LocalStrategy = require('passport-local').Strategy;
const model = require('../models/users');
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

    return done(null, user);
}

// LocalStrategy by default uses username, overriding to use email here.
const options = { usernameField: 'email' };
const strategy = new LocalStrategy(options, authenticateUser);
module.exports = strategy;
