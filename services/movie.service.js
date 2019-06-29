const Movie = require('../models/movie.model')

module.exports = {
  addMovie(req, res) {
    const movie = new Movie(req.body)
    try {
      movie.save(err => {
        if (err) {
          return res.status(500).send(err)
        }
        return res.status(200).send(movie)
      })
    } catch (e) {
      res.status(400).send();
    }
  },
  getAll(req, res) {
    Movie.find({}, (err, movies) => {
      this._handleResponse(err, movies, res)
    })
  },
  getById(req, res) {
    Movie.findOne({ _id: req.params.movieId })
      // .populate()
      .exec((err, movie) => {
        this._handleResponse(err, movie, res)
      })
  },
  deleteMovie(req, res) {
    const id = req.params.movieID;
    Movie.findByIdAndDelete(id).exec((err, movie) => {
      this._handleResponse(err, movie, res)
    })
  },
  _handleResponse(err, data, res) {
    if (err) {
      res.status(400).end()
    } else {
      res.send(data)
    }
  }
}