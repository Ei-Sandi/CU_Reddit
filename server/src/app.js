const Koa = require('koa');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');

const db = require('./helpers/database');
const requestLogger = require('./middlewares/logger');

const users = require('./routes/user-routes');
const posts = require('./routes/post-routes');
const comments = require('./routes/comment-routes');
const postLikes = require('./routes/post-like-routes');
const commentLikes = require('./routes/comment-like-routes');
const uploads = require('./routes/upload-routes.js');

const { SERVER_PORT } = require('../config');

const { koaSwagger } = require('koa2-swagger-ui');
const yaml = require('yamljs');
const path = require('path');
const spec = yaml.load(path.join(__dirname, 'schemas', 'openapi.yaml'));

const app = new Koa();

app.use(requestLogger);

app.use(cors());

app.use(koaBody({
    multipart: true,
    parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE']
}));

app.use(koaSwagger({ routePrefix: '/api/v1/docs', swaggerOptions: { spec } }));
app.use(users.routes())
app.use(posts.routes());
app.use(comments.routes());
app.use(postLikes.routes());
app.use(commentLikes.routes());
app.use(uploads.routes());

db.initializeDB()
    .then(() => {
        if (process.env.NODE_ENV !== 'test') {
            app.listen(SERVER_PORT, () => {
                console.log(`Server running on port ${SERVER_PORT}`);
            });
        }
    })
    .catch((error) => {
        console.error("Failed to initialize database:", error);
    });

module.exports = app;
