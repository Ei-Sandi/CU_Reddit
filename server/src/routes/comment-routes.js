const Router = require('koa-router');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions');
const { validateCommentContent } = require('../middlewares/validation');
const {
    getAllCommentsOfAPost,
    createNewComment,
    editComment,
    deleteComment
} = require('../controllers/comment-controller');

const prefix = '/api/v1/comments';
const router = new Router({ prefix: prefix });

router.get('/:post_id', auth.requireJWT, getAllCommentsOfAPost);
router.post('/:post_id', auth.requireJWT, validateCommentContent, createNewComment);
router.put('/:comment_id', auth.requireJWT, permissions.canUpdateComment, validateCommentContent, editComment);
router.del('/:comment_id', auth.requireJWT, permissions.canDeleteComment, deleteComment);

module.exports = router;
