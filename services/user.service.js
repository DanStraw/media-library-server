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
      let user = await User.findOne({ _id: req.params.id })

      let activeLibraries = ['albums', 'books', 'games', 'movies']
      activeLibraries = activeLibraries.filter(library => {
        return user[`${library}`].length !== 0
      })
      switch (activeLibraries.length) {
        case 4:
          User.findOne({ _id: req.params.id })
            .populate({ path: `${activeLibraries[0]}.itemInfo` }).populate({ path: `${activeLibraries[1]}.itemInfo` }).populate({ path: `${activeLibraries[2]}.itemInfo` }).populate({ path: `${activeLibraries[3]}.itemInfo` })
            .exec(async (err, user) => {
              user = await user.getPublicProfile()
              this._handleResponse(err, user, res)
            })
          break;
        case 3:
          User.findOne({ _id: req.params.id })
            .populate({ path: `${activeLibraries[0]}.itemInfo` }).populate({ path: `${activeLibraries[1]}.itemInfo` }).populate({ path: `${activeLibraries[2]}.itemInfo` })
            .exec(async (err, user) => {
              user = await user.getPublicProfile()
              this._handleResponse(err, user, res)
            })
          break;
        case 2:
          User.findOne({ _id: req.params.id })
            .populate({ path: `${activeLibraries[0]}.itemInfo` }).populate({ path: `${activeLibraries[1]}.itemInfo` })
            .exec(async (err, user) => {
              user = await user.getPublicProfile()
              this._handleResponse(err, user, res)
            })
          break;
        case 1:
          User.findOne({ _id: req.params.id })
            .populate({ path: `${activeLibraries[0]}.itemInfo` })
            .exec(async (err, user) => {
              user = await user.getPublicProfile()
              this._handleResponse(err, user, res)
            })
          break;
        default:
          User.findOne({ _id: req.params.id })
            .exec(async (err, user) => {
              user = await user.getPublicProfile()
              this._handleResponse(err, user, res)
            })
          break;
      }
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
      res.status(400).send(e);
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
  async addToUserLibrary(req, res) {
    try {
      const newItem = {
        itemInfo: req.body.item_id,
        format: req.body.format,
        updated_at: new Date().getTime()
      }
      const user = await User.findOne({ _id: req.body.user._id })
      if (user[req.body.media_type]) {
        const existingItem = user[req.body.media_type].forEach(item => {
          if (item.itemInfo === newItem.itemInfo) {
            return item
          }
        })
        if (!existingItem) {
          user[req.body.media_type].push(newItem)
        }
      } else {
        user[req.body.media_type].push(newItem)
      }
      user.save()
      res.status(201).send(req.body.newItemTitle)
    } catch (e) {
      return res.status(500).send(e)
    }
  },
  async updateCount(req, res) {
    try {
      const _item_id = req.body._item_id
      const media_type = req.body.media_type
      const user = await User.findById(req.body._user_id)
      user[media_type].forEach((item, i) => {
        if (_item_id == item._id) {
          user[media_type][i][`${req.body.media_action}Count`]++;
          user[media_type][i].updated_at = new Date().getTime();
        }
      })
      user.save()
      return res.send(user)
    } catch (e) {
      return res.status(500).send(e)
    }
  },
  async deleteItem(req, res) {
    try {
      const _item_id = req.body._item_id
      const media_type = req.body.media_type
      let user = await User.findById(req.body.user._id)
      user[media_type] = user[media_type].filter(item => item._id != _item_id)
      user.save()
      res.send(user)
    } catch (e) {
      return res.status(500).send(e)
    }
  },
  _handleResponse(err, data, res) {
    if (err) {
      res.status(400).send()
    } else {
      res.send(data)
    }
  }
}