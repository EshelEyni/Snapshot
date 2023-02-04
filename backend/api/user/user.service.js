const logger = require('../../services/logger.service')
const db = require('../../database')


async function query(queryParams) {
    try {

        let users;
        const { userId, type, limit, searchTerm } = queryParams;

        return await db.txn(async () => {
            if (searchTerm) {
                users = await db.query(
                    `SELECT id, username, fullname, imgUrl FROM users 
                    WHERE username like $searchTerm
                    or email like $searchTerm 
                    or bio like $searchTerm
                    order by username limit 100`,
                    {
                        $searchTerm: queryParams.searchTerm + '%'
                    });
            }
            else if (type === 'suggested') {
                users = await db.query(
                    `WITH CTE AS (
                        SELECT id, username, fullname, imgUrl
                        FROM users
                        WHERE id IN (
                          SELECT dst.toUserId
                          FROM follow AS src
                            JOIN follow AS dst ON src.toUserId = dst.fromUserId
                          WHERE src.fromUserId = $userId
                        )
                        AND id NOT IN (
                          SELECT toUserId
                          FROM follow WHERE fromUserId = $userId
                        )
                      )
                      SELECT *
                      FROM (
                        SELECT * FROM CTE
                        UNION ALL
                        SELECT id, username, fullname, imgUrl
                        FROM users
                        WHERE (SELECT COUNT(*) FROM CTE) = 0
                        AND id != $userId
                        ) sub
                      ORDER BY RANDOM() 
                      LIMIT $limit
                    `, {
                    $userId: userId,
                    $limit: limit
                })
            } else {
                users = await db.query(
                    `SELECT id, username, fullname, imgUrl FROM users
                    order by username limit $limit`, {
                    $limit: limit
                });
            }

            const StoryPrms = users.map(async user => {
                const stories = await db.query(
                    `SELECT * FROM stories
                    WHERE userId = $id
                    and isArchived = 0
                    order by createdAt asc
                    limit 1`, { $id: user.id })

                if (!stories.length) {
                    user.currStoryId = null;
                    return user
                }
            })

            await Promise.all(StoryPrms)

            const storyViewPrms = users.map(async user => {
                if (!user.currStoryId) return user.isStoryViewed = false
                const storyViews = await db.query(
                    `SELECT * FROM storyViews WHERE storyId = $storyId and userId = $userId`,
                    { $storyId: user.currStoryId, $userId: userId }
                )
                user.isStoryViewed = storyViews.length > 0
                return user
            })

            await Promise.all(storyViewPrms)

            return users;
        });

    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        return await db.txn(async () => {
            const users = await db.query(`SELECT * FROM users WHERE id = $id`, { $id: userId });
            if (users.length === 0) {
                throw 'user with id #' + userId + ' was not found'
            }
            const user = users[0];
            user.isDarkMode = !!user.isDarkMode;

            const stories = await db.query(
                `SELECT * FROM stories 
                    WHERE userId = $id 
                    and isArchived = 0
                    order by createdAt asc
                    limit 1 `, { $id: userId })

            if (!stories.length) {
                user.currStoryId = null;
                user.isStoryViewed = false;
                return user
            }


            const currStoryId = stories[0]
            
            const storyViews = await db.query(
                `SELECT * FROM storyViews WHERE storyId = $id and userId = $userId`,
                { $id: currStoryId.id, $userId: userId }
            );

            user.currStoryId = currStoryId.id
            user.isStoryViewed = storyViews.length > 0;

            // delete user.password
            return user
        });

    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const users = await db.query(`SELECT * FROM users WHERE username = $username`, { $username: username });
        if (users.length === 0) {
            throw 'user with name ' + username + ' was not found';
        }
        const user = users[0];
        user.isDarkMode = !!user.isDarkMode;

        const stories = await db.query(
            `SELECT * FROM stories 
                WHERE userId = $id 
                and isArchived = 0
                order by createdAt asc
                limit 1 `, { $id: user.id })

        if (!stories.length) {
            user.currStoryId = null;
            return user
        }

        const currStoryId = stories[0]
        user.currStoryId = currStoryId.id
        delete user.password

        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}


async function remove(userId) {
    try {
        await db.exec(`delete FROM followers WHERE followingId = $id`, { $id: userId })
        await db.exec(`delete FROM following WHERE followerId = $id`, { $id: userId })
        await db.exec(`delete FROM recentSearches WHERE searcherId = $id`, { $id: userId })
        await db.exec(`delete FROM savedPosts WHERE userId = $id`, { $id: userId })
        // await db.exec(`delete FROM postsImgs join posts WHERE userId = $id`, { $id: userId })
        // todo: delete posts with images and comments and likes and stories and storiesImgs and storiesLikes
        await db.exec(`delete FROM users WHERE id = $id`, { $id: userId })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        await db.exec(
            `update users set 
             username = $username,
             fullname = $fullname,
             password = $password,
             email = $email,
             imgUrl = $imgUrl,
             gender = $gender,
             phone = $phone,
             bio = $bio,
             website = $website,
             followersSum = $followersSum,
             followingSum = $followingSum,
             postSum = $postSum,
             isDarkMode = $isDarkMode,
             storySum = $storySum
             WHERE id = $id`, {
            $username: user.username,
            $fullname: user.fullname,
            $password: user.password,
            $email: user.email,
            $imgUrl: user.imgUrl,
            $gender: user.gender,
            $phone: user.phone,
            $bio: user.bio,
            $website: user.website,
            $followersSum: user.followersSum,
            $followingSum: user.followingSum,
            $postSum: user.postSum,
            $isDarkMode: user.isDarkMode ? 1 : 0,
            $storySum: user.storySum,
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
            `insert into users (username, fullname, email, password, imgUrl, gender, phone, bio, website, followersSum, followingSum, postSum, isDarkMode, storySum) 
             values ($username, $fullname, $email, $password, $imgUrl, $gender, $phone, $bio, $website, $followersSum, $followingSum, $postSum, $isDarkMode, $storySum)`,
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
                $isDarkMode: 0,
                $storySum: 0
            });
        return id;
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

async function chekIfUsernameTaken(username) {
    try {
        const users = await db.query(`SELECT * FROM users WHERE username = $username`, { $username: username });
        return users.length > 0
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function checkPassword(userId, password, newPassword) {
    try {

        const users = await db.query(`SELECT * FROM users WHERE id = $userId`, { $userId: userId });
        if (!users.length) {
            throw 'user with id ' + userId + ' was not found';
        }
        const user = users[0];
        const isMatch = password === user.password;
        if (!isMatch) {
            throw 'wrong password';
        }
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
        return hashedPassword;
    } catch (err) {
        logger.error(`while checking user with ${userId} password`, err)
        throw err
    }
}


module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add,
    chekIfUsernameTaken,
    checkPassword
}