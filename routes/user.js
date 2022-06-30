const express = require("express");
const passport = require('passport');
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expresserror");
const router = express.Router({ mergeParams: true });
const users = require("../controllers/users");

router.route("/register")
    .get(users.registerForm)
    .post(catchAsync(users.registerUser));
router.route("/login")
    .get(users.loginForm)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.loginUser);
router.get("/logout", users.logoutUser);

module.exports = router;
