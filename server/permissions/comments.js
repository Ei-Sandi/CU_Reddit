const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('member')
    .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
    .execute('update')
    .on('comment');
ac.grant('member')
    .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
    .execute('delete')
    .on('comment');

ac.grant('admin')
    .execute('delete')
    .on('comment');
ac.grant('admin')
    .execute('update')
    .on('comment');

exports.update = (requester, data) => {
    return ac
        .can(requester.role)
        .context({ requester: requester.id, owner: data.user_id })
        .execute('update')
        .sync()
        .on('comment');
}

exports.delete = (requester, data) => {
    return ac
        .can(requester.role)
        .context({ requester: requester.id, owner: data.user_id })
        .execute('delete') 
        .sync()
        .on('comment');
}
