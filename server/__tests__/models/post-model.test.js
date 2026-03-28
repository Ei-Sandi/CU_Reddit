const postModel = require('../../src/models/post-model');
const db = require('../../src/helpers/database');

jest.mock('../../src/helpers/database');

describe('Post Model Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllPosts should return all posts with counts', async () => {
        const mockPosts = [{ post_id: 1, content: 'Hello', likes_count: 5 }];
        db.run_query.mockResolvedValue(mockPosts);

        const result = await postModel.getAllPosts();

        expect(db.run_query).toHaveBeenCalledWith(expect.stringContaining('COUNT(DISTINCT posts_likes.id)'));
        expect(result).toEqual(mockPosts);
    });

    test('getPostByUserID should return posts for user', async () => {
        const mockPosts = [{ post_id: 1, user_id: 123 }];
        db.run_query.mockResolvedValue(mockPosts);

        const result = await postModel.getPostByUserID(123);

        expect(db.run_query).toHaveBeenCalledWith(expect.any(String), [123]);
        expect(result).toEqual(mockPosts);
    });

    test('getPostByPostID should return single post', async () => {
        const mockPost = { id: 1, content: 'test' };
        db.run_query.mockResolvedValue([mockPost]);

        const result = await postModel.getPostByPostID(1);

        expect(db.run_query).toHaveBeenCalledWith(expect.stringContaining('WHERE id = ?'), [1]);
        expect(result).toEqual(mockPost);
    });

    test('createNewPost should insert new post', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await postModel.createNewPost(1, 'content', 'img.jpg');

        expect(db.run_query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO posts'),
            [1, 'content', 'img.jpg']
        );
        expect(result.affectedRows).toBe(1);
    });

    test('updatePost should update content', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await postModel.updatePost(1, 'new content');

        expect(db.run_query).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE posts SET content'),
            ['new content', 1]
        );
        expect(result.affectedRows).toBe(1);
    });

    test('deletePost should remove post', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await postModel.deletePost(1);

        expect(db.run_query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM posts'), [1]);
        expect(result.affectedRows).toBe(1);
    });
});
