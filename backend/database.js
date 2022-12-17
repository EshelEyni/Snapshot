const sqlite = require('sqlite3').verbose();
const fs = require('fs')
const Mutex = require('async-mutex').Mutex;

const dbMutex = new Mutex();


const db = new sqlite.Database(__dirname + '/data/snapshot.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
    if (err !== null) {
        console.log("unable to open database", err);
        return;
    }
});

db.get("PRAGMA foreign_keys = ON;");

var schema = fs.readFileSync(__dirname + "/schema.sql").toString();
db.exec(schema);

function query(sql, params) {
    return new Promise((resolve, reject) => {
        // console.log("query:", sql, params);
        db.all(sql, params, (err, rows) => {
            if (err != null) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

function exec(sql, params) {
    return new Promise((resolve, reject) => {
        try {
            // console.log("exec:", sql, params);
            db.run(sql, params, function (err) {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function txn(callbcak) {
    return await dbMutex.runExclusive(async () => {
        try {
            await exec("BEGIN TRANSACTION");
            var result = await callbcak();
            await exec("COMMIT");
            return result;
        } catch (e) {
            try {
                await exec("ROLLBACK");
            }
            catch (er) {
                console.log("Failed to rollback transaction: " + er + " (original error: " + e + "!)")
            }
            throw "Failed to commit transaction: " + e;
        }
    });
}

module.exports = {
    query,
    exec,
    txn
};