const model = require('../models/comment-model');

async function getAllCommentsOfAPost(ctx) {
    const postID = ctx.params.post_id;
    ctx.body = await model.getAllCommentsOfAPost(postID);
}

async function createNewComment(ctx) {
    const body = ctx.request.body;
    if (!body.content) {
        ctx.status = 400;
        ctx.body = { error: "Content required to create comment." };
        return;
    }

    const userID = ctx.state.user.id;
    const postID = ctx.params.post_id;
    try {
        const result = await model.createNewComment(userID, postID, body.content);
        if (result.affectedRows) {
            ctx.status = 201;
            ctx.body = { message: `Comment created for ${postID} by ${userID}` };
        }

    } catch (err) {
        console.error("Error occured while creating comment.", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." };
    }
}

async function editComment(ctx) {
    const body = ctx.request.body;
    if (!body.content) {
        ctx.status = 400;
        ctx.body = { error: "Content required to edit comment." };
        return;
    }

    const commentID = ctx.params.comment_id;

    try {
        const result = await model.updateComment(commentID, body.content);
        if (result.affectedRows) {
            ctx.status = 201;
            ctx.body = { message: `Comment edited for ${commentID}` };
        } else {
            ctx.status = 400;
            ctx.body = { error: "Post could not be updated." };
        }

    } catch (err) {
        console.error("Error occured while editing comment.", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." };
    }
}

// TODO: let the post owner delete any comment on his post
async function deleteComment(ctx) {
    const commentID = ctx.params.comment_id;

    try {
        const result = await model.deleteComment(commentID);
        if (result.affectedRows) {
            ctx.status = 200;
            ctx.body = { message: "Comment deleted." };
        } else {
            ctx.status = 400;
            ctx.body = { error: "Comment not found." };
        }
    } catch (err) {
        console.error("Error deleting comment: ", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." }
    }
}

module.exports = {
    getAllCommentsOfAPost,
    createNewComment,
    editComment,
    deleteComment
};
