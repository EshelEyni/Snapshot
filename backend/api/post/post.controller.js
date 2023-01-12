const postService = require('./post.service')
const logger = require('../../services/logger.service')

async function getPosts(req, res) {
    const filter = req.query
    const isFilter = Object.keys(filter).length > 0
    try {
        const posts = await postService.query(isFilter ? filter : null)
        res.send(posts)
    } catch (err) {
        logger.error('Failed to get posts', err)
        res.status(500).send({ err: 'Failed to get posts' })
    }
}

async function getPost(req, res) {
    try {
        const post = await postService.getById(req.params.id)
        res.send(post)
    } catch (err) {
        logger.error('Failed to get post', err)
        res.status(500).send({ err: 'Failed to get post' })
    }
}

async function deletePost(req, res) {
    try {
        await postService.remove(req.params.id)
        res.send({ msg: 'Post deleted' })
    } catch (err) {
        logger.error('Failed to delete post', err)
        res.status(500).send({ err: 'Failed to delete post' })
    }
}

async function updatePost(req, res) {
    try {
        const post = req.body
        const savedPost = await postService.update(post)
        res.send(savedPost)
    } catch (err) {
        logger.error('Failed to update post', err)
        res.status(500).send({ err: 'Failed to update post' })
    }
}

async function addPost(req, res) {
    try {
        const post = req.body
        const id = await postService.add(post)
        res.send({ msg: 'Post added', id })
    } catch (err) {
        logger.error('Failed to add post', err)
        res.status(500).send({ err: 'Failed to add post' })
    }
}

async function addPostToTag(req, res) {
    try {
        const { postId, tagId } = req.body
        const post = await postService.addPostToTag(tagId, postId)
        res.send(post)
    } catch (err) {
        logger.error('Failed to add post to tag', err)
        res.status(500).send({ err: 'Failed to add post to tag' })
    }
}

module.exports = {
    getPosts,
    getPost,
    deletePost,
    updatePost,
    addPost,
    addPostToTag
}