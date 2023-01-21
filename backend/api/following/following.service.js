const logger = require('../../services/logger.service')
const db = require('../../database');
const noitificationService = require('../notification/notification.service');

async function query(followerId, userId) {
    try {
        if (userId) {
            const following = await db.query(`select * from following where followerId = $followerId and userId = $userId`, {
                $followerId: followerId,
                $userId: userId
            });
            return following
        } else {
            return await db.query(`select * from following where followerId = $followerId`, { $followerId: followerId });
        }
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

async function remove(followerId, userId) {
    try {
        await db.txn(async () => {
            await db.exec(
                `delete from following where followerId = $followerId and userId = $userId`, {
                $followerId: followerId,
                $userId: userId
            });

            await db.exec(
                `delete from notifications where userId = $userId and byUserId = $followerId and type = 'follow'`, {
                $followerId: followerId,
                $userId: userId
            });
        })
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
        return await db.txn(async () => {

            const id = await db.exec(
                `insert into following (userId, followerId, username, fullname, imgUrl) 
            values ($userId, $followerId, $username, $fullname, $imgUrl)`, {
                $userId: following.userId,
                $followerId: following.followerId,
                $username: following.username,
                $fullname: following.fullname,
                $imgUrl: following.imgUrl
            })

            if (following.userId !== following.followerId) {
                const noitification = {
                    type: 'follow',
                    byUserId: following.followerId,
                    userId: following.userId,
                    entityId: id,
                }
                await noitificationService.add(noitification)
            }

            return id
        })
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