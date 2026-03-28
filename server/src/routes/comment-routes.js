const Router = require('koa-router');
const auth = require('../controllers/auth');
const { validateCommentContent } = require('../controllers/validation');
const { getAllCommentsOfAPost, createNewComment, editComment, deleteComment } = require('../controllers/comment-controller');

const prefix = '/api/v1/comments';
const router = new Router({ prefix: prefix });

router.get('/:post_id', auth.requireJWT, getAllCommentsOfAPost);
router.post('/:post_id', auth.requireJWT, validateCommentContent, createNewComment);
router.put('/:comment_id', auth.requireJWT, validateCommentContent, editComment);
router.del('/:comment_id', auth.requireJWT, deleteComment);

module.exports = router
