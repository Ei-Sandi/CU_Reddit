const mysql = require('mysql2/promise');

// Mock mysql2/promise BEFORE importing the database module
const mockQuery = jest.fn();
const mockGetConnection = jest.fn();
const mockPool = {
    query: mockQuery,
    getConnection: mockGetConnection
};

jest.mock('mysql2/promise', () => ({
    createPool: jest.fn(() => mockPool)
}));

// Now import the database module which uses the mocked createPool
const db = require('../../src/helpers/database');

describe('Database Module Unit Tests', () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('run_query', () => {
        test('Should return data on successful query', async () => {
            const mockData = [{ id: 1, username: 'tester' }];
            // mysql2 returns [rows, fields], we destructure [rows]
            mockQuery.mockResolvedValue([mockData, []]);

            const result = await db.run_query('SELECT * FROM users', []);

            expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users', []);
            expect(result).toEqual(mockData);
        });

        test('Should throw error on failed query', async () => {
            const mockError = new Error('Syntax Error');
            mockQuery.mockRejectedValue(mockError);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await expect(db.run_query('INVALID QUERY', [])).rejects.toThrow('Syntax Error');
            expect(consoleSpy).toHaveBeenCalledWith('Database Error:', mockError);

            consoleSpy.mockRestore();
        });
    });

    describe('initializeDB', () => {
        test('Should execute table creation queries successfully', async () => {
            const mockConnection = {
                query: jest.fn().mockResolvedValue([]),
                release: jest.fn()
            };
            mockGetConnection.mockResolvedValue(mockConnection);

            await db.initializeDB();

            expect(mockGetConnection).toHaveBeenCalled();
            // Verify it runs the 5 table creation queries
            expect(mockConnection.query).toHaveBeenCalledTimes(5);
            expect(mockConnection.release).toHaveBeenCalled();
        });

        test('Should handle connection errors gracefully', async () => {
            const mockError = new Error('Connection failed');
            mockGetConnection.mockRejectedValue(mockError);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await db.initializeDB();

            expect(consoleSpy).toHaveBeenCalledWith('Error creating table:', mockError);
            consoleSpy.mockRestore();
        });
    });
});
