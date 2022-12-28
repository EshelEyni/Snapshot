const logger = require('../../services/logger.service')
const db = require('../../database');

async function query() {
    try {
        const stories = await db.query(`select * from stories`);
        return stories
    } catch (err) {
        logger.error('cannot find stories', err)
        throw err
    }
}

async function getById(storyId) {

    try {
        const stories = await db.query(`select * from stories where id = $id`, { $id: storyId });
        if (stories.length === 0) {
            return 'story not found';
        }
        const user = await db.query(`select * from users where id = $id`, { $id: stories[0].userId });
        stories[0].by = { id: user.id, username: user.username, fullname: user.fullname, imgUrl: user.imgUrl };
        const userViews = await db.query(`select * from userViews where storyId = $id`, { $id: storyId });
        stories[0].watchedBy = userViews;
        return stories[0]
    } catch (err) {
        logger.error(`while finding story ${storyId}`, err)
        throw err
    }
}

async function remove(storyId) {
    try {
        await db.exec(`delete from stories where id = $id`, { $id: storyId });
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
                $userId: story.userId,
                $createdAt: story.createdAt
            })


            for (const i of story.imgUrls) {
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