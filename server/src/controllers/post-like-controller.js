const model = require('../models/post-like-model');

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

module.exports = {
    createPostLike,
    isPostLiked,
    deletePostLike
};
