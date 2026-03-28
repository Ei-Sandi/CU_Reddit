const commentCan = require('../permissions/comment-permissions');
const commentModel = require('../models/comment-model');
const postCan = require('../permissions/post-permissions');
const postModel = require('../models/post-model');
const userCan = require('../permissions/user-permissions');
const userModel = require('../models/user-model');
const likeCan = require('../permissions/like-permissions');
const commentLikeModel = require('../models/comment-like-model');
const postLikeModel = require('../models/post-like-model');

async function canUpdateComment(ctx, next) {
    const commentID = ctx.params.comment_id;
    const comment = await commentModel.getCommentByCommentID(commentID);

    if (!comment) {
        ctx.status = 404;
        ctx.body = { error: "Comment not found." };
        return;
    }

    ctx.state.comment = comment;
    const permission = commentCan.update(ctx.state.user, comment);

    if (!permission.granted) {
        ctx.status = 403;
        ctx.body = { error: "You do not own this comment." };
        return;
    }

    return next();
}

async function canDeleteComment(ctx, next) {
    const commentID = ctx.params.comment_id;
    const comment = await commentModel.getCommentByCommentID(commentID);

    if (!comment) {
        ctx.status = 404;
        ctx.body = { error: "Comment not found." };
        return;
    }

    ctx.state.comment = comment;
    const permission = commentCan.delete(ctx.state.user, comment);

    if (!permission.granted) {
        ctx.status = 403;
        ctx.body = { error: "You do not own this comment." };
        return;
    }

    return next();
}

async function canUpdatePost(ctx, next) {
    const postID = ctx.params.post_id;
    const post = await postModel.getPostByPostID(postID);

    if (!post) {
        ctx.status = 404;
        ctx.body = { error: "Post not found." };
        return;
    }

    ctx.state.post = post;
    const permission = postCan.update(ctx.state.user, post);

    if (!permission.granted) {
        ctx.status = 403;
        ctx.body = { error: "You do not own this post." };
        return;
    }

    return next();
}

async function canDeletePost(ctx, next) {
    const postID = ctx.params.post_id;
    const post = await postModel.getPostByPostID(postID);

    if (!post) {
        ctx.status = 404;
        ctx.body = { error: "Post not found." };
        return;
    }

    ctx.state.post = post;
    const permission = postCan.delete(ctx.state.user, post);

    if (!permission.granted) {
        ctx.status = 403;
        ctx.body = { error: "You do not own this post." };
        return;
    }

    return next();
}

async function canUpdateUser(ctx, next) {
    const userID = ctx.state.user.id;
    const user = await userModel.getUserByID(userID);

    if (!user) {
        ctx.status = 404;
        ctx.body = { error: "User not found." };
        return;
    }

    ctx.state.targetUser = user;
    const permission = userCan.update(ctx.state.user, user);

    if (!permission.granted) {
        ctx.status = 403;
        ctx.body = { error: "You do not have permission to update this user." };
        return;
    }

    return next();
}

async function canDeleteUser(ctx, next) {
    const userID = ctx.params.id;
    const user = await userModel.getUserByID(userID);

    if (!user) {
        ctx.status = 404;
        ctx.body = { error: "User not found." };
        return;
    }

    ctx.state.targetUser = user;
    const permission = userCan.delete(ctx.state.user, user);

    if (!permission.granted) {
        ctx.status = 403;
        ctx.body = { error: "You do not have permission to delete this user." };
        return;
    }

    return next();
}

async function canManageUsers(ctx, next) {
    if (ctx.state.user.role !== 'admin') {
        ctx.status = 403;
        ctx.body = { error: "You do not have permission to manage users." };
        return;
    }
    return next();
}

async function canDeleteCommentLike(ctx, next) {
    const commentID = ctx.params.comment_id;
    const userID = ctx.state.user.id;
    const commentLike = await commentLikeModel.getCommentLike(commentID, userID);

    if (!commentLike) {
        ctx.status = 404;
        ctx.body = { error: "Like not found." };
        return;
    }

    const permission = likeCan.delete(ctx.state.user, commentLike);

    if (!permission.granted) {
        ctx.status = 403;
        ctx.body = { error: "You do not have permission to delete this like." };
        return;
    }

    return next();
}

async function canDeletePostLike(ctx, next) {
    const postID = ctx.params.post_id;
    const userID = ctx.state.user.id;
    const postLike = await postLikeModel.getPostLike(postID, userID);

    if (!postLike) {
        ctx.status = 404;
        ctx.body = { error: "Like not found." };
        return;
    }

    const permission = likeCan.delete(ctx.state.user, postLike);

    if (!permission.granted) {
        ctx.status = 403;
        ctx.body = { error: "You do not have permission to delete this like." };
        return;
    }

    return next();
}

module.exports = {
    canUpdateComment,
    canDeleteComment,
    canUpdatePost,
    canDeletePost,
    canUpdateUser,
    canDeleteUser,
    canManageUsers,
    canDeleteCommentLike,
    canDeletePostLike
};
