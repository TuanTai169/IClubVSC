const express = require("express");
const router = express.Router();
const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  const { studentCode, password } = req.body;

  //Simple validation
  if (!studentCode || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing studentCode or password" });

  try {
    //Check for existing user
    const user = await User.findOne({ studentCode });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "StudentCode already taken" });

    //All good
    const hashPassword = await argon2.hash(password);
    const newUser = new User({
      studentCode,
      password: hashPassword,
    });
    await newUser.save();

    //Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
  const { studentCode, password } = req.body;

  //Simple validation
  if (!studentCode || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing studentCode or password" });

  try {
    //Check for existing user
    const user = await User.findOne({ studentCode });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Incorrect student code ",
      });

    //StudentCode found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });

    //All good
    //Return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: " User logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
