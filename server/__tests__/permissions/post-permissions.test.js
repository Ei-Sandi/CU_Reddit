const postPermissions = require('../../src/permissions/post-permissions');

describe('Post Permissions', () => {
    const owner = { id: 1, role: 'member' };
    const otherUser = { id: 2, role: 'member' };
    const admin = { id: 3, role: 'admin' };
    const post = { user_id: 1 };

    // Update tests
    test('Owner can update their own post', () => {
        const permission = postPermissions.update(owner, post);
        expect(permission.granted).toBe(true);
    });

    test('Other user cannot update someone else\'s post', () => {
        const permission = postPermissions.update(otherUser, post);
        expect(permission.granted).toBe(false);
    });

    test('Admin can update any post', () => {
        const permission = postPermissions.update(admin, post);
        expect(permission.granted).toBe(true);
    });

    // Delete tests
    test('Owner can delete their own post', () => {
        const permission = postPermissions.delete(owner, post);
        expect(permission.granted).toBe(true);
    });

    test('Other user cannot delete someone else\'s post', () => {
        const permission = postPermissions.delete(otherUser, post);
        expect(permission.granted).toBe(false);
    });

    test('Admin can delete any post', () => {
        const permission = postPermissions.delete(admin, post);
        expect(permission.granted).toBe(true);
    });
});
