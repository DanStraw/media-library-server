const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  format: {
    type: String
  },
})

module.exports = mongoose.model("Movie", MovieSchema, "movies")