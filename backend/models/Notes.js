const mongoose = require("mongoose");
const { Schema } = mongoose;

//Creating Schema for Notes:
const NotesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
    default: "General"
  },
  date: {
    type: Date,
    required: Date.now,
  },
});
//Exporting for model:
module.exports = mongoose.model('notes', NotesSchema);