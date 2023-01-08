const logger = require('../../services/logger.service')
const db = require('../../database');

async function query(filterBy) {
    try {
        return await db.txn(async () => {
            const tags = await db.query(`select * from tags where name like $name`, { $name: filterBy.name + '%' });

            for (const tag of tags) {
                const postIds = await db.query(`select postId from postTags where tagId = $tagId`, { $tagId: tag.id });
                tag.postIds = postIds.map(postId => postId.postId);
            }
            
            return tags;
        });
    } catch (err) {
        logger.error('cannot find tags', err)
        throw err
    }
}

async function getByName(tagName) {
    try {
        const tags = await db.query(`select * from tags where name = $name`, { $name: tagName });
        if (tags.length === 0) {
            return 'tag not found';
        }
        const tag = tags[0];
        const postIds = await db.query(`select postId from postTags where tagId = $tagId`, { $tagId: tags[0].id });
        tag.postIds = postIds.map(postId => postId.postId);
        return tag
    } catch (err) {
        logger.error(`while finding tag ${tagName}`, err)
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
        const isTagExist = await db.query(`select * from tags where name = $name`, { $name: tag.name });
        if (isTagExist.length > 0) {
            return isTagExist[0].id;
        }

        const id = await db.exec(`insert into tags (name) values ($name)`, {
            $name: tag.name
        })
        return id
    } catch (err) {
        logger.error(`cannot insert tag ${tag._id}`, err)
        throw err
    }
}

module.exports = {
    query,
    getByName,
    remove,
    update,
    add
}