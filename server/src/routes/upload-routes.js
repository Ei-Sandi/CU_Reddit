const Router = require('koa-router');
const auth = require('../middlewares/auth');
const { uploadImage, getImage } = require('../controllers/upload-controller');

const prefix = '/api/v1';
const router = new Router({ prefix: prefix });

router.post('/images', auth.requireJWT, uploadImage);
router.get('/images/:filename', getImage);

module.exports = router;
