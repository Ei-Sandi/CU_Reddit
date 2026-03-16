const Koa = require('koa');
const cors = require('@koa/cors');

const db = require('./helpers/database');

const users = require('./routes/users'); 
const posts = require('./routes/posts');
const comments = require('./routes/comments');

const { SERVER_PORT } = require('./config');

const app = new Koa();
app.use(cors());

app.use(users.routes())
app.use(posts.routes());
app.use(comments.routes());

db.initializeDB()
    .then(() => {
        app.listen(SERVER_PORT);
        console.log(`Server running on port ${SERVER_PORT}`);
    })
    .catch((error) => {
        console.error("Failed to initialize database:", error);
    });
