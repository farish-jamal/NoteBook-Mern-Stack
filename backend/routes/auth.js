const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Creating a user using : POST "/api/auth":
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
      user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      });
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

module.exports = router;
