const logger = require('../../services/logger.service')
const db = require('../../database');

async function query() {
    try {
        return await db.query(`select * from following`);
    } catch (err) {
        logger.error('cannot find following', err)
        throw err
    }
}

async function getById(followingId) {
    try {
        const following = await db.query(`select * from following where id = $id`, { $id: followingId });
        if (following.length === 0) {
            return 'following not found';
        }
        return following[0]
    } catch (err) {
        logger.error(`while finding following ${followingId}`, err)
        throw err
    }
}

async function remove(followingId) {
    try {
        await db.exec(`delete from following where id = $id`, { $id: followingId });
    } catch (err) {
        logger.error(`cannot remove following ${followingId}`, err)
        throw err
    }
}

async function update(following) {
    try {
        await db.exec(
            `update following set userId = $userId,
             followerId = $followerId,
             username = $username,
             fullname = $fullname,
             imgUrl = $imgUrl 
             where id = $id`, {
            $userId: following.userId,
            $followerId: following.followerId,
            $username: following.username,
            $fullname: following.fullname,
            $imgUrl: following.imgUrl,
            $id: following.id
        })
        return following
    } catch (err) {
        logger.error(`cannot update following ${following._id}`, err)
        throw err
    }
}

async function add(following) {
    try {
        const followings = await db.query(
            `insert into following (userId, followerId, username, fullname, imgUrl) 
            values ($userId, $followerId, $username, $fullname, $imgUrl)`, {
            $userId: following.userId,
            $followerId: following.followerId,
            $username: following.username,
            $fullname: following.fullname,
            $imgUrl: following.imgUrl
        })
        return followings[0]
    } catch (err) {
        logger.error('cannot insert following', err)
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