const logger = require('../../services/logger.service')
const db = require('../../database');
const noitificationService = require('../notification/notification.service');

async function getLikesForPost({ postId, userId }) {
    try {
        if (userId) {
            const likes = await db.query(`select * from postsLikedBy where postId = $postId and userId = $userId`, {
                $postId: postId,
                $userId: userId
            });
            return likes
        } else {
            const likes = await db.query(`select * from postsLikedBy where postId = $postId`, {
                $postId: postId
            });

            likes.forEach(like => {
                like.id = like.userId
                delete like.userId
            })
            return likes
        }
    } catch (err) {
        logger.error('cannot find likes', err)
        throw err
    }
}


async function addLikeToPost({ post, user }) {
    try {

        return await db.txn(async () => {
            const id = await db.exec(
                `insert into postsLikedBy (postId, userId, username, fullname, imgUrl) 
            values ($postId, $userId, $username, $fullname, $imgUrl)`, {
                $postId: post.id,
                $userId: user.id,
                $username: user.username,
                $fullname: user.fullname,
                $imgUrl: user.imgUrl
            });

            const noitification = {
                type: 'like-post',
                byUserId: user.id,
                userId: post.by.id,
                entityId: id,
                postId: post.id,
            }
            await noitificationService.add(noitification)

            return id
        })
    } catch (err) {
        logger.error('cannot add like', err)
        throw err
    }
}

async function deleteLikeToPost({ postId, userId }) {
    try {
        await db.txn(async () => {
            const entity = await db.query(
                `select id from postsLikedBy where postId = $postId and userId = $userId`, {
                $postId: postId,
                $userId: userId
            });
            const entityId = entity[0].id;
            
            await db.exec(`delete from postsLikedBy where postId = $postId and userId = $userId`, {
                $postId: postId,
                $userId: userId
            });

            await db.exec(`delete from notifications where entityId = $entityId and type = 'like-post'`, {
                $entityId: entityId,
            })
        });
    } catch (err) {
        logger.error('cannot delete like', err)
        throw err
    }
}

module.exports = {
    getLikesForPost,
    addLikeToPost,
    deleteLikeToPost
}