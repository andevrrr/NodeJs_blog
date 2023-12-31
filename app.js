const express = require("express");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const errorController = require("./controllers/error");
const User = require("./models/user");
const multer = require("multer");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIO = require("socket.io");

const app = express();

app.use(cors());

const port = process.env.PORT;
const MONGO_DB_URI = process.env.MONGO_DB_URL;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

// routes
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
const blogRouter = require("./routes/blog");
const { rmSync } = require("fs");

// ejs
app.set("view engine", "ejs");
app.set("views", "views");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cookieParser());
const store = new MongoDBStore({
  uri: MONGO_DB_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { httpOnly: true },
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = "hi";
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

// routes
app.use(authRouter);
app.use(blogRouter);
app.use("/admin", adminRouter);

app.get("/500", errorController.get500);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGO_DB_URI)
  .then((result) => {
    console.log("Connected to the database successfully!");
    const server = app.listen(port);
    
    // Defining CORS options here
    const corsOptions = {
      cors: {
        origin: "http://localhost:3001",  // your client server
        methods: ["GET", "POST"]
      }
    };

    // Passing CORS options to init
    const io = require("./socket").init(server, corsOptions);
    
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
