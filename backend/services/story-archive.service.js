const db = require('../database.js');
const logger = require('./logger.service.js');

async function setStoryArchive() {

    try {

        await db.txn(async () => {
            const storyArchiveDate = await db.query(`select * from storyArchiveDate`);
            console.log('storyArchiveDate', storyArchiveDate);
            if (storyArchiveDate.length === 0) {
                await db.exec(`insert into storyArchiveDate (date) values ($date)`, { $date: Date.now() });
            } else {
                const lastStoryArchiveDate = storyArchiveDate[0].date;
                const currDate = Date.now();
                const diff = currDate - lastStoryArchiveDate;
                const oneDayTimeStamp = 1000 * 60 * 60 * 24;
                if (diff < oneDayTimeStamp) return;

                const stories = await db.query(`select * from stories where createdAt > $date`, { $date: lastStoryArchiveDate });
                if (stories.length > 0) {

                    const storyIdsToArchive = stories.map(story => {
                        const storyDiff = Math.abs(story.createdAt - currDate);
                        if (storyDiff > oneDayTimeStamp && !story.isArchived) {
                            return story.id
                        } else {
                            return null
                        }
                    }).filter(id => id !== null);
                    console.log('storyIdsToArchive', storyIdsToArchive);
                    if (storyIdsToArchive.length > 0) {
                        await db.exec(`update stories set isArchived = 1 where id in (${storyIdsToArchive.join(',')})`);
                    }
                }
            }
        })

    } catch (err) {
        logger.error(`cannot set story archive`, err)
    }
}

module.exports = {
    setStoryArchive
}