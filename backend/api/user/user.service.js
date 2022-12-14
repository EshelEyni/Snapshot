const logger = require('../../services/logger.service')
const db = require('../../database');
const bcrypt = require('bcrypt');



async function query() {
    try {
        const users = await db.query(`select * from users`);
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const users = await db.query(`select * from users where id = $id`, { $id: userId });
        if (users.length === 0) {
            return 'user not found';
        }
        const user = users[0];
        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const users = await db.query(`select * from users where user_name = $user_name`, { $user_name: username });
        if (users.length === 0) {
            return 'user not found';
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
        await db.exec(`delete from followers where following_id = $id`, { $id: userId })
        await db.exec(`delete from following where follower_id = $id`, { $id: userId })
        await db.exec(`delete from recent_searches where searcher_id = $id`, { $id: userId })
        await db.exec(`delete from saved_posts where user_id = $id`, { $id: userId })
        // await db.exec(`delete from posts_images join posts where user_id = $id`, { $id: userId })
        // todo: delete posts with images and comments
        await db.exec(`delete from users where id = $id`, { $id: userId })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        await db.exec(`update users set user_name = $user_name, email = $email, full_name = $full_name where id = $id`, {
            $user_name: user.username,
            $full_name: user.fullname,
            $email: user.email,
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
            `insert into users (user_name, email,full_name, password, gender, phone, bio, website, img_url) 
             values ($user_name, $full_name, $email, $password, $gender, $phone, $bio, $website,  $img_url)`,
            {
                $user_name: user.username,
                $full_name: user.fullname,
                $email: user.email,
                $password: user.password,
                $gender: '',
                $phone: '',
                $bio: '',
                $website: '',
                $img_url: '',
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