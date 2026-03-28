const model = require('../models/comment-like-model');

async function getCommentLikes(ctx) {
    const commentID = ctx.params.comment_id;
    ctx.body = String(await model.countCommentLikes(commentID));
}

async function isCommentLiked(ctx) {
    const commentID = ctx.params.comment_id;
    const userID = ctx.state.user.id;
    try {
        const result = await model.getCommentLike(commentID, userID);
        if (result) {
            ctx.status = 200;
            ctx.body = { liked: true };
        } else {
            ctx.status = 200;
            ctx.body = { liked: false };
        }
    } catch (err) {
        console.error("Error occured while checking comment like: ", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." }
    }
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

module.exports = {
    getCommentLikes,
    isCommentLiked,
    createCommentLike,
    deleteCommentLike
};
