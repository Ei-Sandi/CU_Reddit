const Koa = require('koa');
const cors = require('@koa/cors');
const { loadEnvFile } = require('node:process');

try {
    loadEnvFile('.env');
} catch (error) {
    // Ignore error if the .env file doesn't exist
}

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const app = new Koa();

app.use(cors());
app.listen(SERVER_PORT);
console.log(`Server running on port ${SERVER_PORT}`);