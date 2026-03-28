const validation = require('../../src/middlewares/validation');

describe('Validation Middleware Unit Tests', () => {
    describe('validateUserRegistration', () => {
        test('Should call next() with valid data', async () => {
            const ctx = {
                request: {
                    body: {
                        username: 'testuser',
                        email: 'test@coventry.ac.uk',
                        password: 'Password123',
                        retypePassword: 'Password123'
                    }
                }
            };
            const next = jest.fn();
            await validation.validateUserRegistration(ctx, next);
            expect(next).toHaveBeenCalled();
        });

        test('Should return 400 with invalid email format', async () => {
            const ctx = {
                request: {
                    body: {
                        username: 'testuser',
                        email: 'invalid-email',
                        password: 'Password123',
                        retypePassword: 'Password123'
                    }
                },
                status: 0,
                body: {}
            };
            const next = jest.fn();
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await validation.validateUserRegistration(ctx, next);

            expect(ctx.status).toBe(400);
            expect(next).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('validateUsernameUpdate', () => {
        test('Should call next() with valid data', async () => {
            const ctx = {
                request: {
                    body: { username: 'newname' }
                }
            };
            const next = jest.fn();
            await validation.validateUsernameUpdate(ctx, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
