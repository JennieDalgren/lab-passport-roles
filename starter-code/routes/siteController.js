const express = require("express");
const siteController = express.Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");




//Get to start page
siteController.get("/", (req, res, next) => {
  res.render("index");
});

//Get to signup page
siteController.get("/signup", (req, res, next) =>{
	res.render("passport/signup");
});

//Signup user
siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("login");
      }
    });
  });
});

//Get to login page
siteController.get("/login", (req, res, next) =>{
	res.render("passport/login", {"message": req.flash("error")});
});

//Login user with passport
siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/ironhack/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

module.exports = siteController;
