const logger = require('../../services/logger.service')
const db = require('../../database');

async function query(followingId) {
    try {
        const followers = await db.query(`select * from followers where followingId = $followingId`, { $followingId: followingId });
        followers.forEach(follower => {
            follower.id = follower.userId;
            delete follower.userId;
        });
        return followers
    } catch (err) {
        logger.error('cannot find followers', err)
        throw err
    }
}

async function getById(followerId) {
    try {
        const followers = await db.query(`select * from followers where id = $id`, { $id: followerId });
        if (followers.length === 0) {
            return 'follower not found';
        }
        return followers[0]
    } catch (err) {
        logger.error(`while finding follower ${followerId}`, err)
        throw err
    }
}

async function remove(followingId, userId) {
    try {
        await db.exec(
            `delete from followers where followingId = $followingId and userId = $userId`,
            {
                $followingId: followingId,
                $userId: userId
            }
        );
    } catch (err) {
        logger.error(`cannot remove follower ${followingId}`, err)
        throw err
    }
}

async function update(follower) {
    try {
        await db.exec(
            `update followers set userId = $userId,
             followingId = $followingId,
             username = $username,
             fullname = $fullname,
             imgUrl = $imgUrl 
             where id = $id`, {
            $userId: follower.userId,
            $followingId: follower.followingId,
            $username: follower.username,
            $fullname: follower.fullname,
            $imgUrl: follower.imgUrl,
            $id: follower.id
        })
        return follower
    } catch (err) {
        logger.error(`cannot update follower ${follower._id}`, err)
        throw err
    }
}

async function add(follower) {
    try {
        const followers = await db.query(
            `select * from followers 
            where userId = $userId and followingId = $followingId`, {
            $userId: follower.userId,
            $followingId: follower.followingId
        });
        if (followers.length > 0) {
            return 'follower already exists';
        }
        await db.exec(
            `insert into followers (userId, followingId, username, fullname, imgUrl)
             values ($userId, $followingId, $username, $fullname, $imgUrl)`, {
            $userId: follower.userId,
            $followingId: follower.followingId,
            $username: follower.username,
            $fullname: follower.fullname,
            $imgUrl: follower.imgUrl
        })
        return follower
    } catch (err) {
        logger.error('cannot insert follower', err)
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