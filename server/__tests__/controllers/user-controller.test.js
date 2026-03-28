const userController = require('../../src/controllers/user-controller');
const userModel = require('../../src/models/user-model');
const postModel = require('../../src/models/post-model');
const fs = require('fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/user-model');
jest.mock('../../src/models/post-model');
jest.mock('fs/promises');
jest.mock('jsonwebtoken');

describe('User Controller (Unit)', () => {
    let ctx;

    beforeEach(() => {
        jest.clearAllMocks();
        ctx = {
            request: { body: {} },
            params: {},
            status: undefined,
            body: undefined,
            state: { user: { id: 1, username: 'testuser', role: 'user' } }
        };
        // Mock console.error to avoid spamming the test output
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    describe('getAllUsers', () => {
        it('should return a list of all users', async () => {
            const mockUsers = [
                { id: 1, username: 'user1', email: 'user1@example.com', role: 'member' },
                { id: 2, username: 'admin1', email: 'admin1@example.com', role: 'admin' }
            ];
            userModel.getAllUsers.mockResolvedValue(mockUsers);

            await userController.getAllUsers(ctx);

            expect(userModel.getAllUsers).toHaveBeenCalled();
            expect(ctx.body).toEqual(mockUsers);
        });

        it('should return an empty list if no users exist', async () => {
            userModel.getAllUsers.mockResolvedValue([]);

            await userController.getAllUsers(ctx);

            expect(userModel.getAllUsers).toHaveBeenCalled();
            expect(ctx.body).toEqual([]);
        });
    });

    describe('registerUser', () => {
        it('should register successfully', async () => {
            ctx.request.body = { username: 'newuser', password: 'password123', retypePassword: 'password123' };
            userModel.createNewUser.mockResolvedValue({ affectedRows: 1, insertId: 5 });

            await userController.registerUser(ctx);

            expect(userModel.createNewUser).toHaveBeenCalledWith(ctx.request.body);
            expect(ctx.status).toBe(201);
            expect(ctx.body).toEqual({ message: 'Account created for user newuser' });
        });

        it('should fail if passwords do not match', async () => {
            ctx.request.body = { username: 'newuser', password: 'password123', retypePassword: 'differentpassword' };
            
            await userController.registerUser(ctx);
            
            expect(userModel.createNewUser).not.toHaveBeenCalled();
            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: "Passwords do not match." });
        });

        it('should return 409 if username or email already exists', async () => {
            ctx.request.body = { username: 'existinguser', password: 'p', retypePassword: 'p' };
            const duplicateError = new Error('Duplicate');
            duplicateError.code = 'ER_DUP_ENTRY';
            userModel.createNewUser.mockRejectedValue(duplicateError);

            await userController.registerUser(ctx);

            expect(ctx.status).toBe(409);
            expect(ctx.body).toEqual({ message: "Username or Email already exists." });
        });

        it('should return 500 on other database errors', async () => {
            ctx.request.body = { username: 'user', password: 'p', retypePassword: 'p' };
            userModel.createNewUser.mockRejectedValue(new Error('Database blown up'));

            await userController.registerUser(ctx);

            expect(ctx.status).toBe(500);
            expect(ctx.body).toEqual({ error: "Internal Server Error" });
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('loginUser', () => {
        it('should return token on successful login', async () => {
            jwt.sign.mockReturnValue('mocked.jwt.token');

            await userController.loginUser(ctx);

            expect(jwt.sign).toHaveBeenCalledWith(
                { ID: 1, username: 'testuser', role: 'user' },
                expect.any(String),
                { expiresIn: '1h' }
            );
            expect(ctx.status).toBe(200);
            expect(ctx.body.message).toBe("Login successful");
            expect(ctx.body.access_token).toBe('mocked.jwt.token');
            expect(ctx.body.user).toEqual({ ID: 1, username: 'testuser', role: 'user' });
        });

        it('should return 401 if user is not in state (auth failed)', async () => {
            ctx.state.user = undefined;

            await userController.loginUser(ctx);

            expect(ctx.status).toBe(401);
            expect(ctx.body).toEqual({ error: "Invalid email or password." });
            expect(jwt.sign).not.toHaveBeenCalled();
        });
    });

    describe('changeUserName', () => {
        it('should change username successfully', async () => {
            ctx.request.body = { username: 'newname' };
            userModel.updateUserName.mockResolvedValue({ affectedRows: 1 });

            await userController.changeUserName(ctx);

            expect(userModel.updateUserName).toHaveBeenCalledWith(1, 'newname');
            expect(ctx.status).toBe(200);
            expect(ctx.body).toEqual({ message: "Username for id 1 is changed." });
        });

        it('should fail if no new username is provided', async () => {
            ctx.request.body = {};

            await userController.changeUserName(ctx);

            expect(userModel.updateUserName).not.toHaveBeenCalled();
            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: "New username required to update post." });
        });

        it('should return 400 if user could not be updated (no rows affected)', async () => {
            ctx.request.body = { username: 'failname' };
            userModel.updateUserName.mockResolvedValue({ affectedRows: 0 });

            await userController.changeUserName(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({ error: "Username could not be updated." });
        });

        it('should return 500 on database error', async () => {
            ctx.request.body = { username: 'errorname' };
            userModel.updateUserName.mockRejectedValue(new Error('DB Error'));

            await userController.changeUserName(ctx);

            expect(ctx.status).toBe(500);
            expect(ctx.body).toEqual({ error: "Internal Server Error." });
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('deleteUser', () => {
        it('should delete user and associated image files', async () => {
            ctx.params.id = 1;
            const mockPosts = [
                { image_url: '/uploads/pic1.jpg' },
                { image_url: null },
                { image_url: '/uploads/pic2.png' }
            ];
            postModel.getAllImageURLsByUserID.mockResolvedValue(mockPosts);
            fs.unlink.mockResolvedValue();
            userModel.deleteUser.mockResolvedValue({ affectedRows: 1 });

            await userController.deleteUser(ctx);

            expect(postModel.getAllImageURLsByUserID).toHaveBeenCalledWith(1);
            expect(fs.unlink).toHaveBeenCalledTimes(2);
            expect(fs.unlink).toHaveBeenCalledWith(expect.stringContaining('pic1.jpg'));
            expect(fs.unlink).toHaveBeenCalledWith(expect.stringContaining('pic2.png'));
            
            expect(userModel.deleteUser).toHaveBeenCalledWith(1);
            expect(ctx.status).toBe(200);
            expect(ctx.body).toEqual({ message: "User Account Deleted." });
        });

        it('should continue deleting user even if fs.unlink fails', async () => {
            ctx.params.id = 1;
            postModel.getAllImageURLsByUserID.mockResolvedValue([{ image_url: '/uploads/missing.jpg' }]);
            fs.unlink.mockRejectedValue(new Error('File not found')); // Simulate missing file
            userModel.deleteUser.mockResolvedValue({ affectedRows: 1 });

            await userController.deleteUser(ctx);

            expect(fs.unlink).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled(); // Should log the fs error
            expect(userModel.deleteUser).toHaveBeenCalledWith(1);
            expect(ctx.status).toBe(200); // User still gets deleted
        });

        it('should return 404 if user to delete is not found', async () => {
            ctx.params.id = 999;
            postModel.getAllImageURLsByUserID.mockResolvedValue([]);
            userModel.deleteUser.mockResolvedValue({ affectedRows: 0 });

            await userController.deleteUser(ctx);

            expect(ctx.status).toBe(404);
            expect(ctx.body).toEqual({ error: "User not found." });
        });

        it('should return 500 on critically failing db operations', async () => {
            ctx.params.id = 1;
            postModel.getAllImageURLsByUserID.mockRejectedValue(new Error('DB failure'));

            await userController.deleteUser(ctx);

            expect(ctx.status).toBe(500);
            expect(ctx.body).toEqual({ error: "Internal Server Error." });
            expect(console.error).toHaveBeenCalled();
        });
    });
});
