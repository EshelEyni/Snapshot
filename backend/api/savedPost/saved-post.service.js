const logger = require('../../services/logger.service')
const db = require('../../database');

async function query(filter) {
    try {
        if (filter.postId) {
            return await db.query(`select * from savedPosts where userId = $userId and postId = $postId`, {
                $userId: filter.userId,
                $postId: filter.postId
            });
        } else {
            return await db.query(`select * from savedPosts where userId = $userId`, {
                $userId: filter.userId
            });
        }
    } catch (err) {
        logger.error('cannot find saved post', err)
        throw err
    }
}


async function save({ postId, userId }) {
    try {
        await db.exec(`insert into savedPosts (postId, userId) values ($postId, $userId)`, {
            $postId: postId,
            $userId: userId
        });
    } catch (err) {
        logger.error('cannot save post', err)
        throw err
    }
}

async function unsave({ postId, userId }) {
    try {
        await db.exec(
            `delete from savedPosts
             where postId = $postId 
             and userId = $userId`, {
            $postId: postId,
            $userId: userId
        }
        );
    } catch (err) {
        logger.error('cannot unsave post', err)
        throw err
    }
}

module.exports = {
    query,
    save,
    unsave
}