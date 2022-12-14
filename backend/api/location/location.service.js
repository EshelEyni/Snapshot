const logger = require('../../services/logger.service')
const db = require('../../database');

async function query() {
    try {
        const locations = await db.query(`select * from locations`);
        return locations
    } catch (err) {
        logger.error('cannot find locations', err)
        throw err
    }
}

async function getById(locationId) {
    try {
        const locations = await db.query(`select * from locations where id = $id`, { $id: locationId });
        if (locations.length === 0) {
            return 'location not found';
        }
        return locations[0]
    } catch (err) {
        logger.error(`while finding location ${locationId}`, err)
        throw err
    }
}

async function remove(locationId) {
    try {
        await db.exec(`delete from locations where id = $id`, { $id: locationId });
    } catch (err) {
        logger.error(`cannot remove location ${locationId}`, err)
        throw err
    }
}

async function update(location) {
    try {
        await db.exec(`update locations set name = $name, lat = $lat, lng = $lng where id = $id`, {
            $name: location.name,
            $lat: location.lat,
            $lng: location.lng,
            $id: location.id
        })
        return location
    } catch (err) {
        logger.error(`cannot update location ${location._id}`, err)
        throw err
    }
}

async function add(location) {
    try {
        const result = await db.exec(`insert into locations (name, lat, lng) values ($name, $lat, $lng)`, {
            $name: location.name,
            $lat: location.lat,
            $lng: location.lng
        })
        return result
    } catch (err) {
        logger.error(`cannot insert location ${location._id}`, err)
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
