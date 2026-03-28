const passport = require('koa-passport');
const basicAuth = require('../strategies/basic');
const jwtAuth = require('../strategies/jwt');

passport.use(basicAuth);
passport.use(jwtAuth);

module.exports = {
    requireBasic: passport.authenticate(['basic'], { session: false }),
    requireJWT: passport.authenticate(['jwt'], { session: false })
};
