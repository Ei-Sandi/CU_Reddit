const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const model = require('../models/user-model'); 
const { JWT_SECRETKEY } = require('../../config');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRETKEY
};

const checkJwtPayload = async (jwt_payload, done) => {
    try {
        const user = await model.getUserByID(jwt_payload.ID);
        if (user) {
            return done(null, user);
        } else {
            console.log("JWT matched, but user no longer exists in DB.");
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
};

module.exports = new JwtStrategy(opts, checkJwtPayload);
