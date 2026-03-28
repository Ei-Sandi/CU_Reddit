const Router = require('koa-router');
const auth = require('../controllers/auth');
const { uploadImage, getImage } = require('../controllers/upload-controller');
const router = new Router({ prefix: '/api/v1' });

router.post('/images', auth.requireJWT, uploadImage);
router.get('/images/:filename', getImage);

module.exports = router;
