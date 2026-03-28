const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('member')
    .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
    .execute('delete')
    .on('post');

ac.grant('admin')
    .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
    .execute('delete')
    .on('post');

exports.delete = (requester, data) => {
    return ac
        .can(requester.role)
        .context({ requester: requester.id, owner: data.user_id })
        .execute('delete') 
        .sync()
        .on('post');
}
