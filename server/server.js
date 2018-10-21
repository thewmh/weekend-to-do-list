const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const toDoRouter = require('./routes/toDo.router.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

// Router

app.use('/to-do', toDoRouter);

// Start port listening for requests

app.listen(PORT, () => {
    console.log('listening on port', PORT);
})