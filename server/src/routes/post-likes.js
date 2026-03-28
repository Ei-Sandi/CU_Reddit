const Router = require('koa-router');

const model = require('../models/post_likes');

const auth = require('../controllers/auth');

const can = require('../permissions/likes')

const prefix = '/api/v1/post_likes';
const router = new Router({ prefix: prefix });

router.get('/:post_id/is_liked', auth.requireJWT, isPostLiked);
router.post('/:post_id', auth.requireJWT, createPostLike);
router.del('/:post_id', auth.requireJWT, deletePostLike);

async function createPostLike(ctx) {
    const postID = ctx.params.post_id;
    const userID = ctx.state.user.id;
    try {
        const result = await model.createPostLike(postID, userID);
        if (result.affectedRows) {
            ctx.status = 201;
            ctx.body = { message: `${userID} likes the post ${postID}` };
        }

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            ctx.status = 409;
            ctx.body = { message: `Post id ${postID} has already been liked by user id ${userID}` };
        } else {
            console.error("Error occured while liking the post: ", err);
            ctx.status = 500;
            ctx.body = { error: "Internal Server Error." }
        }
    }
}

async function isPostLiked(ctx) {
    const postID = ctx.params.post_id;
    const userID = ctx.state.user.id;
    try {
        const result = await model.getPostLike(postID, userID);
        if (result) {
            ctx.status = 200;
            ctx.body = { liked: true };
        } else {
            ctx.status = 200;
            ctx.body = { liked: false };
        }
    } catch (err) {        
        console.error("Error occured while checking post like: ", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." }
    }
}

async function deletePostLike(ctx) {
    const postID = ctx.params.post_id;
    const userID = ctx.state.user.id;

    const postLike = await model.getPostLike(postID, userID);
    if (!postLike) {
        ctx.status = 404;
        ctx.body = { error: "Like not found." };
        return; 
    }

    const permission = can.delete(ctx.state.user, postLike);

    if (!permission.granted) {
        ctx.status = 403; 
        ctx.body = { error: "You do not own this post." };
        return;
    }

    try {
        const result = await model.deletePostLike(postID, userID);
        if (result.affectedRows) {
            ctx.status = 200;
            ctx.body = { message: "Like removed." };
        } else {
            ctx.status = 400;
            ctx.body = { error: "Like not found." };
        }
    } catch (err) {
        console.error("Error removing like: ", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." };
    }
}

module.exports = router;
