const router = require('../../src/routes/post-routes');

describe('Post Routes', () => {
    it('should register routes with exact paths and methods', () => {
        const routes = router.stack.map(layer => ({
            path: layer.path,
            methods: layer.methods
        }));

        expect(routes).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: '/api/v1/posts', methods: expect.arrayContaining(['GET']) }),
            expect.objectContaining({ path: '/api/v1/posts/:user_id', methods: expect.arrayContaining(['GET']) }),
            expect.objectContaining({ path: '/api/v1/posts', methods: expect.arrayContaining(['POST']) }),
            expect.objectContaining({ path: '/api/v1/posts/:post_id', methods: expect.arrayContaining(['PUT']) }),
            expect.objectContaining({ path: '/api/v1/posts/:post_id', methods: expect.arrayContaining(['DELETE']) })
        ]));
    });
});
