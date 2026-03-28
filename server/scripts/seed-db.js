const bcrypt = require('bcrypt');
const { run_query, initializeDB } = require('../src/helpers/database');

const saltRounds = 10;

async function seedDB() {
    try {
        await initializeDB();
        console.log('Starting database seed...');

        // 1. Clear existing data
        await run_query('SET FOREIGN_KEY_CHECKS = 0');
        await run_query('TRUNCATE TABLE comments_likes');
        await run_query('TRUNCATE TABLE posts_likes');
        await run_query('TRUNCATE TABLE comments');
        await run_query('TRUNCATE TABLE posts');
        await run_query('TRUNCATE TABLE users');
        await run_query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Cleared existing tables.');

        // 2. Insert Users
        const users = [
            { username: 'admin_user', email: 'admin@uni.edu', password: 'password', role: 'admin' },
            { username: 'alice', email: 'alice@uni.edu', password: 'password', role: 'member' },
            { username: 'bob', email: 'bob@uni.edu', password: 'password', role: 'member' },
            { username: 'charlie', email: 'charlie@uni.edu', password: 'password', role: 'member' },
            { username: 'dana', email: 'dana@uni.edu', password: 'password', role: 'member' }
        ];

        for (const user of users) {
            user.password = await bcrypt.hash(user.password, saltRounds);
        }

        const usersData = users.map(u => [u.username, u.email, u.password, u.role]);
        const userResult = await run_query(`INSERT INTO users (username, email, password, role) VALUES ?`, [usersData]);
        console.log(`✅ Inserted ${userResult.affectedRows} users.`);

        // 3. Insert Posts - Themed around University
        const postsData = [
            [2, 'Just finished the Advanced Programming lecture. Does anyone have notes on the last part about concurrency?', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop'],
            [3, "The new sports club on campus is holding tryouts this Friday at the main arena. Don't miss out!", 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop'],
            [4, 'Can someone explain the tutorial question 3 from the Database Systems module? I am completely lost.', null],
            [2, 'Library cafe has a new specialty coffee. Perfect for late-night study sessions! ☕📚', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop'],
            [5, 'Reminder: Student Union meeting tomorrow at 5 PM in the main hall. We will be discussing the upcoming winter ball.', null]
        ];
        const postResult = await run_query(`INSERT INTO posts (user_id, content, image_url) VALUES ?`, [postsData]);
        console.log(`✅ Inserted ${postResult.affectedRows} posts.`);

        // 4. Insert Comments
        const commentsData = [
            [1, 3, 'I can share my notes with you! Check your student email.'],
            [1, 4, 'I am definitely joining the tryouts.'],
            [2, 1, 'Are you trying to join the basketball team or something else?'],
            [3, 5, 'It essentially asks you to normalize the tables to 3NF. Start with identifying the functional dependencies.'],
            [4, 2, 'That library coffee is a lifesaver. Had it yesterday!'],
            [5, 1, 'Thanks, see you at the meeting!']
        ];
        const commentResult = await run_query(`INSERT INTO comments (post_id, user_id, content) VALUES ?`, [commentsData]);
        console.log(`✅ Inserted ${commentResult.affectedRows} comments.`);

        // 5. Insert Post Likes 
        const postLikesData = [
            [1, 1], [3, 1], [4, 1], [5, 1],
            [1, 2], [4, 2],
            [2, 5], [3, 5]
        ];
        const postLikesResult = await run_query(`INSERT IGNORE INTO posts_likes (user_id, post_id) VALUES ?`, [postLikesData]);
        console.log(`✅ Inserted ${postLikesResult.affectedRows} post likes.`);

        // 6. Insert Comment Likes
        const commentLikesData = [
            [2, 1],
            [3, 3],
            [5, 5]
        ];
        const commentLikesResult = await run_query(`INSERT IGNORE INTO comments_likes (user_id, comment_id) VALUES ?`, [commentLikesData]);
        console.log(`✅ Inserted ${commentLikesResult.affectedRows} comment likes.`);

        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        process.exit();
    }
}

seedDB();
