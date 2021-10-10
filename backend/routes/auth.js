const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//Creating a user using : POST "/api/auth":
router.post('/', [
     body('name', 'Enter a valid name').isLength({ min: 3 }),
     body('email', 'Enter a valid email').isEmail(),
     body('password', 'Password Should be 7 letter atleast').isLength({ min: 7 }),
], (req, res)=>{
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     User.create({
          name: req.body.name,
          password: req.body.password,
          email: req.body.email,
        }).then(user => res.json(user))
        .catch(err => {console.log(err)
        res.json({error: 'Please enter a valid email', message: err.message})});
})


module.exports = router
