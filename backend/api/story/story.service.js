const logger = require('../../services/logger.service')
const db = require('../../database');

async function query(userId, type) {

    try {
        return await db.txn(async () => {

            if (type === 'home-page' || type === 'story-details') {

                let userIds = [userId]
                const followingIds = await db.query(`select toUserId from follow where fromUserId = $id`, { $id: userId });
                userIds = [...userIds, ...followingIds.map(following => following.toUserId)];

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

                    if (stories.length === 0) return null;
                    const currStory = stories[0];
                    return await _getStoryData(currStory);
                });

                let stories = await Promise.all(promises);
                stories = stories.filter(story => story !== null);
                return stories;
            }

            if (type === 'profile-details' || type === 'highlight-story-picker') {
                let storiesTableResults
                if (type === 'profile-details') {
                    storiesTableResults = await db.query(
                        `select * from stories where userId = $id and isSaved = 1 order by createdAt asc`,
                        { $id: userId }
                    );

                    if (storiesTableResults.length === 0) return [];

                }
                else if (type === 'highlight-story-picker') {
                    storiesTableResults = await db.query(
                        `select * from stories where userId = $id and isSaved = 0 order by createdAt asc`,
                        { $id: userId }
                    );
                    if (storiesTableResults.length === 0) return [];

                }
                const promises = storiesTableResults.map(async story => {
                    return await _getStoryData(story);
                });

                let stories = await Promise.all(promises);
                return stories;

            }
        });

    } catch (err) {
        logger.error('cannot find stories', err)
        throw err
    }
}

async function getById(storyId, type) {
    try {
        return await db.txn(async () => {
            let stories = [];

            if (type === 'user-preview') {
                stories = await db.query(`select * from stories where id = $id and isArchived = 0`, {
                    $id: storyId,
                });
            }
            else if (type === 'story-details' || type === 'chat') {
                stories = await db.query(`select * from stories where id = $id`, {
                    $id: storyId,
                });
            }

            if (stories.length === 0) {
                return 'story not found';
            }
            const currStory = stories[0];
            return await _getStoryData(currStory);
        });
    } catch (err) {
        logger.error(`while finding story ${storyId}`, err)
        throw err
    }
}

async function _getStoryData(currStory) {
    const users = await db.query(`select * from users where id = $id`, { $id: currStory.userId });
    if (users.length === 0) throw new Error('user not found: ' + currStory.userId);
    const user = users[0];
    currStory.by = { id: user.id, username: user.username, fullname: user.fullname, imgUrl: user.imgUrl };
    const userViews = await db.query(`select userId as id, username, fullname, imgUrl from storyViews where storyId = $id`, { $id: currStory.id });
    currStory.viewedBy = userViews;
    const images = await db.query(`select * from storyImg where storyId = $storyId`, { $storyId: currStory.id });
    currStory.imgUrls = images.map(img => img.imgUrl);
    return currStory
}

async function remove(storyId) {
    try {
        return await db.txn(async () => {
            await db.exec(`delete from storyImg where storyId = $id`, { $id: storyId });
            await db.exec(`delete from storyViews where storyId = $id`, { $id: storyId });
            await db.exec(`delete from storiesLikedBy where storyId = $id`, { $id: storyId });
            await db.exec(`update users set storySum = storySum - 1 where id = (select userId from stories where id = $id)`, { $id: storyId });
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
             isSaved = $isSaved,
             savedAt = $savedAt,
             highlightTitle = $highlightTitle,
             highlightCover = $highlightCover
             where id = $id`, {
            $userId: story.userId,
            $createdAt: story.createdAt,
            $id: story.id,
            $isArchived: story.isArchived,
            $isSaved: story.isSaved,
            $savedAt: story.isSaved ? Date.now() : null,
            $highlightTitle: story.highlightTitle,
            $highlightCover: story.highlightCover

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
                `insert into stories (userId, createdAt, isArchived, isSaved,savedAt, highlightTitle, highlightCover) 
                values ($userId, $createdAt, $isArchived, $isSaved, $savedAt, $highlightTitle, $highlightCover)`, {
                $userId: story.by.id,
                $createdAt: Date.now(),
                $isArchived: false,
                $isSaved: false,
                $savedAt: null,
                $highlightTitle: null,
                $highlightCover: null
            })


            for (const i of story.imgUrls) {
                await db.exec(`insert into storyImg (storyId, imgUrl) values ($storyId, $imgUrl)`, {
                    $storyId: id,
                    $imgUrl: i
                })
            }

            await db.exec(`update users set storySum = storySum + 1 where id = $id`, { $id: story.by.id })

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