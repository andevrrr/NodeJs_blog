const express = require('express');
require('dotenv').config();

const app = express();

// routes
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const blogRouter = require('./routes/blog');

// ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

// routes
app.use(blogRouter);
app.use('/admin', adminRouter);
app.use(authRouter);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on -> http://localhost:${port}`);
})