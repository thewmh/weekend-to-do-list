const express = require('express');
const toDoRouter = express.Router();

// database connection

const pg = require('pg');
const url = require('url');

const Pool = pg.Pool;

let config = {};

if (process.env.DATABASE_URL) {
    const params = url.parse(process.env.DATABASE_URL);
    const auth = params.auth.split(':');

    config = {
        user: '',
        password: '',
        host: '',
        port: '',
        database: '',
        ssl: true,
        max: 10,
        idleTimeoutMillis: 30000,
    }
} else {
    config = {
        database: 'weekend-to-do-app',
        host: 'localhost',
        port: 5432,
        max: 10,
        idleTimeoutMillis: 30000,
    }
}

const pool = new Pool(config);

pool.on('connect', () => {
    console.log('connected to the database');
});

pool.on('error', () => {
    console.log('error connecting to the database', error);
});

// GET Route

toDoRouter.get('/', (req, res) => {
    const sqlText = 'SELECT * FROM to_do_list ORDER BY id;';
    pool.query(sqlText)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`There was an error making the database query: ${sqlText}`, error);
            res.sendStatus(500);
        })
})

// POST Route

toDoRouter.post('/', (req, res) => {
    const newToDo = req.body;
    const sqlText = `INSERT INTO to_do_list (task_desc, completed) VALUES ($1, $2);`;
    pool.query(sqlText, [newToDo.task_desc, newToDo.completed])
    .then((result) => {
        console.log('added to-do to database', result);
        res.sendStatus(201);
    }).catch((error) => {
        console.log(`There was an error making the database query: ${sqlText}`, error);
        res.sendStatus(500);
    })
})

// PUT Route

toDoRouter.put('/:id', (req, res) => {
    let toDoID = req.params.id;
    let toDoEdit = req.body;
    console.log(toDoEdit, toDoID);
    let sqlText = `UPDATE to_do_list SET completed = '1' WHERE id=$1;`;
    pool.query(sqlText, [toDoID])
    .then((result) => {
        console.log(`Marked ${toDoID} as complete`);
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log(`Error updating ${toDoID} as complete`);
        res.sendStatus(500);
    })
})

// DELETE Route

toDoRouter.delete('/:id', (req, res) => {
    let toDoID = req.params.id;
    let toDoEdit = req.body;
    let sqlText = `DELETE FROM to_do_list WHERE id=$1;`;
    pool.query(sqlText, [toDoID])
    .then((result) => {
        console.log(`Deleted ${toDoID} from the list`);
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log(`There was an error deleting ${toDoID} from the list`);
        res.sendStatus(500);
    })
})

module.exports = toDoRouter;