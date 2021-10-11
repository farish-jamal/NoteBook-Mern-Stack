const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE 1 : Fetching all notes : GET "/api/notes/getuser"
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});
//ROUTE 2 : Adding a new notes : POST "/api/notes/addnote" . login required
router.get(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be of 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //If there is error, return 400 bad request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savednotes = await note.save();
      res.json(savednotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);

module.exports = router;
