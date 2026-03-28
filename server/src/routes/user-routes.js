const Router = require('koa-router');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions');
const { validateUserRegistration, validateUsernameUpdate } = require('../middlewares/validation');
const { getAllUsers, registerUser, loginUser, changeUserName, deleteUser } = require('../controllers/user-controller');

const prefix = '/api/v1/users';
const router = new Router({ prefix: prefix });

router.get('/', auth.requireJWT, permissions.canManageUsers, getAllUsers);
router.post('/', validateUserRegistration, registerUser);
router.post('/login', auth.requireBasic, loginUser);
router.put('/', auth.requireJWT, permissions.canUpdateUser, validateUsernameUpdate, changeUserName);
router.del('/:id', auth.requireJWT, permissions.canDeleteUser, deleteUser);

module.exports = router;
