const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('member')
    .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
    .execute('update')
    .on('user');
ac.grant('member')
    .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
    .execute('delete')
    .on('user');
    
// Admin is not allowed to change someone's username
ac.grant('admin')
    .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
    .execute('update')
    .on('user');
ac.grant('admin')
    .execute('delete')
    .on('user');

exports.update = (requester, data) => {
    return ac
        .can(requester.role)
        .context({ requester: requester.id, owner: data.id })
        .execute('update')
        .sync()
        .on('user');
}

exports.delete = (requester, data) => {
    return ac
        .can(requester.role)
        .context({ requester: requester.id, owner: data.id })
        .execute('delete') 
        .sync()
        .on('user');
}
