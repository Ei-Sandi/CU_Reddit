const Router = require('koa-router');
const auth = require('../controllers/auth');
const { isCommentLiked, getCommentLikes, createCommentLike, deleteCommentLike } = require('../controllers/comment-like-controller');

const prefix = '/api/v1/comment_likes';
const router = new Router({ prefix: prefix });

router.get('/:comment_id/is_liked', auth.requireJWT, isCommentLiked);
router.get('/:comment_id', auth.requireJWT, getCommentLikes);
router.post('/:comment_id', auth.requireJWT, createCommentLike);
router.del('/:comment_id', auth.requireJWT, deleteCommentLike);

module.exports = router;
