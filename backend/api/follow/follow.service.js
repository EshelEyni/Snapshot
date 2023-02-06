const logger = require('../../services/logger.service')
const db = require('../../database');

async function getFollowings(userId) {
    try {
        const followings = await db.query(
            `select * from follow 
             JOIN users ON follow.toUserId = users.id
             where fromUserId = $userId`,
            { $userId: userId });

        return followings
    } catch (err) {
        logger.error('cannot find followings', err)
        throw err
    }
}

async function getFollowers(userId) {
    try {
        const followers = await db.query(
            `select * from follow 
             JOIN users ON follow.fromUserId = users.id
             where toUserId = $userId`,
            { $userId: userId });

        return followers
    } catch (err) {
        logger.error('cannot find followers', err)
        throw err
    }
}

async function getFollowing(fromUserId, toUserId) {
    try {
        const following = await db.query(
            `select * from follow 
             JOIN users ON follow.toUserId = users.id
             where fromUserId = $fromUserId and toUserId = $toUserId`,
            {
                $fromUserId: fromUserId,
                $toUserId: toUserId
            });

        return following.length > 0 ? true : false
    } catch (err) {
        logger.error(`while finding following ${follow}`, err)
        throw err
    }
}

async function add(fromUserId, toUserId) {
    console.log('fromUserId', fromUserId);
    console.log('toUserId', toUserId);
    try {
        await db.txn(async () => {

            await db.exec(
                `insert into follow (fromUserId, toUserId) values ($fromUserId, $toUserId)`,
                {
                    $fromUserId: fromUserId,
                    $toUserId: toUserId
                }
            );

            await db.exec(
                `update users set followersSum = followersSum + 1 where id = $toUserId`,
                {
                    $toUserId: toUserId
                }
            );

            await db.exec(
                `update users set followingSum = followingSum + 1 where id = $fromUserId`,
                {
                    $fromUserId: fromUserId
                }
            );

        });
    } catch (err) {
        logger.error(`cannot add follow`, err)
        throw err
    }
}


async function remove(fromUserId, toUserId) {
    try {
        await db.txn(async () => {
            await db.exec(
                `delete from follow where fromUserId = $fromUserId and toUserId = $toUserId`,
                {
                    $fromUserId: fromUserId,
                    $toUserId: toUserId
                }
            );

            await db.exec(
                `update users set followersSum = followersSum - 1 where id = $toUserId`,
                {
                    $toUserId: toUserId
                }
            );

            await db.exec(
                `update users set followingSum = followingSum - 1 where id = $fromUserId`,
                {
                    $fromUserId: fromUserId
                }
            );
        });

    } catch (err) {
        logger.error(`cannot remove follow`, err)
        throw err
    }
}

module.exports = {
    getFollowings,
    getFollowers,
    getFollowing,
    add,
    remove
}