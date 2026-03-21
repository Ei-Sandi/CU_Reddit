const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const model = require('../models/users');

const auth = require('../controllers/auth');
const jwt = require('jsonwebtoken');
const { JWT_SECRETKEY } = require('../config');

const { validateUserRegistration, validateUsernameUpdate } = require('../controllers/validation');

const can = require('../permissions/users');

const prefix = '/api/v1/users';
const router = new Router({ prefix: prefix });

router.post('/', bodyParser(), validateUserRegistration, registerUser);
router.post('/login', auth.requireBasic, loginUser);
router.put('/', bodyParser(), auth.requireJWT, validateUsernameUpdate, changeUserName);
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
            ctx.body = { message: `Account created for user ${body.username}` };
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
        access_token: token,
        token_type: "Bearer",
        expires_in: 3600,
        user: payload
    };
}

async function changeUserName(ctx) {
    const body = ctx.request.body;

    if (!body.username) {
        ctx.status = 400;
        ctx.body = { error: "New username required to update post." };
        return;
    }

    const userID = ctx.state.user.id;
    const user = await model.getUserByID(userID);

    if (!user) {
        //This should never happen since we are getting user from ctx.state.id
        ctx.status = 404;
        ctx.body = { error: "User not found" };
        return;
    }

    const permission = can.update(ctx.state.user, user);

    if (!permission.granted) {
        ctx.status = 403; 
        ctx.body = { error: "You do not own this account." };
        return;
    }
    try {
        const result = await model.updateUserName(userID, body.username);
        if (result.affectedRows) {
            ctx.status = 200;
            ctx.body = { message: `Username for id ${userID} is changed.` };
        } else {
            ctx.status = 400;
            ctx.body = { error: "Username could not be updated." };
        }

    } catch (err) {
        console.error("Error occured while updating username.", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." };
    }
}

async function deleteUser(ctx) {
    const userID = ctx.params.id;

    const user = await model.getUserByID(userID);
    if (!user) {
        ctx.status = 404;
        ctx.body = { error: "User not found." };
        return; 
    }

    const permission = can.delete(ctx.state.user, user);
    
    if (!permission.granted) {
        ctx.status = 403; 
        ctx.body = { error: "You do not own this account." };
        return;
    }

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
