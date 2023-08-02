const express = require("express");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();

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

// routes
app.use(blogRouter);
app.use("/admin", adminRouter);
app.use(authRouter);

const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then((result) => {
    console.log("Connected to the database successfully!");
    app.listen(port, () => {
      console.log(`Server is running on -> http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
