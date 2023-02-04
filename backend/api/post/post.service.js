const logger = require('../../services/logger.service')
const db = require('../../database');

async function query(filter) {
    try {
        return await db.txn(async () => {
            let posts, userIds, followingIds

            switch (filter.type) {
                case 'createdPosts':
                    if (filter.currPostId) {
                        posts = await db.query(
                            `select * from posts where id != $currPostId and userId = $userId order by createdAt desc limit $limit `, {
                            $limit: filter.limit,
                            $currPostId: filter.currPostId,
                            $userId: filter.userId,
                        });
                    } else {
                        posts = await db.query(
                            `select * from posts where userId = $userId order by createdAt desc limit $limit `, {
                            $limit: filter.limit,
                            $userId: filter.userId,
                        });
                    }
                    break;

                case 'savedPosts':
                    posts = await db.query(
                        `select * from posts where id in (select postId from savedPosts where userId = $userId) order by createdAt desc limit $limit `, {
                        $limit: filter.limit,
                        $userId: filter.userId,
                    });
                    break;

                case 'taggedPosts':
                    const tags = await db.query(`select id from tags where name = $username`, { $username: filter.username });
                    if (!tags.length) return Promise.resolve([]);
                    const tagId = tags[0].id;
                    let taggedPostsIds = await db.query(
                        `select postId from postTags where tagId = $tagId`, {
                        $tagId: tagId
                    });
                    taggedPostsIds = taggedPostsIds.map(post => post.postId);
                    posts = await db.query(
                        `select * from posts where id in (${taggedPostsIds.map(id => `'${id}'`).join(',')}) order by createdAt desc limit $limit `, {
                        $limit: filter.limit,
                    });
                    break;

                case 'homepagePosts':
                    userIds = [filter.userId]
                    followingIds = await db.query(`select toUserId from follow where fromUserId = $id`, { $id: filter.userId });
                    userIds = [...userIds, ...followingIds.map(following => following.toUserId)];

                    if (followingIds.length > 0) {
                        posts = await db.query(
                            `select * from posts where userId in (${userIds.map(id => `'${id}'`).join(',')}) order by createdAt desc limit $limit `, {
                            $limit: filter.limit,
                        });
                    } else {
                        posts = await db.query(
                            `select * from posts order by likeSum desc limit $limit `, {
                            $limit: filter.limit,
                        });
                    }
                    break;
                case 'explorePagePosts':
                    userIds = [filter.userId]
                    followingIds = await db.query(`select userId from following where followerId = $id`, { $id: filter.userId });
                    userIds = [...userIds, ...followingIds.map(following => following.userId)];

                    if (followingIds.length > 0) {
                        posts = await db.query(
                            `select * from posts where userId not in (${userIds.map(id => `'${id}'`).join(',')}) order by createdAt desc limit $limit `, {
                            $limit: filter.limit,
                        });
                    } else {
                        posts = await db.query(
                            `select * from posts where userId != $userId order by likeSum desc limit $limit `, {
                            $limit: filter.limit,
                            $userId: filter.userId,
                        });
                    }
                    break;
                default:
                    break;
            }

            for (const post of posts) {
                if (post.locationId) {
                    post.location = await db.query(`select * from locations where id = $id`, { $id: post.locationId });
                }
                else {
                    post.location = null;
                }
                delete post.locationId;
                const images = await db.query(`select * from postsImgs where postId = $postId order by imgOrder`, { $postId: post.id });
                post.imgUrls = images.map(img => img.imgUrl);
                const tags = await db.query(
                    `select name from tags 
                        join postTags on tags.id = postTags.tagId 
                    where postTags.postId = $postId`, {
                    $postId: post.id
                });
                post.tags = tags.map(tag => tag.name);
                // const users = await db.query(`select id, username, fullname, imgUrl from users where id = $id`, { $id: post.userId });
                const users = await db.query(`
                SELECT 
  users.id, 
  users.username, 
  users.fullname, 
  users.imgUrl, 
  stories.id AS currStoryId, 
  storyViews.userId AS isStoryViewed
FROM 
  users 
  LEFT JOIN stories ON users.id = stories.userId AND stories.isArchived = 0
  LEFT JOIN storyViews ON stories.id = storyViews.storyId AND storyViews.userId = $loggedinUserId
WHERE 
  users.id = $userId`,{ $userId: post.userId, $loggedinUserId: filter.userId})
                if (users.length === 0) throw new Error('user not found: ' + post.userId);
                const user = users[0]
                post.by = user
                post.by.isStoryViewed = !!user.isStoryViewed 
                delete post.userId
            }
            return posts;
        });
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
        post.imgUrls = images.map(img => img.imgUrl);
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
        const user = await db.query(`select id, username, fullname, imgUrl from users where id = $id`, { $id: post.userId });
        post.by = user[0];
        delete post.userId;
        if (post.locationId) {
            post.location = await db.query(`select * from locations where id = $id`, { $id: post.locationId });
        }
        else {
            post.location = null;
        }
        delete post.locationId;

        const tags = await db.query(
            `select name from tags
                join postTags on tags.id = postTags.tagId
            where postTags.postId = $postId`, {
            $postId: postId
        });

        post.tags = tags.map(tag => tag.name);

        return post

    } catch (err) {
        logger.error(`while finding post ${postId}`, err)
        throw err
    }
}

