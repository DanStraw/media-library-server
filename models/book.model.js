const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  authors: {
    type: Array
  },
  bookDBID: {
    type: String,
    unique: true
  },
  genres: {
    type: Array
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
  },
  page_count: {
    type: Number
  },
  mature_rating: {
    type: String
  }
},
)

module.exports = mongoose.model("Book", BookSchema, "books")