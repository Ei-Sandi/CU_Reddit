const model = require('../models/post-model');
const fs = require('fs/promises');
const path = require('path');

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
        const imageURL = body.imageURL || null;
        const result = await model.createNewPost(userID, body.content, imageURL);
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
            ctx.status = 200;
            ctx.body = { message: `Post with id ${postID} updated.` };
        } else {
            ctx.status = 400;
            ctx.body = { error: "Post could not be updated." };
        }

    } catch (err) {
        console.error("Error occured while editing post.", err);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error." };
    }
}

async function deletePost(ctx) {
    const postID = ctx.params.post_id;
    const post = ctx.state.post;

    try {
        if (post.image_url) {
            try {
                const filename = post.image_url.split('/').pop();
                const imagePath = path.join(process.cwd(), 'uploads', filename);
                await fs.unlink(imagePath);
            } catch (fsErr) {
                console.error("Failed to delete physical image file:", fsErr);
            }
        }

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

module.exports = {
    getAllPosts,
    getPostByUserID,
    createNewPost,
    editPost,
    deletePost
};
