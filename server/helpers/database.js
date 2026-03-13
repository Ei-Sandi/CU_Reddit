const mysql = require('mysql2/promise');
const { DATABASE_CONFIG } = require('../config');

const pool = mysql.createPool(DATABASE_CONFIG);

exports.run_query = async function run_query(query, values) {
    try {
        const [data] = await pool.query(query, values);
        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw error;
    }
}

exports.initializeDB = async function initializeDB() {
    try {
        const connection = await pool.getConnection();

        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                password VARCHAR(100) NOT NULL,
                PRIMARY KEY (id)
            )
        `;
        await connection.query(createUsersTable);

        const createPostsTable = `
            CREATE TABLE IF NOT EXISTS posts (
                id INT NOT NULL AUTO_INCREMENT,
                user_id INT NOT NULL,
                content TEXT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await connection.query(createPostsTable);

        const createCommentsTable = `
            CREATE TABLE IF NOT EXISTS comments (
                id INT NOT NULL AUTO_INCREMENT,
                post_id INT NOT NULL,
                user_id INT NOT NULL,
                content TEXT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await connection.query(createCommentsTable);

        const createPostsLikesTable = `
            CREATE TABLE IF NOT EXISTS posts_likes (
                id INT NOT NULL AUTO_INCREMENT, 
                user_id INT NOT NULL,
                post_id INT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                UNIQUE (user_id, post_id)
            )
        `;
        await connection.query(createPostsLikesTable);

        const createCommentsLikesTable = `
            CREATE TABLE IF NOT EXISTS posts_likes (
                id INT NOT NULL AUTO_INCREMENT, 
                user_id INT NOT NULL,
                comment_id INT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
                UNIQUE (user_id, comment_id)
            )
        `;
        await connection.query(createCommentsLikesTable);

        connection.release();
    } catch (error) {
        console.error("Error creating table:", error);
    }
}
