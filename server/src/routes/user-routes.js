const Router = require('koa-router');
const auth = require('../controllers/auth');
const { validateUserRegistration, validateUsernameUpdate } = require('../controllers/validation');
const { registerUser, loginUser, changeUserName, deleteUser } = require('../controllers/user-controller');

const prefix = '/api/v1/users';
const router = new Router({ prefix: prefix });

router.post('/', validateUserRegistration, registerUser);
router.post('/login', auth.requireBasic, loginUser);
router.put('/', auth.requireJWT, validateUsernameUpdate, changeUserName);
router.del('/:id', auth.requireJWT, deleteUser);

module.exports = router;
