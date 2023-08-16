const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
    validationErrors: [],
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;

  const user = await User.findOne({ email: email });
  if (!user) {
    const error = new Error("A user does not exist");
    error.statusCode = 401;
    throw error;
  }
  loadedUser = user;
  try {
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      "somesecrettoken",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token: token,
      userId: loadedUser._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  console.log("message: ");
  console.log(message);
  res.render("auth/signup", {
    pageTitle: "SignUp",
    path: "/signup",
    errorMessage: message,
    validationErrors: [],
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postSignUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = error.array();
    throw error;
  }

  // if (!errors.isEmpty()) {
  //   console.log(errors.array());
  //   return res.status(422).render("auth/signup", {
  //     pageTitle: "SignUp",
  //     path: "signup",
  //     errorMessage: errors.array()[0].msg,
  //     validationErrors: [{ param: "email", param: "password" }],
  //     oldInput: {
  //       email: email,
  //       password: password,
  //       confirmPassword: req.body.confirmPassword,
  //     },
  //   });
  // }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
    });
    const result = await user.save();
    res.status(201).json({
      message: "User created!",
      userId: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postLogout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect("/");
    });
  } else {
    console.log("Not logged in");
  }
};
