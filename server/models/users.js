const db = require('../helpers/database');
const bcrypt = require('bcrypt');

exports.createNewUser = async function createNewUser(user) {
    const query = "INSERT INTO users SET ?";

    const password = user.password;
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    user.role = "member";

    delete user.retypePassword;

    const data = await db.run_query(query, user);

    return data;
}

exports.getUserByEmail = async function getUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?;";
    
    const rows = await db.run_query(query, [email]);
    return rows[0];
}

exports.getUserByID = async function getUserByID(userID) {
    const query = "SELECT * FROM users WHERE id = ?;";
    
    const rows = await db.run_query(query, [userID]);
    return rows[0];
}

exports.deleteUser = async function deleteUser(userID) {
    const query = "DELETE FROM users WHERE ID = ?";
    const data = await db.run_query(query, userID);
    return data;
}