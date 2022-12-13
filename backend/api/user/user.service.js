const logger = require('../../services/logger.service')
const db = require('../../database');
const bcrypt = require('bcrypt');



async function query() {
    try {


        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ '_id': ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}
async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ '_id': ObjectId(userId) })
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
    const hashed_password = await bcrypt.hash(user.password, 10)

    try {
        const id = await db.exec(
            `insert into users (user_name, email,full_name, hashed_password, gender, phone, bio, website, img_url) 
             values ($user_name, $full_name, $email, $hashed_password, $gender, $phone, $bio, $website,  $img_url)`,
            {
                $user_name: user.username,
                $full_name: user.fullname,
                $email: user.email,
                $hashed_password: hashed_password,
                $gender: '',
                $phone: '',
                $bio: '',
                $website: '',
                $img_url: '',
            });
        return id;
    } catch (err) {
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