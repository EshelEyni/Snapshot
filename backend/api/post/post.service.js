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
        const images = await db.query(`select * from posts_images where post_id = $post_id`, { $post_id: postId });
        post.images = images.map(img => img.image_url);
        const comments = await db.query(`select * from comments where post_id = $post_id`, { $post_id: postId });
        post.comments = comments.map(comment => {
            return {
                id: comment.id,
                userId: comment.user_id,
                postId: comment.post_id,
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
        await db.exec(`delete from posts_images where post_id = $id`, { $id: postId });
        await db.exec(`delete from comments where post_id = $id`, { $id: postId });
        await db.exec(`delete from posts where id = $id`, { $id: postId })
    } catch (err) {
        logger.error(`cannot remove post ${postId}`, err)
        throw err
    }
}

async function update(post) {
    try {
        await db.exec(`update posts set user_id = $user_id, created_at = $created_at where id = $id`, {
            $user_id: post.userId,
            $created_at: post.createdAt,
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
        const id = await db.exec(`insert into posts (user_id, created_at) values ($user_id, $created_at)`,
            {
                $user_id: post.userId,
                $created_at: post.createdAt
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
