const logger = require('../../services/logger.service')
const db = require('../../database');

async function query(userId, type) {

    try {
        return await db.txn(async () => {
            let userIds = [userId]
            const followingIds = await db.query(`select userId from following where followerId = $id`, { $id: userId });
            userIds = [...userIds, ...followingIds.map(following => following.userId)];

            const promises = userIds.map(async userId => {
                let stories = [];
                if (type === 'home-page') {
                    stories = await db.query(
                        `select * from stories where userId = $id and isArchived = 0 order by createdAt asc limit 1`,
                        { $id: userId }
                    );
                }
                else if (type === 'story-details') {
                    stories = await db.query(
                        `select * from stories where userId = $id order by createdAt desc limit 1`,
                        { $id: userId }
                    );
                }
                else if (type === 'profile-details') {
                    stories = await db.query(
                        `select * from stories where userId = $id and isSaved = 1 order by createdAt desc limit 1`,
                        { $id: userId }
                    );
                }
                else if (type === 'hightlight-modal') {
                    stories = await db.query(
                        `select * from stories where userId = $id and isSaved = 0 order by createdAt desc limit 1`,
                        { $id: userId }
                    );
                }

                if (stories.length === 0) return null;
                const currStory = stories[0];

                const users = await db.query(`select * from users where id = $id limit 1`, { $id: currStory.userId });
                if (users.length === 0) throw new Error('user not found: ' + currStory.userId);
                const user = users[0];
                currStory.by = { id: user.id, username: user.username, fullname: user.fullname, imgUrl: user.imgUrl };

                const userViews = await db.query(
                    `select userId as id, username, fullname, imgUrl from storyViews where storyId = $id`,
                    { $id: currStory.id });
                currStory.viewedBy = userViews;

                const images = await db.query(`select * from storyImg where storyId = $storyId`, { $storyId: currStory.id });
                currStory.imgUrls = images.map(img => img.imgUrl);

                return currStory;
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
            const stories = await db.query(`select * from stories where id = $id and isArchived = 0`, { $id: storyId });
            if (stories.length === 0) {
                return 'story not found';
            }
            const currStory = stories[0];
            const users = await db.query(`select * from users where id = $id`, { $id: currStory.userId });
            if (users.length === 0) throw new Error('user not found: ' + currStory.userId);
            const user = users[0];
            currStory.by = { id: user.id, username: user.username, fullname: user.fullname, imgUrl: user.imgUrl };
            const userViews = await db.query(`select userId as id, username, fullname, imgUrl from storyViews where storyId = $id`, { $id: storyId });
            currStory.viewedBy = userViews;
            const images = await db.query(`select * from storyImg where storyId = $storyId`, { $storyId: storyId });
            currStory.imgUrls = images.map(img => img.imgUrl);
            return currStory
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
        await db.exec(
            `update stories set userId = $userId,
             createdAt = $createdAt,
             isArchived = $isArchived,
             isSaved = $isSaved
             where id = $id`, {
            $userId: story.userId,
            $createdAt: story.createdAt,
            $id: story.id,
            $isArchived: story.isArchived,
            $isSaved: story.isSaved

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

            const id = await db.exec(
                `insert into stories (userId, createdAt, isArchived, isSaved) 
                values ($userId, $createdAt, $isArchived, $isSaved)`, {
                $userId: story.by.id,
                $createdAt: Date.now(),
                $isArchived: false,
                $isSaved: false
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

async function addView(storyId, user) {
    try {
        return await db.txn(async () => {
            const id = await db.exec(
                `insert into storyViews (storyId, userId, username, fullname, imgUrl) 
                values ($storyId, $userId, $username, $fullname, $imgUrl)`, {
                $storyId: storyId,
                $userId: user.id,
                $username: user.username,
                $fullname: user.fullname,
                $imgUrl: user.imgUrl

            })
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
    add,
    addView
}