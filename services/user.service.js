const User = require('../models/user.model')

module.exports = {
  getAll(req, res) {
    User.find({}, 'username', (err, users) => {
      this._handleResponse(err, users, res)
    })
  },
  getById(req, res) {
    User.findOne({ _id: req.params.boardId })
      // .populate()
      .exec((err, user) => {
        this._handleResponse(err, user, res)
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