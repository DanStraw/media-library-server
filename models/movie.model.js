const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  movieDBID: {
    type: Number,
    unique: true
  },
  adult: {
    type: Boolean
  },
  image: {
    type: String
  },
  summary: {
    type: String
  },
  rating: {
    type: Number
  },
  release_date: {
    type: String
  }
},
)

module.exports = mongoose.model("Movie", MovieSchema, "movies")