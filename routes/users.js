const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const users = require("../controller/user");
const { Router } = require("express");


router.route("/register")
    .get( users.registerForm)
    .post( catchAsync(users.registerUser))


// router.get("/register", users.registerForm);

// router.post("/register", catchAsync(users.registerUser));

router.route("/login")
    .get( users.loginForm)
    .post( passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), catchAsync(users.loginUser))

// router.get("/login", users.loginForm);

// router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), catchAsync(users.loginUser));

router.get("/logout", users.logout);

module.exports = router;