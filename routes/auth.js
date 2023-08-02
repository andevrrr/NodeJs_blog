const express = require("express");

const router = express();

const authController = require("../controllers/auth");
const User = require("../models/user");
const { check } = require("express-validator");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignUp);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail exists already, please pick a different one."
            );
          }
        });
      }),
    check(
      "password",
      "Please enter a password with only numbers and text with at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    check('confirmPassword').custom((value, { req }) => {
      if ((value !== req.body.password)) {
        return Promise.reject("Passwords have to match!");
      }
      return true;
    }),
  ],
  authController.postSignUp
);

router.post('/logout', authController.postLogout);

module.exports = router;
