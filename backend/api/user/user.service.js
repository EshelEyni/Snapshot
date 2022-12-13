const logger = require('../../services/logger.service')
const db = require('../../database');


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
        var id = ObjectId(user._id)
        delete user._id
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: id }, { $set: { ...user } })
        return { _id: id, ...user }
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    const hashed_password = await bcrypt.hash(user.password, 10)

    try {
        const id = await db.exec(
            `insert into users (username, email,fullname, hashed_password, gender, phone, bio, website, imgUrl) 
             values ($username, $fullname, $email, $hashed_password, $gender, $phone, $bio, $website,  $imgUrl)`,
            {
                $username: user.username,
                $fullname: user.fullname,
                $email: user.email,
                $hashed_password: hashed_password,
                $gender: '',
                $phone: '',
                $bio: '',
                $website: '',
                $imgUrl: '',
            });
        res.send({ 'id': id });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(500).send('error, user already exists: ' + user.username);
            return;
        }
        console.log(err);
        res.status(500).send('error');
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