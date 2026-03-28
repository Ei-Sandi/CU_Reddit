const commentPermissions = require('../../src/permissions/comment-permissions');

describe('Comment Permissions', () => {
    const owner = { id: 1, role: 'member' };
    const otherUser = { id: 2, role: 'member' };
    const admin = { id: 3, role: 'admin' };
    const comment = { user_id: 1 };
    
    // Update tests
    test('Owner can update their own comment', () => {
        const permission = commentPermissions.update(owner, comment);
        expect(permission.granted).toBe(true);
    });

    test('Other user cannot update someone else\'s comment', () => {
        const permission = commentPermissions.update(otherUser, comment);
        expect(permission.granted).toBe(false);
    });

    test('Admin can update any comment', () => {
        const permission = commentPermissions.update(admin, comment);
        expect(permission.granted).toBe(true);
    });
    
    // Delete tests
    test('Owner can delete their own comment', () => {
        const permission = commentPermissions.delete(owner, comment);
        expect(permission.granted).toBe(true);
    });

    test('Other user cannot delete someone else\'s comment', () => {
        const permission = commentPermissions.delete(otherUser, comment);
        expect(permission.granted).toBe(false);
    });

    test('Admin can delete any comment', () => {
        const permission = commentPermissions.delete(admin, comment);
        expect(permission.granted).toBe(true);
    });
});
