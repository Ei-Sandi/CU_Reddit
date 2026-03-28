const postLikesController = require('../../src/controllers/post-like-controller');
const commentLikesController = require('../../src/controllers/comment-like-controller');
const postLikeModel = require('../../src/models/post-like-model');
const commentLikeModel = require('../../src/models/comment-like-model');

jest.mock('../../src/models/post-like-model');
jest.mock('../../src/models/comment-like-model');

describe('Like Controllers (Unit)', () => {
    let ctx;
    beforeEach(() => {
        ctx = { 
            params: {}, 
            state: { user: { id: 1 } }, 
            status: undefined, 
            body: undefined 
        };
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    describe('Post Likes Controller', () => {
        describe('createPostLike', () => {
            it('should like a post', async () => {
                ctx.params.post_id = 1;
                postLikeModel.createPostLike.mockResolvedValue({ affectedRows: 1 });
                await postLikesController.createPostLike(ctx);
                expect(postLikeModel.createPostLike).toHaveBeenCalledWith(1, 1);
                expect(ctx.status).toBe(201);
                expect(ctx.body).toEqual({ message: '1 likes the post 1' });
            });

            it('should return 409 if post already liked', async () => {
                ctx.params.post_id = 1;
                const dupError = new Error('Duplicate');
                dupError.code = 'ER_DUP_ENTRY';
                postLikeModel.createPostLike.mockRejectedValue(dupError);
                await postLikesController.createPostLike(ctx);
                expect(ctx.status).toBe(409);
                expect(ctx.body).toEqual({ message: "Post id 1 has already been liked by user id 1" });
            });

            it('should return 500 on database error', async () => {
                ctx.params.post_id = 1;
                postLikeModel.createPostLike.mockRejectedValue(new Error('DB Error'));
                await postLikesController.createPostLike(ctx);
                expect(ctx.status).toBe(500);
                expect(ctx.body).toEqual({ error: "Internal Server Error." });
                expect(console.error).toHaveBeenCalled();
            });
        });

        describe('isPostLiked', () => {
            it('should return liked: true if like exists', async () => {
                ctx.params.post_id = 1;
                postLikeModel.getPostLike.mockResolvedValue({ id: 1 });
                await postLikesController.isPostLiked(ctx);
                expect(postLikeModel.getPostLike).toHaveBeenCalledWith(1, 1);
                expect(ctx.status).toBe(200);
                expect(ctx.body).toEqual({ liked: true });
            });

            it('should return liked: false if like does not exist', async () => {
                ctx.params.post_id = 1;
                postLikeModel.getPostLike.mockResolvedValue(null);
                await postLikesController.isPostLiked(ctx);
                expect(ctx.status).toBe(200);
                expect(ctx.body).toEqual({ liked: false });
            });

            it('should return 500 on error', async () => {
                ctx.params.post_id = 1;
                postLikeModel.getPostLike.mockRejectedValue(new Error('Error'));
                await postLikesController.isPostLiked(ctx);
                expect(ctx.status).toBe(500);
            });
        });

        describe('deletePostLike', () => {
            it('should delete a like', async () => {
                ctx.params.post_id = 1;
                postLikeModel.deletePostLike.mockResolvedValue({ affectedRows: 1 });
                await postLikesController.deletePostLike(ctx);
                expect(postLikeModel.deletePostLike).toHaveBeenCalledWith(1, 1);
                expect(ctx.status).toBe(200);
                expect(ctx.body).toEqual({ message: "Like removed." });
            });

            it('should return 400 if like not found', async () => {
                ctx.params.post_id = 1;
                postLikeModel.deletePostLike.mockResolvedValue({ affectedRows: 0 });
                await postLikesController.deletePostLike(ctx);
                expect(ctx.status).toBe(400);
                expect(ctx.body).toEqual({ error: "Like not found." });
            });

            it('should return 500 on database error', async () => {
                ctx.params.post_id = 1;
                postLikeModel.deletePostLike.mockRejectedValue(new Error('Error'));
                await postLikesController.deletePostLike(ctx);
                expect(ctx.status).toBe(500);
            });
        });
    });

    describe('Comment Likes Controller', () => {
        describe('createCommentLike', () => {
            it('should like a comment', async () => {
                ctx.params.comment_id = 2;
                commentLikeModel.createCommentLike.mockResolvedValue({ affectedRows: 1 });
                await commentLikesController.createCommentLike(ctx);
                expect(commentLikeModel.createCommentLike).toHaveBeenCalledWith(2, 1);
                expect(ctx.status).toBe(201);
                expect(ctx.body).toEqual({ message: '1 likes the comment 2' });
            });

            it('should return 409 if comment already liked', async () => {
                ctx.params.comment_id = 2;
                const dupError = new Error('Duplicate');
                dupError.code = 'ER_DUP_ENTRY';
                commentLikeModel.createCommentLike.mockRejectedValue(dupError);
                await commentLikesController.createCommentLike(ctx);
                expect(ctx.status).toBe(409);
                expect(ctx.body).toEqual({ message: "Comment id 2 has already been liked by user id 1" });
            });

            it('should return 500 on database error', async () => {
                ctx.params.comment_id = 2;
                commentLikeModel.createCommentLike.mockRejectedValue(new Error('DB Error'));
                await commentLikesController.createCommentLike(ctx);
                expect(ctx.status).toBe(500);
                expect(ctx.body).toEqual({ error: "Internal Server Error." });
            });
        });

        describe('isCommentLiked', () => {
            it('should return liked: true if like exists', async () => {
                ctx.params.comment_id = 2;
                commentLikeModel.getCommentLike.mockResolvedValue({ id: 1 });
                await commentLikesController.isCommentLiked(ctx);
                expect(commentLikeModel.getCommentLike).toHaveBeenCalledWith(2, 1);
                expect(ctx.status).toBe(200);
                expect(ctx.body).toEqual({ liked: true });
            });

            it('should return liked: false if like does not exist', async () => {
                ctx.params.comment_id = 2;
                commentLikeModel.getCommentLike.mockResolvedValue(null);
                await commentLikesController.isCommentLiked(ctx);
                expect(ctx.status).toBe(200);
                expect(ctx.body).toEqual({ liked: false });
            });

            it('should return 500 on error', async () => {
                ctx.params.comment_id = 2;
                commentLikeModel.getCommentLike.mockRejectedValue(new Error('Error'));
                await commentLikesController.isCommentLiked(ctx);
                expect(ctx.status).toBe(500);
            });
        });

        describe('deleteCommentLike', () => {
            it('should delete a comment like', async () => {
                ctx.params.comment_id = 2;
                commentLikeModel.deleteCommentLike.mockResolvedValue({ affectedRows: 1 });
                await commentLikesController.deleteCommentLike(ctx);
                expect(commentLikeModel.deleteCommentLike).toHaveBeenCalledWith(2, 1);
                expect(ctx.status).toBe(200);
                expect(ctx.body).toEqual({ message: "Like removed." });
            });

            it('should return 400 if comment like not found', async () => {
                ctx.params.comment_id = 2;
                commentLikeModel.deleteCommentLike.mockResolvedValue({ affectedRows: 0 });
                await commentLikesController.deleteCommentLike(ctx);
                expect(ctx.status).toBe(400);
                expect(ctx.body).toEqual({ error: "Like not found." });
            });

            it('should return 500 on database error', async () => {
                ctx.params.comment_id = 2;
                commentLikeModel.deleteCommentLike.mockRejectedValue(new Error('Error'));
                await commentLikesController.deleteCommentLike(ctx);
                expect(ctx.status).toBe(500);
            });
        });
    });
});
