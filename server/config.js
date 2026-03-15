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

exports.SERVER_PORT = process.env.SERVER_PORT || 3000;

exports.JWT_SECRETKEY = process.env.JWT_SECRETKEY || "my_super_secure_secret_key_123";
