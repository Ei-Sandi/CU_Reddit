const Router = require('koa-router');
const auth = require('../controllers/auth');
const { validatePostContent } = require('../controllers/validation');
const { getAllPosts, getPostByUserID, createNewPost, editPost, deletePost } = require('../controllers/post-controller');

const prefix = '/api/v1/posts';
const router = new Router({ prefix: prefix });

router.get('/', auth.requireJWT, getAllPosts);
router.get('/:user_id', auth.requireJWT, getPostByUserID);
router.post('/', auth.requireJWT, validatePostContent, createNewPost);
router.put('/:post_id', auth.requireJWT, validatePostContent, editPost);
router.del('/:post_id', auth.requireJWT, deletePost);

module.exports = router
