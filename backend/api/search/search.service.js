const logger = require('../../services/logger.service')
const db = require('../../database');

async function query(userId) {
    try {
        return await db.txn(async () => {
            const searches = await db.query(
                `select * from recentSearches where searcherId = $searcherId`, {
                $searcherId: userId
            })

            const formmatedSearches = []

            for (const search of searches) {
                if (search.type === 'user') {
                    const users = await db.query(`select * from users where id = $id`, { $id: search.searchItemId })
                    const user = users[0]

                    const currStoryId = await db.query(
                        `select * from stories 
                            where userId = $id 
                            order by createdAt asc
                            limit 1 `, { $id: search.searchItemId })
                    if (currStoryId.length > 0) {
                        user.currStoryId = currStoryId[0].id;
                    }
                    else {
                        user.currStoryId = null;
                    }

                    formmatedSearches.push(user)
                }
                else if (search.type === 'tag') {
                    const tags = await db.query(`select * from tags where id = $id`, { $id: search.searchItemId })
                    const tag = tags[0]
                    const postIds = await db.query(`select * from postTags where tagId = $id`, { $id: search.searchItemId })
                    tag.postIds = postIds.map(postId => postId.postId)
                    formmatedSearches.push(tag)
                }
            }

            return formmatedSearches
        })
    } catch (err) {
        logger.error('cannot get searches', err)
        throw err
    }
}


async function add(search) {
    try {
        const { userId, type, itemId } = search;
        const searchId = await db.exec(
            `insert into recentSearches (searcherId, type, searchItemId)
            values ($searcherId, $type, $searchItemId)`, {
            $searcherId: userId,
            $type: type,
            $searchItemId: itemId
        }
        );
        return searchId;
    } catch (err) {
        logger.error('cannot add search', err)
        throw err
    }
}

async function remove(searchId) {
    try {
        await db.exec(`delete from recentSearches where searchItemId = $id`, {
            $id: searchId
        })
    } catch (err) {
        logger.error(`cannot remove search ${searchId}`, err)
        throw err
    }
}

async function removeAll(userId){
    try {
        await db.exec(`delete from recentSearches where searcherId = $id`, {
            $id: userId
        })
    } catch (err) {
        logger.error(`cannot remove searches ${userId}`, err)
        throw err
    }
}

module.exports = {
    query,
    add,
    remove,
    removeAll
}