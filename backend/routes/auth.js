const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'farishisagoodboy';

//ROUTE 1 : Creating a user using : POST "/api/auth/createuser"
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Should be 7 letter atleast").isLength({
      min: 7,
    }),
  ],
  async (req, res) => {
    //If there is error, return 400 bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check if user with this email exist
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry user with this email exists" });
      }
      // Gensalt bcrypt
      const salt = await bcrypt.genSalt(10);
      // Password Hashing with bcrypt
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user:{
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET)
      res.json({authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//ROUTE 2 : Creating a user using : POST "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} =req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res
        .status(400)
        .json({ error: "Please login with correct information" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        return res
        .status(400)
        .json({ error: "Please login with correct information" });
      }

      const data = {
        user:{
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET)
      res.json({authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  })

  //ROUTE 3 : Get logged in details : POST "/api/auth/getuser"
  router.post(
    "/getuser", fetchuser, async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }

  })

module.exports = router
