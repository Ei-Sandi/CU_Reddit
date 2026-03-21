const db = require('../helpers/database');

exports.getAllPosts = async function getAllPosts() {
    const query = `
        SELECT users.username, posts.id AS post_id, posts.content
        FROM posts
        JOIN users ON posts.user_id = users.id;
    `;
    const data = await db.run_query(query);
    return data;
}

exports.getPostByUserID = async function getPostByUserID(userID) {
    const query = "SELECT * FROM posts WHERE user_id = ?;";
    const data = await db.run_query(query, [userID]);
    return data;
}

exports.getPostByPostID = async function getPostByPostID(postID) {
    const query = "SELECT * FROM posts WHERE id = ?;";
    const data = await db.run_query(query, [postID]);
    return data[0];
}

exports.createNewPost = async function createNewPost(userID, content) {
    const query = "INSERT INTO posts (user_id, content) VALUES (?, ?);";
    const data = await db.run_query(query, [userID, content]);
    return data;
}

exports.updatePost = async function updatePost(postID, newContent) {
    const query = "UPDATE posts SET content = ? WHERE id = ?;";
    const data = await db.run_query(query, [newContent, postID]);
    return data;
}

exports.deletePost = async function deletePost(postID) {
    const query = "DELETE FROM posts WHERE id = ?;";
    const data = await db.run_query(query, [postID]);
    return data;
}
