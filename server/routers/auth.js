const express = require("express");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const {
  status
} = require("express/lib/response");
const session = require('express-session');

const router = express.Router();

const saltRounds = 10;

// Sign in
router.post("/register", async (req, res) => {
  try {
    // hash password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // see if user already exists
    const user = await User.findOne({
      username: req.body.username
    });
    if (user) {
      return res.status(400).json("User already exists");
    }

    const emailUser = await User.findOne({
      email: req.body.email
    });
    if (emailUser) {
      return res.status(400).json("Email already exists");
    }

    // generate new User
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // save User
    const userSaved = await newUser.save();
    res.status(200).json(userSaved);

  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {

    // console.log(req.session);
    // return;
    
    var user = await User.findOne({
      username: req.body.username
    });
    // if username is email, find the user by email
    if(!user){
      user = await User.findOne({
        email: req.body.username
      })
    }
    !user && res.status(404).json("User not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    !validPassword && res.status(400).json("Wrong password");

    // generate session
    req.session.regenerate((err) => {
      if (err) {
        console.log(err);
      }else{
        req.session.user = user;
      }
    });
    
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
})

// log out
router.get("/logout", async (req, res) => {
  try {
    req.session.destroy(
      (err)=>{
        if(err){
          console.log(err);
        }
      }
    );
    res.status(200).json("Log out successfully");
  } catch (error) {
    console.log(error);
  }
});



module.exports = router, saltRounds;