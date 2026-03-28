const Router = require('koa-router');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions');
const { isPostLiked, createPostLike, deletePostLike } = require('../controllers/post-like-controller');

const prefix = '/api/v1/post_likes';
const router = new Router({ prefix: prefix });

router.get('/:post_id/is_liked', auth.requireJWT, isPostLiked);
router.post('/:post_id', auth.requireJWT, createPostLike);
router.del('/:post_id', auth.requireJWT, permissions.canDeletePostLike, deletePostLike);

module.exports = router;
