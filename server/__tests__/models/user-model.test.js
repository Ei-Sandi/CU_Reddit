const userModel = require('../../src/models/user-model');
const db = require('../../src/helpers/database');
const bcrypt = require('bcrypt');

jest.mock('../../src/helpers/database');
jest.mock('bcrypt');

describe('User Model Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createNewUser should hash password and insert user', async () => {
        const userData = { username: 'testuser', email: 'test@test.com', password: 'password123' };
        bcrypt.hash.mockResolvedValue('hashed_password');
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await userModel.createNewUser(userData);

        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(db.run_query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            ['testuser', 'test@test.com', 'hashed_password', 'member']
        );
        expect(result.affectedRows).toBe(1);
    });

    test('getAllUsers should return a list of users without passwords', async () => {
        const mockUsers = [
            { id: 1, username: 'testuser1', email: 'test1@test.com', role: 'member' },
            { id: 2, username: 'admin', email: 'admin@test.com', role: 'admin' }
        ];
        db.run_query.mockResolvedValue(mockUsers);

        const result = await userModel.getAllUsers();

        expect(db.run_query).toHaveBeenCalledWith(expect.stringContaining('SELECT id, username, email, role FROM users'));
        expect(result).toEqual(mockUsers);
    });

    test('getUserByEmail should return the first row', async () => {
        const mockUser = { id: 1, email: 'test@test.com' };
        db.run_query.mockResolvedValue([mockUser]);

        const result = await userModel.getUserByEmail('test@test.com');

        expect(db.run_query).toHaveBeenCalledWith(expect.stringContaining('WHERE email = ?'), ['test@test.com']);
        expect(result).toEqual(mockUser);
    });

    test('getUserByID should return the user without password', async () => {
        const mockUser = { id: 1, username: 'testuser', email: 'test@test.com', role: 'member' };
        db.run_query.mockResolvedValue([mockUser]);

        const result = await userModel.getUserByID(1);

        expect(db.run_query).toHaveBeenCalledWith(expect.stringContaining('SELECT id, username, email, role'), [1]);
        expect(result).toEqual(mockUser);
    });

    test('updateUserName should execute update query', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await userModel.updateUserName(1, 'newname');

        expect(db.run_query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users SET username'), ['newname', 1]);
        expect(result.affectedRows).toBe(1);
    });

    test('deleteUser should execute delete query', async () => {
        db.run_query.mockResolvedValue({ affectedRows: 1 });

        const result = await userModel.deleteUser(1);

        expect(db.run_query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM users'), [1]);
        expect(result.affectedRows).toBe(1);
    });
});
