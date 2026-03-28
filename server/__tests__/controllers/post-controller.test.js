const postController = require('../../src/controllers/post-controller');
const postModel = require('../../src/models/post-model');
const fs = require('fs/promises');
const path = require('path');

jest.mock('../../src/models/post-model');
jest.mock('fs/promises');

describe('Post Controller (Unit)', () => {
    let ctx;
    beforeEach(() => {
        ctx = { 
            params: {}, 
            query: {},
            request: { body: {} }, 
            state: { user: { id: 1 }, post: undefined }, 
            status: undefined, 
            body: undefined 
        };
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    describe('getAllPosts', () => {
        it('should get all posts', async () => {
            const mockPosts = [{ id: 1, content: 'Post 1' }];
            postModel.getAllPosts.mockResolvedValue(mockPosts);
            
            await postController.getAllPosts(ctx);
            
            expect(ctx.body).toEqual(mockPosts);
            expect(postModel.getAllPosts).toHaveBeenCalledWith(5, 0);
        });

        it('should get all posts with limits and pagination', async () => {
            ctx.query = { limit: '10', page: '2' };
            const mockPosts = [{ id: 1, content: 'Post 1' }];
            postModel.getAllPosts.mockResolvedValue(mockPosts);
            
            await postController.getAllPosts(ctx);
            
            expect(ctx.body).toEqual(mockPosts);
            expect(postModel.getAllPosts).toHaveBeenCalledWith(10, 10);
        });
    });

    describe('getPostByUserID', () => {
        it('should get post by user id', async () => {
            ctx.params.user_id = 1;
            const mockPosts = [{ id: 1, content: 'Post 1', user_id: 1 }];
            postModel.getPostByUserID.mockResolvedValue(mockPosts);

            await postController.getPostByUserID(ctx);

            expect(ctx.body).toEqual(mockPosts);
            expect(postModel.getPostByUserID).toHaveBeenCalledWith(1, 5, 0);
        });
    });

    describe('createNewPost', () => {
        it('should create a new post with content and no image URL', async () => {
            ctx.request.body = { content: 'Content' };
            postModel.createNewPost.mockResolvedValue({ affectedRows: 1, insertId: 1 });
            
            await postController.createNewPost(ctx);
            
            expect(postModel.createNewPost).toHaveBeenCalledWith(1, 'Content', null);
            expect(ctx.status).toBe(201);
            expect(ctx.body).toEqual({ message: "Post created for user 1" });
        });

        it('should create a new post with image URL', async () => {
            ctx.request.body = { content: 'Content', imageURL: 'http://image.jpg' };
            postModel.createNewPost.mockResolvedValue({ affectedRows: 1, insertId: 1 });

            await postController.createNewPost(ctx);

            expect(postModel.createNewPost).toHaveBeenCalledWith(1, 'Content', 'http://image.jpg');
            expect(ctx.status).toBe(201);
        });

        it('should return 400 if no content is provided', async () => {
            ctx.request.body = {};

            await postController.createNewPost(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: "Content required to create post." });
            expect(postModel.createNewPost).not.toHaveBeenCalled();
        });

        it('should return 500 on database error', async () => {
            ctx.request.body = { content: 'Content' };
            postModel.createNewPost.mockRejectedValue(new Error('DB Error'));

            await postController.createNewPost(ctx);

            expect(ctx.status).toBe(500);
            expect(ctx.body).toEqual({ error: "Internal Server Error." });
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('editPost', () => {
        it('should edit a post successfully', async () => {
            ctx.params.post_id = 2;
            ctx.request.body = { content: 'New Content' };
            postModel.updatePost.mockResolvedValue({ affectedRows: 1 });

            await postController.editPost(ctx);

            expect(postModel.updatePost).toHaveBeenCalledWith(2, 'New Content');
            expect(ctx.status).toBe(200);
            expect(ctx.body).toEqual({ message: "Post with id 2 updated." });
        });

        it('should return 400 if no content is provided', async () => {
            ctx.params.post_id = 2;
            ctx.request.body = {};

            await postController.editPost(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: "Content required to update post." });
            expect(postModel.updatePost).not.toHaveBeenCalled();
        });

        it('should return 400 if post could not be updated', async () => {
            ctx.params.post_id = 2;
            ctx.request.body = { content: 'New Content' };
            postModel.updatePost.mockResolvedValue({ affectedRows: 0 });

            await postController.editPost(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: "Post could not be updated." });
        });

        it('should return 500 on database error', async () => {
            ctx.params.post_id = 2;
            ctx.request.body = { content: 'New Content' };
            postModel.updatePost.mockRejectedValue(new Error('DB Error'));

            await postController.editPost(ctx);

            expect(ctx.status).toBe(500);
            expect(ctx.body).toEqual({ error: "Internal Server Error." });
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('deletePost', () => {
        it('should delete a post and its image', async () => {
            ctx.params.post_id = 1;
            ctx.state.post = { id: 1, image_url: '/uploads/test.jpg' };
            fs.unlink.mockResolvedValue();
            postModel.deletePost.mockResolvedValue({ affectedRows: 1 });
            
            await postController.deletePost(ctx);
            
            expect(fs.unlink).toHaveBeenCalledWith(expect.stringContaining('test.jpg'));
            expect(postModel.deletePost).toHaveBeenCalledWith(1);
            expect(ctx.status).toBe(200);
            expect(ctx.body).toEqual({ message: "Post deleted." });
        });

        it('should delete post even if image deletion fails', async () => {
            ctx.params.post_id = 1;
            ctx.state.post = { id: 1, image_url: '/uploads/test.jpg' };
            fs.unlink.mockRejectedValue(new Error('File not found'));
            postModel.deletePost.mockResolvedValue({ affectedRows: 1 });

            await postController.deletePost(ctx);

            expect(console.error).toHaveBeenCalledWith("Failed to delete physical image file:", expect.any(Error));
            expect(postModel.deletePost).toHaveBeenCalledWith(1);
            expect(ctx.status).toBe(200);
        });

        it('should delete post with no image', async () => {
            ctx.params.post_id = 1;
            ctx.state.post = { id: 1, image_url: null };
            postModel.deletePost.mockResolvedValue({ affectedRows: 1 });

            await postController.deletePost(ctx);

            expect(fs.unlink).not.toHaveBeenCalled();
            expect(postModel.deletePost).toHaveBeenCalledWith(1);
            expect(ctx.status).toBe(200);
        });

        it('should return 400 if post not found during deletion', async () => {
            ctx.params.post_id = 1;
            ctx.state.post = { id: 1 };
            postModel.deletePost.mockResolvedValue({ affectedRows: 0 });

            await postController.deletePost(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: "Post not found." });
        });

        it('should return 500 on database error during deletion', async () => {
            ctx.params.post_id = 1;
            ctx.state.post = { id: 1 };
            postModel.deletePost.mockRejectedValue(new Error('DB Error'));

            await postController.deletePost(ctx);

            expect(ctx.status).toBe(500);
            expect(ctx.body).toEqual({ error: "Internal Server Error." });
            expect(console.error).toHaveBeenCalled();
        });
    });
});
