const db = require('../helpers/database');

exports.getAllPosts = async function getAllPosts() {
    const query = `
        SELECT users.username, posts.id AS post_id, posts.content, posts.image_url, posts.created_at
        FROM posts
        JOIN users ON posts.user_id = users.id;
    `;
    const data = await db.run_query(query);
    return data;
}

exports.getPostByUserID = async function getPostByUserID(userID) {
    const query = `
        SELECT users.username, posts.id AS post_id, posts.content, posts.image_url, posts.created_at
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = ?;
    `;
    const data = await db.run_query(query, [userID]);
    return data;
}

exports.getPostByPostID = async function getPostByPostID(postID) {
    const query = "SELECT * FROM posts WHERE id = ?;";
    const data = await db.run_query(query, [postID]);
    return data[0];
}

exports.createNewPost = async function createNewPost(userID, content, imageURL) {
    const query = "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?);";
    const data = await db.run_query(query, [userID, content, imageURL]);
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
