const db = require('../helpers/database');

exports.countPostLikes = async function countPostLikes(postID) {
    const query = "SELECT COUNT(*) as count FROM posts_likes WHERE post_id = ?;";
    const data = await db.run_query(query, [postID]);
    return data.length ? data[0].count : 0;
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
