const express = require("express");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const app = express();

const port = process.env.PORT;
const MONGO_DB_URI = process.env.MONGO_DB_URL;

const store = new MongoDBStore({
    uri: MONGO_DB_URI,
    collection: 'sessions'
});

// routes
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
const blogRouter = require("./routes/blog");

// ejs
app.set("view engine", "ejs");
app.set("views", "views");

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());
// Parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
    session(
        {
            secret: 'my secret',
            resave: false,
            saveUninitialized: false,
            store: store
        }
    )
);
app.use((flash()));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
})

// routes
app.use(blogRouter);
app.use("/admin", adminRouter);
app.use(authRouter);

mongoose
  .connect(MONGO_DB_URI)
  .then((result) => {
    console.log("Connected to the database successfully!");
    app.listen(port, () => {
      console.log(`Server is running on -> http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
