const Router = require('koa-router');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions');
const { validatePostContent } = require('../middlewares/validation');

const {
    getAllPosts,
    getPostByUserID,
    createNewPost,
    editPost,
    deletePost
} = require('../controllers/post-controller');

const prefix = '/api/v1/posts';
const router = new Router({ prefix: prefix });

router.get('/', auth.requireJWT, getAllPosts);
router.get('/:user_id', auth.requireJWT, getPostByUserID);
router.post('/', auth.requireJWT, validatePostContent, createNewPost);
router.put('/:post_id', auth.requireJWT, permissions.canUpdatePost, validatePostContent, editPost);
router.del('/:post_id', auth.requireJWT, permissions.canDeletePost, deletePost);

module.exports = router;
