const commentController = require('../../src/controllers/comment-controller');
const commentModel = require('../../src/models/comment-model');

jest.mock('../../src/models/comment-model');

describe('Comment Controller (Unit)', () => {
    let ctx;
    beforeEach(() => {
        ctx = { 
            params: {}, 
            request: { body: {} }, 
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

    describe('getAllCommentsOfAPost', () => {
        it('should get all comments for a post', async () => {
            ctx.params.post_id = 1;
            const mockComments = [{ id: 1, content: 'Test' }];
            commentModel.getAllCommentsOfAPost.mockResolvedValue(mockComments);
            
            await commentController.getAllCommentsOfAPost(ctx);
            
            expect(commentModel.getAllCommentsOfAPost).toHaveBeenCalledWith(1);
            expect(ctx.body).toEqual(mockComments);
        });
    });

    describe('createNewComment', () => {
        it('should create a new comment successfully', async () => {
            ctx.params.post_id = 2;
            ctx.request.body = { content: 'Test comment' };
            commentModel.createNewComment.mockResolvedValue({ affectedRows: 1, insertId: 1 });
            
            await commentController.createNewComment(ctx);
            
            expect(commentModel.createNewComment).toHaveBeenCalledWith(1, 2, 'Test comment');
            expect(ctx.status).toBe(201);
            expect(ctx.body).toEqual({ message: "Comment created for 2 by 1" });
        });

        it('should return 400 if content is missing', async () => {
            ctx.params.post_id = 2;
            ctx.request.body = {};
            
            await commentController.createNewComment(ctx);
            
            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: "Content required to create comment." });
            expect(commentModel.createNewComment).not.toHaveBeenCalled();
        });

        it('should return 500 on database error', async () => {
            ctx.params.post_id = 2;
            ctx.request.body = { content: 'Test comment' };
            commentModel.createNewComment.mockRejectedValue(new Error('DB Error'));
            
            await commentController.createNewComment(ctx);
            
            expect(ctx.status).toBe(500);
            expect(ctx.body).toEqual({ error: "Internal Server Error." });
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('editComment', () => {
        it('should edit a comment successfully', async () => {
            ctx.params.comment_id = 3;
            ctx.request.body = { content: 'Edited comment' };
            commentModel.updateComment.mockResolvedValue({ affectedRows: 1 });

            await commentController.editComment(ctx);

            expect(commentModel.updateComment).toHaveBeenCalledWith(3, 'Edited comment');
            expect(ctx.status).toBe(201); // Controller uses 201 for edit
            expect(ctx.body).toEqual({ message: "Comment edited for 3" });
        });

        it('should return 400 if content is missing', async () => {
            ctx.params.comment_id = 3;
            ctx.request.body = {};

            await commentController.editComment(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: "Content required to edit comment." });
            expect(commentModel.updateComment).not.toHaveBeenCalled();
        });

        it('should return 400 if comment could not be updated', async () => {
            ctx.params.comment_id = 3;
            ctx.request.body = { content: 'Edited comment' };
            commentModel.updateComment.mockResolvedValue({ affectedRows: 0 });

            await commentController.editComment(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: "Post could not be updated." }); // Matches controller response
        });

        it('should return 500 on database error', async () => {
            ctx.params.comment_id = 3;
            ctx.request.body = { content: 'Edited comment' };
            commentModel.updateComment.mockRejectedValue(new Error('DB Error'));

            await commentController.editComment(ctx);

            expect(ctx.status).toBe(500);
            expect(ctx.body).toEqual({ error: "Internal Server Error." });
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('deleteComment', () => {
        it('should delete a comment', async () => {
            ctx.params.comment_id = 1;
            commentModel.deleteComment.mockResolvedValue({ affectedRows: 1 });
            
            await commentController.deleteComment(ctx);
            
            expect(commentModel.deleteComment).toHaveBeenCalledWith(1);
            expect(ctx.status).toBe(200);
            expect(ctx.body).toEqual({ message: "Comment deleted." });
        });

        it('should return 400 if comment to delete is not found', async () => {
            ctx.params.comment_id = 1;
            commentModel.deleteComment.mockResolvedValue({ affectedRows: 0 });

            await commentController.deleteComment(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: "Comment not found." });
        });

        it('should return 500 on database error', async () => {
            ctx.params.comment_id = 1;
            commentModel.deleteComment.mockRejectedValue(new Error('DB Error'));

            await commentController.deleteComment(ctx);

            expect(ctx.status).toBe(500);
            expect(ctx.body).toEqual({ error: "Internal Server Error." });
            expect(console.error).toHaveBeenCalled();
        });
    });
});
