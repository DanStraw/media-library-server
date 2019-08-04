const User = require('../models/user.model')


module.exports = {
  async createUser(req, res) {
    const user = new User(req.body)
    try {
      await user.save()
      const publicUser = await user.getPublicProfile();
      const token = await user.generateAuthToken();
      res.status(201).send({ user: publicUser, token })
    } catch (e) {
      res.status(400).send(e);
    }
  },
  getAll(req, res) {
    try {
      User.find({}, 'username email', (err, users) => {
        this._handleResponse(err, users, res)
      })
    } catch (e) {
      res.status(400).send(e);
    }

  },
  async getById(req, res) {
    if (req.params.type === 'all') {
      User.findOne({ _id: req.params.id })
        .populate({ path: `movies.itemInfo` }) //add populate of other libraries here to getAll libraries
        .exec(async (err, user) => {
          user = await user.getPublicProfile()
          this._handleResponse(err, user, res)
        })
    } else {
      let user = await User.findById(req.params.id)
      if (user[req.params.type].length === 0) {
        user = await user.getPublicProfile()
        return res.send(user)
      } else {
        User.findOne({ _id: req.params.id })
          .populate({ path: `${req.params.type}.itemInfo` })
          .exec(async (err, user) => {
            user = await user.getPublicProfile()
            console.log('pubUser:', user)
            this._handleResponse(err, user, res)
          })
      }

    }
  },
  async loginUser(req, res) {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      const publicUser = await user.getPublicProfile();
      res.send({ user: publicUser, token: token });
    } catch (e) {
      res.status(400).send();
    }
  },
  async logoutUser(req, res) {
    const user = await User.findById(req.body.user._id)
    try {
      user.tokens = user.tokens.filter((token) => token.token !== req.body.token)
      await user.save();
      res.send();
    } catch (e) {
      res.status(500).send();
    }
  },
  async addMovieToUser(req, res) {
    try {
      const userMovie = {
        itemInfo: req.body.movie_id,
        format: req.body.format,
        updated_at: new Date().getTime()
      }
      const user = await User.findOne({ _id: req.body.user._id })
      user.movies.push(userMovie)
      user.save()
      res.status(201).send(user)
    } catch (e) {
      return res.status(500).send(e)
    }
  },
  async addBookToUser(req, res) {
    try {
      const userBook = {
        itemInfo: req.body.book_id,
        format: req.body.format,
        updated_at: new Date().getTime()
      }
      const user = await User.findOne({ _id: req.body.user._id })
      user.books.push(userBook)
      user.save()
      res.status(201).send(user)
    } catch (e) {
      return res.status(500).send(e)
    }
  },
  async updateMovieViewCount(req, res) {
    try {
      const user = await User.findById(req.body.user._id)
      user.movies.forEach((movie, i) => {
        if (movie._id == req.body.movieId) {
          user.movies[i].viewCount++;
          user.movies[i].updated_at = new Date().getTime();
        }
      })
      user.save()
      res.status(201).send(user)
    } catch (e) {
      res.status(500).send(e)
    }
  },
  async deleteMovie(req, res) {
    req.body.user.movies = req.body.user.movies.filter(movie => movie._id != req.body.movieId)
    req.body.user.save()
    res.send(req.body.user)
  },
  _handleResponse(err, data, res) {
    if (err) {
      res.status(400).send()
    } else {
      res.send(data)
    }
  }
}