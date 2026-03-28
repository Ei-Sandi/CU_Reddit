const jwtStrategy = require('../../src/strategies/jwt-strategy');
const userModel = require('../../src/models/user-model');

jest.mock('../../src/models/user-model');

describe('JWT Strategy Unit Tests', () => {
    let checkJwtPayload;

    beforeAll(() => {
        checkJwtPayload = jwtStrategy._verify;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Successfully authenticates user with valid payload', async () => {
        const mockPayload = { ID: 1, username: 'tester' };
        const mockUser = { id: 1, username: 'tester' };
        const done = jest.fn();

        userModel.getUserByID.mockResolvedValue(mockUser);

        await checkJwtPayload(mockPayload, done);

        expect(userModel.getUserByID).toHaveBeenCalledWith(mockPayload.ID);
        expect(done).toHaveBeenCalledWith(null, mockUser);
    });

    test('Fails authentication if user no longer exists in DB', async () => {
        const mockPayload = { ID: 123 };
        const done = jest.fn();

        userModel.getUserByID.mockResolvedValue(null);

        await checkJwtPayload(mockPayload, done);

        expect(done).toHaveBeenCalledWith(null, false);
    });

    test('Returns error when database fails', async () => {
        const mockPayload = { ID: 1 };
        const error = new Error('Database disconnected');
        const done = jest.fn();

        userModel.getUserByID.mockRejectedValue(error);

        await checkJwtPayload(mockPayload, done);

        expect(done).toHaveBeenCalledWith(error, false);
    });
});
