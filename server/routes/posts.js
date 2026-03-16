const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const model = require('../models/posts');

const auth = require('../controllers/auth');

const { validatePostContent } = require('../controllers/validation');

const prefix = '/api/v1/posts';
const router = new Router({ prefix: prefix });

router.get('/', getAllPosts);
router.get('/:user_id', getPostByUserID);
router.post('/', bodyParser(), auth.requireJWT, validatePostContent, createNewPost);
router.put('/:post_id', bodyParser(), auth.requireJWT, validatePostContent, editPost);
router.del('/:post_id', auth.requireJWT, deletePost);

async function getAllPosts(ctx) {
    ctx.body = await model.getAllPosts();
}

async function getPostByUserID(ctx) {
    const userID = ctx.params.user_id;
    ctx.body = await model.getPostByUserID(userID);
}

async function createNewPost(ctx) {
    const body = ctx.request.body;
    const userID = ctx.state.user.id;

    if (!body.content) {
        ctx.status = 400;
        ctx.body = { error: "Content required to create post." };
        return;
    }

    try {
        const result = await model.createNewPost(userID, body.content);
        if (result.affectedRows) {
            ctx.status = 201;
            ctx.body = { message: `Post created for user ${userID}` };
        }

    } catch (err) {
        console.error("Error occured while creating post.", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." };
    }

}

// TODO: check if the user is allow to update the post
// if the post is user's post || if the user's role is admin ? 
async function editPost(ctx) {
    const body = ctx.request.body;

    if (!body.content) {
        ctx.status = 400;
        ctx.body = { error: "Content required to update post." };
        return;
    }

    const postID = ctx.params.post_id;
    try {
        const result = await model.updatePost(postID, body.content);
        if (result.affectedRows) {
            ctx.status = 201;
            ctx.body = { message: `Post with id ${postID} updated.` };
        }

    } catch (err) {
        console.error("Error occured while editing post.", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." };
    }
}

// TODO: check if the user is allow to delete the post
// if the post is user's post || if the user's role is admin ? 
async function deletePost(ctx) {
    const postID = ctx.params.post_id;
    try {
        const result = await model.deletePost(postID);
        if (result.affectedRows) {
            ctx.status = 200;
            ctx.body = { message: "Post deleted." };
        } else {
            ctx.status = 400;
            ctx.body = { error: "Post not found." };
        }

    } catch (err) {
        console.error("Error deleting post: ", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." };
    }
}

module.exports = router
