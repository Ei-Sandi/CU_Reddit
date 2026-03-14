const db = require('../helpers/database');
const bcrypt = require('bcrypt');

exports.createNewUser = async function createNewUser(user) {
    const query = "INSERT INTO users SET ?";

    const password = user.password;
    const hash = await bcrypt.hashSync(password, 10);
    user.password = hash;

    delete user.retypePassword;

    const data = await db.run_query(query, user);

    return data;
}

exports.authenticateUser = async function authenticateUser(email, password) {
    const query = "SELECT * FROM users WHERE email = ?;";
    
    const rows = await db.run_query(query, [email]);
    const user = rows[0];
    
    if (!user) {
        return null;
    } 

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        return user;
    }

    return null;
}

exports.deleteUser = async function deleteUser(userID) {
    const query = "DELETE FROM users WHERE ID = ?";
    const data = await db.run_query(query, userID);
    return data;
}