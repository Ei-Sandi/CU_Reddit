const Koa = require('koa');
const cors = require('@koa/cors');
const db = require('./helpers/database');
const users = require('./routes/users'); 
const { SERVER_PORT } = require('./config');

const app = new Koa();
app.use(cors());
app.use(users.routes())

db.initializeDB()
    .then(() => {
        app.listen(SERVER_PORT);
        console.log(`Server running on port ${SERVER_PORT}`);
    })
    .catch((error) => {
        console.error("Failed to initialize database:", error);
    });
