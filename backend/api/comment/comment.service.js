const logger = require('../../services/logger.service')
const db = require('../../database');

async function query() {
    try {
        const comments = await db.query(`select * from comments`);
        return comments
    } catch (err) {
        logger.error('cannot find comments', err)
        throw err
    }
}

async function getById(commentId) {
    try {
        const comments = await db.query(`select * from comments where id = $id`, { $id: commentId });
        if (comments.length === 0) {
            return 'comment not found';
        }
        return comments[0]
    } catch (err) {
        logger.error(`while finding comment ${commentId}`, err)
        throw err
    }
}

async function remove(commentId) {
    try {
        await db.exec(`delete from comments where id = $id`, { $id: commentId });
    } catch (err) {
        logger.error(`cannot remove comment ${commentId}`, err)
        throw err
    }
}

async function update(comment) {
    try {
        await db.exec(`update comments set user_id = $user_id, post_id = $post_id, text = $text, created_at = $created_at, likes = $likes where id = $id`, {
            $user_id: comment.userId,
            $post_id: comment.postId,
            $text: comment.txt,
            $created_at: comment.createdAt,
            $likes: comment.likes,
            $id: comment.id
        })
        return comment
    } catch (err) {
        logger.error(`cannot update comment ${comment._id}`, err)
        throw err
    }
}

async function add(comment) {
    try {
        const result = await db.exec(`insert into comments (user_id, post_id, text, created_at, likes) values ($user_id, $post_id, $text, $created_at, $likes)`, {
            $user_id: comment.userId,
            $post_id: comment.postId,
            $text: comment.txt,
            $created_at: comment.createdAt,
            $likes: comment.likes
        })
        comment.id = result.lastID;
        return comment
    } catch (err) {
        logger.error('cannot insert comment', err)
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