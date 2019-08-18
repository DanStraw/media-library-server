const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  igdb_id: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  genres: {
    type: Array
  },
  release_date: {
    type: Number
  },
  rating: {
    type: Number
  },
  summary: {
    type: String
  },
  franchise: {
    type: String
  },
  platforms: {
    type: Array
  }
})

module.exports = mongoose.model("Game", GameSchema, 'games')