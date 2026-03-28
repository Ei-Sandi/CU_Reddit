const path = require('node:path');
const { loadEnvFile } = require('node:process');

try {
    loadEnvFile(path.resolve(__dirname, '.env'));
} catch (error) {
    console.error("Warning: Failed to load .env file", error.message);
}

if (process.env.NODE_ENV === 'test') {
    console.log(`TEST MODE DETECTED: Connecting to test_db`);
    exports.DATABASE_CONFIG = {
        host: "localhost",
        port: 3306,
        user: "root",
        password: process.env.DATABASE_PASSWORD || "",
        database: "test_db"
    }
} else {    
    exports.DATABASE_CONFIG = {
        host: process.env.DATABASE_HOST || "localhost",
        port: process.env.DATABASE_PORT || 3306,
        user: process.env.DATABASE_USER || "root",
        password: process.env.DATABASE_PASSWORD || "",
        database: process.env.DATABASE_NAME || "cu_reddit"
    }
}

exports.SERVER_PORT = process.env.SERVER_PORT || 3000;

exports.JWT_SECRETKEY = process.env.JWT_SECRETKEY || "my_super_secure_secret_key_123";
