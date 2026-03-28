const { initializeDB, run_query } = require('../src/helpers/database');
const bcrypt = require('bcrypt');

module.exports = async () => {
    console.log('\nSetting up test database...');
    
    try {
        await initializeDB();

        await run_query('SET FOREIGN_KEY_CHECKS = 0');
        await run_query('TRUNCATE TABLE comments_likes');
        await run_query('TRUNCATE TABLE posts_likes');
        await run_query('TRUNCATE TABLE comments');
        await run_query('TRUNCATE TABLE posts');
        await run_query('TRUNCATE TABLE users');
        await run_query('SET FOREIGN_KEY_CHECKS = 1');

        const password = await bcrypt.hash('Password#123', 10);
        
        const users = [
            ['test_admin', 'admin@test.com', password, 'admin'],
            ['test_member', 'member@test.com', password, 'member']
        ];
        await run_query('INSERT INTO users (username, email, password, role) VALUES ?', [users]);

        console.log('Test database seeded successfully.\n');
    } catch (error) {
        console.error('Error setting up test database:', error);
        process.exit(1);
    }
};
