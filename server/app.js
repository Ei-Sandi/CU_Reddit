const Koa = require('koa');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');

const db = require('./helpers/database');

const users = require('./routes/users');
const posts = require('./routes/posts');
const comments = require('./routes/comments');
const postLikes = require('./routes/post-likes');
const commentLikes = require('./routes/comment_likes');
const uploads = require('./routes/uploads.js');

const { SERVER_PORT } = require('./config');

const app = new Koa();
app.use(cors());

app.use(koaBody({
    multipart: true,
    parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE']
}));

app.use(users.routes())
app.use(posts.routes());
app.use(comments.routes());
app.use(postLikes.routes());
app.use(commentLikes.routes());
app.use(uploads.routes());

db.initializeDB()
    .then(() => {
        app.listen(SERVER_PORT);
        console.log(`Server running on port ${SERVER_PORT}`);
    })
    .catch((error) => {
        console.error("Failed to initialize database:", error);
    });