async function remove(postId) {
    try {
        await db.txn(async () => {
            await db.exec(`delete from postsLikedBy where postId = $id`, { $id: postId });
            await db.exec(`delete from savedPosts where postId = $id`, { $id: postId });
            await db.exec(`delete from postTags where postId = $id`, { $id: postId });
            await db.exec(`delete from postsImgs where postId = $id`, { $id: postId });
            /*
            delete from commentsLikedBy where commentId in (
                select id from comments where postId = $id
            )
            */
            const comments = await db.query(`select id from comments where postId = $id`, { $id: postId });
            for (const comment of comments) {
                await db.exec(`delete from commentsLikedBy where commentId = $id`, { $id: comment.id });
            }
            await db.exec(`delete from comments where postId = $id`, { $id: postId });
            await db.exec(`delete from posts where id = $id`, { $id: postId })
        });
    } catch (err) {
        logger.error(`cannot remove post ${postId}`, err)
        throw err
    }
}

async function update(post) {
    try {
        await db.txn(async () => {
            await db.exec(
                `update posts set locationId = $locationId, isLikeShown = $isLikeShown,
                 isCommentShown = $isCommentShown, likeSum = $likeSum, commentSum = $commentSum where id = $id`, {
                $id: post.id,
                $locationId: post.location?.id,
                $isLikeShown: post.isLikeShown,
                $isCommentShown: post.isCommentShown,
                $likeSum: post.likeSum,
                $commentSum: post.commentSum
            });
            await db.exec(`delete from postsImgs where postId = $id`, { $id: post.id });
            for (const i in post.imgUrls) {
                await db.exec(`insert into postsImgs (postId, imgUrl, imgOrder) values ($postId, $imgUrl, $imgOrder)`, {
                    $postId: post.id,
                    $imgUrl: post.imgUrls[i],
                    $imgOrder: i,
                });
            }
            await db.exec(`delete from postTags where postId = $id`, { $id: post.id });
            for (const tag of post.tags) {
                const matches = await db.query('select id from tags where name = $tag', { $tag: tag });
                let tagId = null;
                if (matches.length == 0) {
                    tagId = await db.exec('insert into tags (name) values ($tag)', { $tag: tag });
                }
                else {
                    tagId = matches[0].id;
                }
                await db.exec(`insert into postTags (postId, tagId) values ($postId, $tagId)`, {
                    $postId: post.id,
                    $tagId: tagId
                });
            }
        });
    } catch (err) {
        logger.error(`cannot update post ${post.id}`, err)
        throw err
    }
}

async function add(post) {

    try {
        return await db.txn(async () => {
            const id = await db.exec(
                `insert into posts (userId, createdAt, isLikeShown, isCommentShown, likeSum, commentSum, locationId) 
                 values ($userId, $createdAt, true, true, 0, $commentSum, $locationId)`,
                {
                    $userId: post.by.id,
                    $createdAt: Date.now(),
                    $locationId: post.location.id === 0 ? null : post.location.id,
                    $commentSum: post.commentSum
                });
            for (const i in post.imgUrls) {
                await db.exec(`insert into postsImgs (postId, imgUrl, imgOrder) values ($postId, $imgUrl, $imgOrder)`, {
                    $postId: id,
                    $imgUrl: post.imgUrls[i],
                    $imgOrder: i,
                });
            }
            for (const tag of post.tags) {
                const matches = await db.query('select id from tags where name = $tag', { $tag: tag });
                let tagId = null;
                if (matches.length == 0) {
                    tagId = await db.exec('insert into tags (name) values ($tag)', { $tag: tag });
                }
                else {
                    tagId = matches[0].id;
                }
                await db.exec(`insert into postTags (postId, tagId) values ($postId, $tagId)`, {
                    $postId: id,
                    $tagId: tagId
                });
            }

            return id;
        });
    } catch (err) {
        logger.error('cannot insert post', err)
        throw err
    }
}

async function addPostToTag(tagId, postId) {
    try {
        await db.exec(`insert into postTags (tagId, postId) values ($tagId, $postId)`, {
            $tagId: tagId,
            $postId: postId
        });
    } catch (err) {
        logger.error(`cannot add post ${postId} to tag ${tagId}`, err)
        throw err
    }
}

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    addPostToTag
}