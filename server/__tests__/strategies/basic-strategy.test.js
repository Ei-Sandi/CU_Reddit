const basicStrategy = require('../../src/strategies/basic-strategy');
const userModel = require('../../src/models/user-model');
const bcrypt = require('bcrypt');

jest.mock('../../src/models/user-model');
jest.mock('bcrypt');

describe('Basic Strategy Unit Tests', () => {
    let authenticateUser;

    beforeAll(() => {
        // Accessing the private authenticateUser function through the Passport constructor
        authenticateUser = basicStrategy._verify;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Successfully authenticates user with correct email and password', async () => {
        const mockUser = { id: 1, email: 'test@uni.edu', password: 'hashedPassword' };
        const plainPassword = 'Password#123';
        const done = jest.fn();

        userModel.getUserByEmail.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);

        await authenticateUser(mockUser.email, plainPassword, done);

        expect(userModel.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
        expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, 'hashedPassword');
        expect(done).toHaveBeenCalledWith(null, expect.not.objectContaining({ password: 'hashedPassword' }));
    });

    test('Fails authentication with non-existent email', async () => {
        const done = jest.fn();
        userModel.getUserByEmail.mockResolvedValue(null);

        await authenticateUser('nonexistent@uni.edu', 'password', done);

        expect(done).toHaveBeenCalledWith(null, false);
    });

    test('Fails authentication with incorrect password', async () => {
        const mockUser = { id: 1, email: 'test@uni.edu', password: 'hashedPassword' };
        const done = jest.fn();

        userModel.getUserByEmail.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        await authenticateUser(mockUser.email, 'wrongPassword', done);

        expect(done).toHaveBeenCalledWith(null, false);
    });

    test('Returns error when database fails', async () => {
        const error = new Error('DB connection failed');
        const done = jest.fn();
        userModel.getUserByEmail.mockRejectedValue(error);
        
        // Mock console.error to keep the test output clean
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await authenticateUser('test@uni.edu', 'password', done);

        expect(done).toHaveBeenCalledWith(error);
        
        consoleSpy.mockRestore();
    });
});
