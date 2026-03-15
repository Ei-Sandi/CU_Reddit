const passport = require('koa-passport');
const localAuth = require('../strategies/local');
const jwtAuth = require('../strategies/jwt');

passport.use(localAuth);
passport.use(jwtAuth);

module.exports = {
    requireLocal: passport.authenticate(['local'], { session: false }),
    requireJWT: passport.authenticate(['jwt'], { session: false })
};
