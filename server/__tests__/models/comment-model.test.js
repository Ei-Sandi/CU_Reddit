const commentModel = require('../../src/models/comment-model');
const db = require('../../src/helpers/database');

jest.mock('../../src/helpers/database');

describe('Comment Model Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllCommentsOfAPost should return comments with counts', async () => {
        const mockComments = [{ id: 1, content: 'Nice!', username: 'user1', likes_count: 2 }];
        db.run_query.mockResolvedValue(mockComments);

        const result = await commentModel.getAllCommentsOfAPost(100);

        expect(db.run_query).toHaveBeenCalledWith(expect.stringContaining('SELECT comments.*'), [100]);
        expect(result).toEqual(mockComments);
    });

    test('createNewComment should insert comment', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await commentModel.createNewComment(1, 100, 'my comment');

        expect(db.run_query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO comments'),
            [100, 1, 'my comment']
        );
        expect(result.affectedRows).toBe(1);
    });

    test('getCommentByCommentID should return the specific comment data', async () => {
        const mockRow = { id: 1, content: 'text' };
        db.run_query.mockResolvedValue([mockRow]);

        const result = await commentModel.getCommentByCommentID(1);

        expect(db.run_query).toHaveBeenCalledWith(expect.stringContaining('WHERE id = ?'), [1]);
        expect(result).toEqual(mockRow);
    });

    test('updateComment should execute update', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await commentModel.updateComment(1, 'updated');

        expect(db.run_query).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE comments SET content'),
            ['updated', 1]
        );
        expect(result.affectedRows).toBe(1);
    });

    test('deleteComment should remove comment', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await commentModel.deleteComment(1);

        expect(db.run_query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM comments'), [1]);
        expect(result.affectedRows).toBe(1);
    });
});
