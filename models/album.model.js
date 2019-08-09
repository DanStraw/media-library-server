const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artists: {
    type: Array
  },
  spotifyID: {
    type: String,
    unique: true
  },
  image: {
    type: String
  },
  release_date: {
    type: String
  },
  tracks: {
    type: Number
  }
})

module.exports = mongoose.model("Album", AlbumSchema, "albums")