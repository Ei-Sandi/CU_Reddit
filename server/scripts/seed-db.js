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
            { username: 'admin_user', email: 'admin@coventry.ac.uk', password: 'Password1', role: 'admin' },
            { username: 'alice_1', email: 'alice@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'bob_123', email: 'bob@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'charlie_', email: 'charlie@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'dana_45', email: 'dana@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'eve_stu', email: 'eve@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'frank_2', email: 'frank@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'grace_m', email: 'grace@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'heidi_s', email: 'heidi@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'ivan_st', email: 'ivan@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'judy_un', email: 'judy@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'karl_st', email: 'karl@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'leo_uni', email: 'leo@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'mia_stu', email: 'mia@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'nina_12', email: 'nina@coventry.ac.uk', password: 'Password1', role: 'member' },
            { username: 'oscar_1', email: 'oscar@coventry.ac.uk', password: 'Password1', role: 'member' }
        ];

        for (const user of users) {
            user.password = await bcrypt.hash(user.password, saltRounds);
        }

        const usersData = users.map(u => [u.username, u.email, u.password, u.role]);
        const userResult = await run_query(`INSERT INTO users (username, email, password, role) VALUES ?`, [usersData]);
        console.log(`✅ Inserted ${userResult.affectedRows} users.`);

        // 3. Insert Posts - Themed around University (20 posts)
        const postContents = [
            'Just finished the Advanced Programming lecture. Does anyone have notes on the last part about concurrency?',
            "The new sports club on campus is holding tryouts this Friday at the main arena. Don't miss out!",
            'Can someone explain the tutorial question 3 from the Database Systems module? I am completely lost.',
            'Library cafe has a new specialty coffee. Perfect for late-night study sessions! ☕📚',
            'Reminder: Student Union meeting tomorrow at 5 PM in the main hall. We will be discussing the upcoming winter ball.',
            'Does anyone know when the library opens on weekends?',
            'Lost my ID card in the engineering building. If anyone found it, please let me know!',
            'Looking for group members for the Web Development coursework. Anyone interested?',
            'The campus gym gets so crowded after 5 PM. What’s the best time to go?',
            'Is the student discount for Spotify still active?',
            'Selling my old Computer Science textbooks. DM if interested.',
            'The view from the top floor of the library is amazing today.',
            'Does anyone have past papers for the Data Structures exam?',
            'Free pizza at the student hub! Grab it before it’s gone 🍕',
            'Is the campus shuttle running on time today?',
            'I have an extra ticket for the comedy show tonight. Anyone want it?',
            'Really enjoyed the guest lecture on AI today.',
            'Who else is struggling with the algorithms assignment?',
            'Does the campus clinic offer free flu shots?',
            'Happy Friday everyone! Good luck with the exams next week.'
        ];

        const postsData = [];
        // Guaranteed working Unsplash static source IDs without the legacy "-suffix" breaking
        const imageIds = [
            '1524995997946-a1c2e315a42f',
            '1513258496099-4816281a1796',
            '1532012197267-da84d127e765',
            '1434030216411-0b793f4b4173',
            '1523050854058-8df90110c9f1',
            '1501504905252-473c47e087f8',
            '1456513080510-7bf3a84b82f8',
            '1522202176988-66273c2fd55f',
            '1498050108023-c5249f4df085',
            '1519389950473-47ba0277781c'
        ];

        for (let i = 0; i < 20; i++) {
            const userId = Math.floor(Math.random() * 15) + 2; // Random user 2-16
            // Occasional image using valid IDs from the array
            let imageUrl = null;
            if (Math.random() > 0.5) {
                const randomImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
                imageUrl = `https://images.unsplash.com/photo-${randomImageId}?auto=format&fit=crop&w=800&q=80`;
            }
            postsData.push([userId, postContents[i], imageUrl]);
        }
        
        const postResult = await run_query(`INSERT INTO posts (user_id, content, image_url) VALUES ?`, [postsData]);
        console.log(`✅ Inserted ${postResult.affectedRows} posts.`);

        // 4. Insert Comments (1-3 per post)
        const commentsData = [];
        const genericComments = ['Nice!', 'Thanks for sharing.', 'Can you DM me?', 'I agree.', 'Same here.', 'Good to know!', 'I will be there.', 'Awesome!', 'Let me check.'];
        
        for (let postId = 1; postId <= 20; postId++) {
            const numComments = Math.floor(Math.random() * 3) + 1; // 1 to 3 comments
            const commenters = new Set();
            while (commenters.size < numComments) {
                const userId = Math.floor(Math.random() * 15) + 2; // Random user 2-16
                commenters.add(userId);
            }

            for (const userId of commenters) {
                const randomComment = genericComments[Math.floor(Math.random() * genericComments.length)];
                commentsData.push([postId, userId, randomComment]);
            }
        }
        const commentResult = await run_query(`INSERT INTO comments (post_id, user_id, content) VALUES ?`, [commentsData]);
        console.log(`✅ Inserted ${commentResult.affectedRows} comments.`);

        // 5. Insert Post Likes (5-10 per post)
        const postLikesData = [];
        for (let postId = 1; postId <= 20; postId++) {
            const numLikes = Math.floor(Math.random() * 6) + 5; // 5 to 10 likes
            const likers = new Set();
            while (likers.size < numLikes) {
                const userId = Math.floor(Math.random() * 16) + 1; // Random user 1-16 including admin
                likers.add(userId);
            }
            for (const userId of likers) {
                postLikesData.push([userId, postId]);
            }
        }
        const postLikesResult = await run_query(`INSERT IGNORE INTO posts_likes (user_id, post_id) VALUES ?`, [postLikesData]);
        console.log(`✅ Inserted ${postLikesResult.affectedRows} post likes.`);

        // 6. Insert Comment Likes (2-5 per comment)
        const commentLikesData = [];
        for (let commentId = 1; commentId <= commentResult.affectedRows; commentId++) {
            const numLikes = Math.floor(Math.random() * 4) + 2; // 2 to 5 likes
            const likers = new Set();
            while (likers.size < numLikes) {
                const userId = Math.floor(Math.random() * 16) + 1;
                likers.add(userId);
            }
            for (const userId of likers) {
                commentLikesData.push([userId, commentId]);
            }
        }
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
