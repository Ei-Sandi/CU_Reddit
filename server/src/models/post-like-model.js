const db = require('../helpers/database');

exports.getPostLike = async function getPostLike(postID, userID) {
    const query = "SELECT * FROM posts_likes WHERE post_id = ? AND user_id = ?;";
    const data = await db.run_query(query, [postID, userID]);
    return data[0];
}

exports.createPostLike = async function createPostLike(postID, userID) {
    const query = "INSERT INTO posts_likes (user_id, post_id) VALUES (?, ?);";
    const data = await db.run_query(query, [userID, postID]);
    return data;
}

exports.deletePostLike = async function deletePostLike(postID, userID) {
    const query = "DELETE FROM posts_likes WHERE user_id = ? AND post_id = ?;";
    const data = await db.run_query(query, [userID, postID]);
    return data;
}
