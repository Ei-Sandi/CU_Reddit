const router = require('../../src/routes/comment-like-routes');

describe('Comment Like Routes', () => {
    it('should register routes with exact paths and methods', () => {
        const routes = router.stack.map(layer => ({
            path: layer.path,
            methods: layer.methods
        }));

        expect(routes).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: '/api/v1/comment_likes/:comment_id/is_liked', methods: expect.arrayContaining(['GET']) }),
            expect.objectContaining({ path: '/api/v1/comment_likes/:comment_id', methods: expect.arrayContaining(['POST']) }),
            expect.objectContaining({ path: '/api/v1/comment_likes/:comment_id', methods: expect.arrayContaining(['DELETE']) })
        ]));
    });
});
