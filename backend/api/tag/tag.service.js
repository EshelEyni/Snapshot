const logger = require('../../services/logger.service')
const db = require('../../database');

async function query(q) {
    try {
        // const tags = await db.query(`select * from tags`);
        if (q) return await db.query(`select * from tags where name like '%${q}%'`);
        else return await db.query(`select * from tags`);

    } catch (err) {
        logger.error('cannot find tags', err)
        throw err
    }
}

async function getById(tagId) {
    try {
        const tags = await db.query(`select * from tags where id = $id`, { $id: tagId });
        if (tags.length === 0) {
            return 'tag not found';
        }
        return tags[0]
    } catch (err) {
        logger.error(`while finding tag ${tagId}`, err)
        throw err
    }
}

async function remove(tagId) {
    try {
        await db.exec(`delete from tags where id = $id`, { $id: tagId });
    } catch (err) {
        logger.error(`cannot remove tag ${tagId}`, err)
        throw err
    }
}

async function update(tag) {
    try {
        await db.exec(`update tags set name = $name where id = $id`, {
            $name: tag.name,
            $id: tag.id
        })
        return tag
    } catch (err) {
        logger.error(`cannot update tag ${tag._id}`, err)
        throw err
    }
}

async function add(tag) {
    try {
        const result = await db.exec(`insert into tags (name) values ($name)`, {
            $name: tag.name
        })
        return result
    } catch (err) {
        logger.error(`cannot insert tag ${tag._id}`, err)
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