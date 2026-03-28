const router = require('../../src/routes/comment-routes');

describe('Comment Routes', () => {
    it('should register routes with exact paths and methods', () => {
        const routes = router.stack.map(layer => ({
            path: layer.path,
            methods: layer.methods
        }));

        expect(routes).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: '/api/v1/comments/:post_id', methods: expect.arrayContaining(['GET']) }),
            expect.objectContaining({ path: '/api/v1/comments/:post_id', methods: expect.arrayContaining(['POST']) }),
            expect.objectContaining({ path: '/api/v1/comments/:comment_id', methods: expect.arrayContaining(['PUT']) }),
            expect.objectContaining({ path: '/api/v1/comments/:comment_id', methods: expect.arrayContaining(['DELETE']) })
        ]));
    });
});
