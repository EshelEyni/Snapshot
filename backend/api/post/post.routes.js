const db = require('../../database');
const express = require('express')
const router = express.Router()


router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const posts = await db.query(`select * from posts where id = $id`, { $id: id });
    if (posts.length === 0) {
        res.status(404).send('post not found');
        return;
    }
    const post = posts[0];
    const images = await db.query(`select * from posts_images where post_id = $post_id`, { $post_id: id });
    post.images = images.map(x => x.image_url);
    post.topComments = await getTopComments(id);
    res.send({ 'post': post });
});

function getTopComments(postId) {
    return db.query(`select * from comments where post_id = $post_id order by likes desc limit 3`, { $post_id: postId });
}

router.post('/:id/comment', async (req, res) => {
    const postId = req.params.id;
    const { userId, text } = req.body;
    const id = await db.exec(
        `insert into comments (user_id, text, date, post_id, likes) 
         values ($user_id, $text, $date , $post,$likes)`,
        {
            $user_id: userId,
            $post: postId,
            $text: text,
            $likes: 0,
            $date: new Date().toISOString()
        });
    res.send({ 'id': id });
});

router.put('/:id/comment/:commentId', async (req, res) => {
    const commentId = req.params.commentId;
    await db.exec(` update comments set likes = likes + 1 where id = $id`, { $id: commentId });
    res.send({ 'id': commentId });
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await db.exec(`delete from posts_images where post_id = $id`, { $id: id });
    await db.exec(`delete from comments where post_id = $id`, { $id: id });
    await db.exec(`delete from posts where id = $id`, { $id: id });
    res.send({ 'id': id });
});


router.post('/', async (req, res) => {
    const { userId, images } = req.body;
    try {
        // todo: check if user exists & auth
        // todo: ensure that we run in a transaction
        const id = await db.exec(
            `insert into posts (user_id, date) 
             values ($user_id, $date)`,
            {
                $user_id: userId,
                $date: new Date().toISOString()
            });
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            await db.exec(
                `insert into posts_images (post_id, image_url) 
                 values ($post_id, $image_url)`,
                {
                    $post_id: id,
                    $image_url: image
                });
        }
        res.send({ 'id': id });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(500).send('error, user does not exists: ' + userId);
            return;
        }
        console.log(err);
        res.status(500).send('error');
    }
});


module.exports = router