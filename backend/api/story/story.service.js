const logger = require('../../services/logger.service')
const db = require('../../database');

async function query(userId) {

    try {
        return await db.txn(async () => {
            let userIds = [userId]
            const followingIds = await db.query(`select userId from following where followerId = $id`, { $id: userId });
            userIds = [...userIds, ...followingIds.map(following => following.userId)];

            const promises = userIds.map(async userId => {
                const currStory = await db.query(
                    `select * from stories where userId = $id  order by createdAt asc limit 1`,
                    { $id: userId }
                );
                if (currStory.length === 0) return null;
                const users = await db.query(`select * from users where id = $id limit 1`, { $id: currStory[0].userId });
                if (users.length === 0) throw new Error('user not found: ' + currStory[0].userId);
                const user = users[0];
                currStory[0].by = { id: user.id, username: user.username, fullname: user.fullname, imgUrl: user.imgUrl };
                const userViews = await db.query(`select * from storyViews where storyId = $id`, { $id: currStory[0].id });
                currStory[0].watchedBy = userViews;
                const images = await db.query(`select * from storyImg where storyId = $storyId`, { $storyId: currStory[0].id });
                currStory[0].imgUrls = images.map(img => img.imgUrl);

                return currStory[0];
            });

            let stories = await Promise.all(promises);
            stories = stories.filter(story => story !== null);
            return stories;
        });
    } catch (err) {
        logger.error('cannot find stories', err)
        throw err
    }
}

async function getById(storyId) {

    try {
        return await db.txn(async () => {
            const stories = await db.query(`select * from stories where id = $id`, { $id: storyId });
            if (stories.length === 0) {
                return 'story not found';
            }
            const users = await db.query(`select * from users where id = $id`, { $id: stories[0].userId });
            if (users.length === 0) throw new Error('user not found: ' + stories[0].userId);
            const user = users[0];
            stories[0].by = { id: user.id, username: user.username, fullname: user.fullname, imgUrl: user.imgUrl };
            const userViews = await db.query(`select * from storyViews where storyId = $id`, { $id: storyId });
            stories[0].watchedBy = userViews;
            const images = await db.query(`select * from storyImg where storyId = $storyId`, { $storyId: storyId });
            stories[0].imgUrls = images.map(img => img.imgUrl);

            return stories[0]
        });
    } catch (err) {
        logger.error(`while finding story ${storyId}`, err)
        throw err
    }
}

async function remove(storyId) {
    try {
        return await db.txn(async () => {
            await db.exec(`delete from storyImg where storyId = $id`, { $id: storyId });
            await db.exec(`delete from storyViews where storyId = $id`, { $id: storyId });
            await db.exec(`delete from storiesLikedBy where storyId = $id`, { $id: storyId });
            await db.exec(`delete from stories where id = $id`, { $id: storyId });
        })
    } catch (err) {
        logger.error(`cannot remove story ${storyId}`, err)
        throw err
    }
}

async function update(story) {
    try {
        await db.exec(`update stories set userId = $userId, createdAt = $createdAt where id = $id`, {
            $userId: story.userId,
            $createdAt: story.createdAt,
            $id: story.id

        })
        return story
    } catch (err) {
        logger.error(`cannot update story ${story._id}`, err)
        throw err
    }
}

async function add(story) {
    try {
        return await db.txn(async () => {

            const id = await db.exec(`insert into stories (userId,  createdAt) values ($userId, $createdAt)`, {
                $userId: story.by.id,
                $createdAt: story.createdAt
            })


            for (const i of story.imgUrls) {
                console.log('i', i);
                await db.exec(`insert into storyImg (storyId, imgUrl) values ($storyId, $imgUrl)`, {
                    $storyId: id,
                    $imgUrl: i
                })
            }

            return id
        });
    } catch (err) {
        logger.error(`cannot insert story`, err)
        throw err
    }
}

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}