const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');
const auth = require('../controllers/auth');
const jwt = require('jsonwebtoken');
const { JWT_SECRETKEY } = require('../config');

const { validateUserRegistration, validateUserLogin } = require('../controllers/validation');

const prefix = '/api/v1/users';
const router = new Router({ prefix: prefix });

router.post('/register/', bodyParser(), validateUserRegistration, registerUser);
router.post('/login/', bodyParser(), validateUserLogin, auth.requireLocal, loginUser);
router.del('/:id', auth.requireJWT, deleteUser);

async function registerUser(ctx) {
    const body = ctx.request.body;

    if (body.password !== body.retypePassword) {
        ctx.status = 400;
        ctx.body = { error: "Passwords do not match." };
        return;
    }

    try {
        const result = await model.createNewUser(body);
        if (result.affectedRows) {
            const id = result.insertId;
            ctx.status = 201;
            ctx.body = { ID: id, created: true, link: `${ctx.request.path}/${id}` };
        }

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            ctx.status = 409;
            ctx.body = { message: "Username or Email already exists." };
        } else {
            console.error("Registration Error:", err);
            ctx.status = 500;
            ctx.body = { error: "Internal Server Error" };
        }
    }
}

async function loginUser(ctx) {
    const user = ctx.state.user;

    if (!user) {
        ctx.status = 401;
        ctx.body = { error: "Invalid email or password." };
        return;
    }

    const payload = {
        ID: user.id,
        username: user.username,
        role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRETKEY, { expiresIn: '1h' });

    ctx.status = 200;
    ctx.body = {
        message: "Login successful",
        token: token,
        user: payload
    };
}

async function deleteUser(ctx) {
    const userID = ctx.params.id;
    try {
        const result = await model.deleteUser(userID);
        if (result.affectedRows) {
            ctx.status = 200;
            ctx.body = { message: "User Account Deleted." };
        } else {
            ctx.status = 404;
            ctx.body = { error: "User not found." };
        }

    } catch (err) {
        console.error("Delete Error:", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." };
    }
}

module.exports = router;
