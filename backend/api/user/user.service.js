const logger = require('../../services/logger.service')
const db = require('../../database');
const bcrypt = require('bcrypt');

async function query(queryParams) {
    try {
        if (!queryParams.searchTerm) {
            const { type, userId } = queryParams;
            if (type === 'suggested') {
                return await db.txn(async () => {
                    const following = await db.query(`select * from following where followerId = $id`, { $id: userId });
                    const followingIds = following.map(f => f.userId);
                    const suggestedByFollowing = await db.query(
                        `select * from users
                    where id in (select userId from following where followerId in (${followingIds.join(',')}))
                    and id != $id
                    order by username`, { $id: userId });
                    if (suggestedByFollowing.length > 0) return suggestedByFollowing;
                    else {
                        const randomUsers = await db.query(
                            `select * from users
                        where id != $id
                        order by random()
                        limit 5`, { $id: userId });
                        return randomUsers;
                    }
                });
            }
            return await db.query(`select * from users order by username`);
        }

        return await db.query(
            `select * from users 
             where username like $searchTerm
                or email like $searchTerm 
                or bio like $searchTerm
             order by username`, { $searchTerm: queryParams.searchTerm + '%' });

    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        return await db.txn(async () => {
            const users = await db.query(`select * from users where id = $id`, { $id: userId });
            if (users.length === 0) {
                throw 'user with id #' + userId + ' was not found'
            }
            const user = users[0];

            const currStoryId = await db.query(
                `select * from stories 
                    where userId = $id 
                    order by createdAt asc
                    limit 1 `, { $id: userId })
            if (currStoryId.length > 0) {
                user.currStoryId = currStoryId[0].id;
            }
            else {
                user.currStoryId = null;
            }
            return user
        });

    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const users = await db.query(`select * from users where username = $username`, { $username: username });
        if (users.length === 0) {
            throw 'user with name ' + username + ' was not found';
        }
        const user = users[0];
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}


async function remove(userId) {
    try {
        await db.exec(`delete from followers where followingId = $id`, { $id: userId })
        await db.exec(`delete from following where followerId = $id`, { $id: userId })
        await db.exec(`delete from recentSearches where searcherId = $id`, { $id: userId })
        await db.exec(`delete from savedPosts where userId = $id`, { $id: userId })
        // await db.exec(`delete from postsImgs join posts where userId = $id`, { $id: userId })
        // todo: delete posts with images and comments and likes and stories and storiesImgs and storiesLikes
        await db.exec(`delete from users where id = $id`, { $id: userId })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        await db.exec(`update users set username = $username, fullname = $fullname,
         email = $email, imgUrl = $imgUrl, gender = $gender,
          phone = $phone, bio = $bio, website = $website, followersSum = $followersSum,
           followingSum = $followingSum, postSum = $postSum where id = $id`, {

            $username: user.username,
            $fullname: user.fullname,
            $email: user.email,
            $imgUrl: user.imgUrl,
            $gender: user.gender,
            $phone: user.phone,
            $bio: user.bio,
            $website: user.website,
            $followersSum: user.followersSum,
            $followingSum: user.followingSum,
            $postSum: user.postSum,
            $id: user.id
        })
        return user
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}


async function add(user) {
    try {
        const id = await db.exec(
            `insert into users (username, fullname, email, password, imgUrl, gender, phone, bio, website, followersSum, followingSum, postSum) 
             values ($username, $fullname, $email, $password, $imgUrl, $gender, $phone, $bio, $website, $followersSum, $followingSum, $postSum)`,
            {
                $username: user.username,
                $fullname: user.fullname,
                $email: user.email,
                $password: user.password,
                $imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669376872/user_instagram_sd7aep.jpg',
                $gender: '',
                $phone: '',
                $bio: '',
                $website: '',
                $followersSum: 0,
                $followingSum: 0,
                $postSum: 0,
            });
        return id;
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}


module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}