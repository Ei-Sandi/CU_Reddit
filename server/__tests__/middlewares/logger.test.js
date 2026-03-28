const fs = require('fs');

// Create a mock stream object that we can export and check
const mockWrite = jest.fn();
const mockStream = {
    write: mockWrite
};

// Mock fs.createWriteStream to return our mockStream
jest.mock('fs', () => {
    const originalFs = jest.requireActual('fs');
    return {
        ...originalFs,
        createWriteStream: jest.fn(() => mockStream)
    };
});

// Import logger AFTER mocking fs
const requestLogger = require('../../src/middlewares/logger');

describe('Logger Middleware Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should log request details correctly with username', async () => {
        const ctx = {
            method: 'GET',
            originalUrl: '/api/v1/posts',
            status: 200,
            state: { user: { username: 'testuser' } }
        };
        const next = jest.fn().mockResolvedValue();

        await requestLogger(ctx, next);

        expect(next).toHaveBeenCalled();
        expect(mockWrite).toHaveBeenCalled();
        expect(mockWrite.mock.calls[0][0]).toContain('GET /api/v1/posts - User: testuser - status: 200');
    });

    test('Should log request details correctly with default "Public" if no user', async () => {
        const ctx = {
            method: 'POST',
            originalUrl: '/api/v1/users/login',
            status: 201,
            state: {}
        };
        const next = jest.fn().mockResolvedValue();

        await requestLogger(ctx, next);

        expect(next).toHaveBeenCalled();
        expect(mockWrite).toHaveBeenCalled();
        expect(mockWrite.mock.calls[0][0]).toContain('POST /api/v1/users/login - User: Public - status: 201');
    });
});
