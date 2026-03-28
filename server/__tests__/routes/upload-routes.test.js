const router = require('../../src/routes/upload-routes');

describe('Upload Routes', () => {
    it('should register routes with exact paths and methods', () => {
        const routes = router.stack.map(layer => ({
            path: layer.path,
            methods: layer.methods
        }));

        expect(routes).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: '/api/v1/images', methods: expect.arrayContaining(['POST']) }),
            expect.objectContaining({ path: '/api/v1/images/:filename', methods: expect.arrayContaining(['GET']) })
        ]));
    });
});
