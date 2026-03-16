const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const model = require('../models/comments');

const auth = require('../controllers/auth');

const { validateCommentContent } = require('../controllers/validation');

const prefix = '/api/v1/comments';
const router = new Router({ prefix: prefix });

router.get('/:post_id', getAllComments);
router.post('/:post_id', bodyParser(), auth.requireJWT, validateCommentContent, createNewComment);
router.put('/:comment_id', bodyParser(), auth.requireJWT, validateCommentContent, editComment);
router.del('/:comment_id', auth.requireJWT, deleteComment);

async function getAllComments(ctx) {
    const postID = ctx.params.post_id;
    ctx.body = await model.getAllComments(postID);
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

// TODO: check if the user is allow to update the comment
// if the post is user's comment || if the user's role is admin ? 
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
        }

    } catch (err) {
        console.error("Error occured while editing comment.", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." };
    }
}

// TODO: check if the user is allow to delete the comment
// if the post is user's post || if the comment is user's comment || if the user's role is admin ? 
async function deleteComment(ctx) {
    const commentID = ctx.params.comment_id;
    try {
        const result = await model.deleteComment(commentID);
        if (result.affectedRows) {
            ctx.status = 200;
            ctx.body = { message: "Comment deleted." };
        }
    } catch (err) {
        console.error();
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." }
    }
}

module.exports = router
