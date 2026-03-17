const db = require('../helpers/database');

exports.countCommentLikes = async function countCommentLikes(commentID) {
    const query = "SELECT COUNT(*) as count FROM comments_likes WHERE comment_id = ?;";
    const data = await db.run_query(query, [commentID]);
    return data.length ? data[0].count : 0;
}

exports.createCommentLike = async function createCommentLike(commentID, userID) {
    const query = "INSERT INTO comments_likes (user_id, comment_id) VALUES (?, ?);";
    const data = await db.run_query(query, [userID, commentID]);
    return data;
}

exports.deleteCommentLike = async function deleteCommentLike(commentID, userID) {
    const query = "DELETE FROM comments_likes WHERE user_id = ? AND comment_id = ?;";
    const data = await db.run_query(query, [userID, commentID]);
    return data;
}
