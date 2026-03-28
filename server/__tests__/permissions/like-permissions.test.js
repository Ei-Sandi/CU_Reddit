const likePermissions = require('../../src/permissions/like-permissions');

describe('Like Permissions', () => {
    const owner = { id: 1, role: 'member' };
    const otherUser = { id: 2, role: 'member' };
    const admin = { id: 3, role: 'admin' };
    const like = { user_id: 1 };

    test('Owner can delete their own like', () => {
        const permission = likePermissions.delete(owner, like);
        expect(permission.granted).toBe(true);
    });

    test('Other user cannot delete someone else\'s like', () => {
        const permission = likePermissions.delete(otherUser, like);
        expect(permission.granted).toBe(false);
    });

    test('Admin cannot delete another user\'s like (Restricted to owner only)', () => {
        const permission = likePermissions.delete(admin, like);
        expect(permission.granted).toBe(false);
    });

    test('Admin can delete their own like', () => {
        const sameAdmin = { id: 3, role: 'admin' };
        const adminLike = { user_id: 3 };
        const permission = likePermissions.delete(sameAdmin, adminLike);
        expect(permission.granted).toBe(true);
    });
});
