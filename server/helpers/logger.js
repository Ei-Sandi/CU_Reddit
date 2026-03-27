const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(path.join(__dirname, '../../access-logs.log'), { flags: 'a' });

const requestLogger = async (ctx, next) => {
    const start = Date.now();
    
    // Wait for the route and other middleware to finish processing
    await next();
    
    const duration = Date.now() - start;
    const logEntry = `[${new Date().toISOString()}] ${ctx.method} ${ctx.originalUrl} - status: ${ctx.status} - ${duration}ms\n`;
    
    logStream.write(logEntry);
};

module.exports = requestLogger;
