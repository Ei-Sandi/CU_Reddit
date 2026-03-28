const router = require('../../src/routes/user-routes');

describe('User Routes', () => {
    it('should register routes with exact paths and methods', () => {
        const routes = router.stack.map(layer => ({
            path: layer.path,
            methods: layer.methods
        }));

        expect(routes).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: '/api/v1/users', methods: expect.arrayContaining(['GET']) }),
            expect.objectContaining({ path: '/api/v1/users', methods: expect.arrayContaining(['POST']) }),
            expect.objectContaining({ path: '/api/v1/users/login', methods: expect.arrayContaining(['POST']) }),
            expect.objectContaining({ path: '/api/v1/users', methods: expect.arrayContaining(['PUT']) }),
            expect.objectContaining({ path: '/api/v1/users/:id', methods: expect.arrayContaining(['DELETE']) })
        ]));
    });
});
