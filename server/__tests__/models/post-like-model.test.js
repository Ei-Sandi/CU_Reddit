const likeModel = require('../../src/models/post-like-model');
const db = require('../../src/helpers/database');

jest.mock('../../src/helpers/database');

describe('Post Like Model Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getPostLike should return a like record', async () => {
        const mockLike = { id: 1, user_id: 1, post_id: 1 };
        db.run_query.mockResolvedValue([mockLike]);

        const result = await likeModel.getPostLike(1, 1);

        expect(db.run_query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM posts_likes'),
            [1, 1]
        );
        expect(result).toEqual(mockLike);
    });

    test('createPostLike should insert record', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await likeModel.createPostLike(2, 1);

        expect(db.run_query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO posts_likes'),
            [1, 2]
        );
        expect(result.affectedRows).toBe(1);
    });

    test('deletePostLike should remove record', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await likeModel.deletePostLike(2, 1);

        expect(db.run_query).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM posts_likes'),
            [1, 2]
        );
        expect(result.affectedRows).toBe(1);
    });
});
