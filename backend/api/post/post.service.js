const logger = require('../../services/logger.service')
const db = require('../../database');

async function query() {
    try {
        const posts = await db.query(`select * from posts`);
        return posts
    } catch (err) {
        logger.error('cannot find posts', err)
        throw err
    }
}


async function getById(postId) {
    try {
        const posts = await db.query(`select * from posts where id = $id`, { $id: postId });
        if (posts.length === 0) {
            return 'post not found';
        }
        const post = posts[0];
        const images = await db.query(`select * from postsImgs where postId = $postId`, { $postId: postId });
        post.images = images.map(img => img.imgUrl);
        const comments = await db.query(`select * from comments where postId = $postId`, { $postId: postId });
        post.comments = comments.map(comment => {
            return {
                id: comment.id,
                userId: comment.userId,
                postId: comment.postId,
                commentText: comment.comment_text,
                commentDate: comment.comment_date
            }
        });
        return post
    } catch (err) {
        logger.error(`while finding post ${postId}`, err)
        throw err
    }
}

async function remove(postId) {
    try {
        await db.exec(`delete from postsImgs where postId = $id`, { $id: postId });
        await db.exec(`delete from comments where postId = $id`, { $id: postId });
        await db.exec(`delete from posts where id = $id`, { $id: postId })
    } catch (err) {
        logger.error(`cannot remove post ${postId}`, err)
        throw err
    }
}

async function update(post) {
    try {
        await db.exec(`update posts set userId = $userId, createdAt = $createdAt where id = $id`, {
            $userId: post.userId,
            $createdAt: post.createdAt,
            $id: post.id
        })
        return post
    } catch (err) {
        logger.error(`cannot update post ${post._id}`, err)
        throw err
    }
}

async function add(post) {
    try {
        const id = await db.exec(`insert into posts (userId, createdAt, likes) values ($userId, $createdAt, $likes)`,
            {
                $userId: post.userId,
                $createdAt: post.createdAt,
                $likes: post.likes
            });

        return id
    } catch (err) {
        logger.error('cannot insert post', err)
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
