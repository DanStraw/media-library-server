const Movie = require('../models/movie.model')
const MovieDB = require('moviedb')(process.env.MOVIEDB_API_KEY)

module.exports = {
  async addMovie(req, res, next) {
    console.log('add Move:', req.body)
    MovieDB.searchMovie({ query: req.body.title }, async (err, data) => {
      if (err) {
        return console.log(err)
      }
      if (!data.results) {
        return alert('Movie not Found')
      }
      let movieInfo = data.results[0]
      let movie = await Movie.findOne({ movieDBID: movieInfo.id })
      if (movie) {
        req.body.item_id = movie._id
        req.body.media_type = 'movies'
        next()
      } else {
        const newMovie = new Movie({
          title: movieInfo.title,
          movieDBID: movieInfo.id,
          adult: movieInfo.adult,
          image: movieInfo.poster_path,
          summary: movieInfo.overview,
          rating: movieInfo.vote_average,
          release_date: movieInfo.release_date
        })
        try {
          newMovie.save(err => {
            if (err) {
              return res.status(500).send(err)
            }
            req.body.item_id = newMovie._id
            req.body.media_type = 'movies'
            next()
          })
        } catch (e) {
          res.status(400).send(e)
        }
      }
    })
  },
  async generateDatalist(req, res) {
    const movieTitle = req.body.title
    try {
      let movies = []
      MovieDB.searchMovie({ query: movieTitle }, (err, data) => {
        if (err) {
          return res.status(500).send(err)
        }
        movies = data.results.filter((result, i) => i <= 4)
        res.send(movies)
      })
    } catch (e) {
      res.status(400).send(e)
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