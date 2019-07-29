const Movie = require('../models/movie.model')

module.exports = {
  addMovie(req, res, next) {
    const movie = new Movie({
      movieDBID: req.body.movie.id,
      adult: req.body.movie.adult,
      title: req.body.movie.title,
      image: req.body.movie.poster_path,
      summary: req.body.movie.overview,
      rating: req.body.movie.vote_average,
      release_date: req.body.movie.release_date
    })
    try {
      movie.save(err => {
        if (err) {
          return res.status(500).send(err)
        }
        req.body.movie_id = movie._id
        res.status(200).send(movie)
        next()
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
      .exec((err, movie) => {
        this._handleResponse(err, movie, res)
      })
  },
  async updateViews(req, res) {
    const id = req.params.movieId
    try {
      const movie = await Movie.findById(id)
      movie.timesViewed++;
      movie.updatedAt = Date.now()
      await movie.save()
      if (!movie) {
        return res.status(404).send();
      }
      res.send(movie);
    } catch (e) {
      res.status(500).send()
    }
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