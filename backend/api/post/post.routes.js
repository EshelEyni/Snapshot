const db = require('../../database');
const express = require('express')
const router = express.Router()

const { getPosts, getPost, updatePost,addPost, deletePost } = require('./post.controller')


router.get('/', getPosts)
router.get('/:id', getPost)
router.put('/:id',  updatePost)
router.post('/',  addPost)
router.delete('/:id', deletePost)



// router.get('/:id', async (req, res) => {
//     const id = req.params.id;
//     const posts = await db.query(`select * from posts where id = $id`, { $id: id });
//     if (posts.length === 0) {
//         res.status(404).send('post not found');
//         return;
//     }
//     const post = posts[0];
//     const images = await db.query(`select * from postsImgs where postId = $postId`, { $postId: id });
//     post.images = images.map(x => x.imgUrl);
//     post.topComments = await getTopComments(id);
//     res.send({ 'post': post });
// });

// function getTopComments(postId) {
//     return db.query(`select * from comments where postId = $postId order by likes desc limit 3`, { $postId: postId });
// }

// router.post('/:id/comment', async (req, res) => {
//     const postId = req.params.id;
//     const { userId, text } = req.body;
//     const id = await db.exec(
//         `insert into comments (userId, text, date, postId, likes) 
//          values ($userId, $text, $date , $post,$likes)`,
//         {
//             $userId: userId,
//             $post: postId,
//             $text: text,
//             $likes: 0,
//             $date: new Date().toISOString()
//         });
//     res.send({ 'id': id });
// });

// router.put('/:id/comment/:commentId', async (req, res) => {
//     const commentId = req.params.commentId;
//     await db.exec(` update comments set likes = likes + 1 where id = $id`, { $id: commentId });
//     res.send({ 'id': commentId });
// })


// router.post('/', async (req, res) => {
//     const { userId, images } = req.body;
//     try {
//         // todo: check if user exists & auth
//         // todo: ensure that we run in a transaction
//         const id = await db.exec(
//             `insert into posts (userId, date) 
//              values ($userId, $date)`,
//             {
//                 $userId: userId,
//                 $date: new Date().toISOString()
//             });
//         for (let i = 0; i < images.length; i++) {
//             const image = images[i];
//             await db.exec(
//                 `insert into postsImgs (postId, imgUrl) 
//                  values ($postId, $imgUrl)`,
//                 {
//                     $postId: id,
//                     $imgUrl: image
//                 });
//         }
//         res.send({ 'id': id });
//     } catch (err) {
//         if (err.code === 'SQLITE_CONSTRAINT') {
//             res.status(500).send('error, user does not exists: ' + userId);
//             return;
//         }
//         console.log(err);
//         res.status(500).send('error');
//     }
// });


module.exports = router