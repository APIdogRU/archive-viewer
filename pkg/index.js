// Node 12
const express = require('express');
const bodyParser = require('body-parser');

const getUsers = require('./get-users');
const { STATIC } = require('./paths');

const port = 12000;

const app = express();

app.post('/api/v4/vk.getUsers', bodyParser.urlencoded({ extended: false }), getUsers);
app.use('/', express.static(STATIC));

app.listen(port, () => {
    const url = `http://localhost:${port}/`;

    console.log(`Server started in: ${url}`);

    require('./open').open(url);
});
