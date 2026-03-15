const passport = require('koa-passport');
const localAuth = require('../strategies/local');

passport.use(localAuth);

module.exports = passport.authenticate(['local'], { session: false });
