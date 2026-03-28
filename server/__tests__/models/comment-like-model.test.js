const likeModel = require('../../src/models/comment-like-model');
const db = require('../../src/helpers/database');

jest.mock('../../src/helpers/database');

describe('Comment Like Model Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getCommentLike should return a specific like if it exists', async () => {
        const mockLike = { id: 1, user_id: 1, comment_id: 101 };
        db.run_query.mockResolvedValue([mockLike]);

        const result = await likeModel.getCommentLike(101, 1);

        expect(db.run_query).toHaveBeenCalledWith(
            expect.stringContaining('WHERE comment_id = ? AND user_id = ?'),
            [101, 1]
        );
        expect(result).toEqual(mockLike);
    });

    test('createCommentLike should insert a new record', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await likeModel.createCommentLike(101, 1);

        expect(db.run_query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO comments_likes'),
            [1, 101]
        );
        expect(result.affectedRows).toBe(1);
    });

    test('deleteCommentLike should remove the record', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await likeModel.deleteCommentLike(101, 1);

        expect(db.run_query).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM comments_likes'),
            [1, 101]
        );
        expect(result.affectedRows).toBe(1);
    });
});
