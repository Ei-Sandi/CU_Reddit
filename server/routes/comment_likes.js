const Router = require('koa-router');

const model = require('../models/comment_likes');

const auth = require('../controllers/auth')

const prefix = '/api/v1/comment_likes';
const router = new Router({ prefix: prefix });

router.get('/:comment_id', getCommentLikes);
router.post('/:comment_id', auth.requireJWT, createCommentLike);
router.del('/:comment_id', auth.requireJWT, deleteCommentLike);

async function getCommentLikes(ctx) {
    const commentID = ctx.params.comment_id;
    ctx.body = String(await model.countCommentLikes(commentID));
}

async function createCommentLike(ctx) {
    const commentID = ctx.params.comment_id;
    const userID = ctx.state.user.id;
    try {
        const result = await model.createCommentLike(commentID, userID);
        if (result.affectedRows) {
            ctx.status = 201;
            ctx.body = { message: `${userID} likes the comment ${commentID}` };
        }

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            ctx.status = 409;
            ctx.body = { message: `Comment id ${commentID} has already been liked by user id ${userID}` };
        } else {
            console.error("Error occured while liking the comment: ", err);
            ctx.status = 500;
            ctx.body = { error: "Internal Server Error." }
        }
    }
}

async function deleteCommentLike(ctx) {
    const commentID = ctx.params.comment_id;
    const userID = ctx.state.user.id;
    try {
        const result = await model.deleteCommentLike(commentID, userID);
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
