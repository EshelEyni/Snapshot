const db = require('../../database');
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')


// router.get('/', getUsers)
// router.get('/:id', getUser)

// router.put('/:id', requireAuth, updateUser)
// router.delete('/:id', requireAuth, deleteUser)

router.get('/login', async (req, res) => {
    const { name, password } = req.body;
    const users = await db.query(`select * from users where name = $name`, { $name: name });
    if (users.length === 0) {
        res.status(401).send('user not found');
        return;
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.hashed_password);
    if (!match) {
        res.status(401).send('wrong password');
        return;
    }
    res.send({ 'id': user.id });
});

router.post('/', async (req, res) => {

    const user = req.body;
    const hashed_password = await bcrypt.hash(user.password, 10)

    try {
        const id = await db.exec(
            `insert into users (name, email, hashed_password) 
             values ($name, $email, $hashed_password)`,
            {
                $name: user.name,
                $email: user.email,
                $hashed_password: hashed_password
            });
        res.send({ 'id': id });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(500).send('error, user already exists: ' + user.name);
            return;
        }
        console.log(err);
        res.status(500).send('error');
    }
});


module.exports = router