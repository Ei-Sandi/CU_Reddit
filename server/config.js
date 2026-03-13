const { loadEnvFile } = require('node:process');

try {
    loadEnvFile('.env');
} catch (error) {
    // Ignore error if the .env file doesn't exist
}

exports.DATABASE_CONFIG = {
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT || 3306,
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "password",
    database: process.env.DATABASE_NAME || "cu_reddit"
}