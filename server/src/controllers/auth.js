const passport = require('koa-passport');
const basicAuth = require('../strategies/basic-strategy');
const jwtAuth = require('../strategies/jwt-strategy');

passport.use(basicAuth);
passport.use(jwtAuth);

module.exports = {
    requireBasic: passport.authenticate(['basic'], { session: false }),
    requireJWT: passport.authenticate(['jwt'], { session: false })
};
