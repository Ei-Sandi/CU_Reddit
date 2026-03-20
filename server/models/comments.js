const db = require('../helpers/database');

exports.getAllCommentsOfAPost = async function getAllCommentsOfAPost(postID) {
    const query = "SELECT * FROM comments WHERE post_id = ?;";
    const data = await db.run_query(query, [postID]);
    return data;
}

exports.createNewComment = async function createNewComment(userID, postID, content) {
    const query = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?);";
    const data = await db.run_query(query, [postID,userID,content]);
    return data;
}

exports.getCommentByCommentID = async function getCommentByCommentID(commentID) {
    const query = "SELECT * FROM comments WHERE id = ?;";
    const data = await db.run_query(query, [commentID]);
    return data[0];
}

exports.updateComment = async function updateComment(commentID, newContent) {
    const query = "UPDATE comments SET content = ? WHERE id = ?;";
    const data = await db.run_query(query, [newContent, commentID]);
    return data;
}

exports.deleteComment = async function deleteComment(commentID) {
    const query = "DELETE FROM comments WHERE id = ?;";
    const data = await db.run_query(query, [commentID]);
    return data;
}
