const express = require('express');
require('dotenv').config();

const app = express();

app.use('/', (req, res, next) => {
    res.send('Hi Node');
})

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on -> http://localhost:${port}`);
})