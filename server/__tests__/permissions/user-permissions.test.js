const userPermissions = require('../../src/permissions/user-permissions');

describe('User Permissions', () => {
    const owner = { id: 1, role: 'member' };
    const otherUser = { id: 2, role: 'member' };
    const admin = { id: 3, role: 'admin' };
    const userToEdit = { id: 1 };

    // Update tests
    test('User can update their own account', () => {
        const permission = userPermissions.update(owner, userToEdit);
        expect(permission.granted).toBe(true);
    });

    test('User cannot update someone else\'s account', () => {
        const permission = userPermissions.update(otherUser, userToEdit);
        expect(permission.granted).toBe(false);
    });

    test('Admin cannot update another user\'s account (Restricted to owner only)', () => {
        const permission = userPermissions.update(admin, userToEdit);
        expect(permission.granted).toBe(false);
    });

    test('Admin can update their own account', () => {
        const sameAdmin = { id: 3, role: 'admin' };
        const adminAccount = { id: 3 };
        const permission = userPermissions.update(sameAdmin, adminAccount);
        expect(permission.granted).toBe(true);
    });

    // Delete tests
    test('User can delete their own account', () => {
        const permission = userPermissions.delete(owner, userToEdit);
        expect(permission.granted).toBe(true);
    });

    test('User cannot delete someone else\'s account', () => {
        const permission = userPermissions.delete(otherUser, userToEdit);
        expect(permission.granted).toBe(false);
    });

    test('Admin can delete any account', () => {
        const permission = userPermissions.delete(admin, userToEdit);
        expect(permission.granted).toBe(true);
    });
});
