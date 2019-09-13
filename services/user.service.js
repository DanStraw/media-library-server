const User = require('../models/user.model')

module.exports = {
  async createUser(req, res) {
    console.log('create user', req.body)
    const user = new User(req.body)
    try {
      console.log('user:', user)
      await user.save()
      const publicUser = await user.getPublicProfile();
      const token = await user.generateAuthToken();
      res.status(201).send({ user: publicUser, token })
    } catch (e) {
      console.log('create user error:', e)
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
        let existingItem = await user[req.body.media_type].filter(item => {
          return JSON.stringify(item.itemInfo) === JSON.stringify(newItem.itemInfo)
        })
        if (existingItem.length === 0) {
          user[req.body.media_type].push(newItem)
        } else {
          throw new Error('Item Already in Library')
        }
      } else {
        user[req.body.media_type].push(newItem)
      }
      user.save()
      res.status(201).send(req.body.newItemTitle)
    } catch (e) {
      res.status(409).send(e.message)
    }
  },
  async checkOldPassword(req, res) {
    try {
      const user = await User.findByCredentials(req.body.user.email, req.body.oldPassword);
      if (user) {
        res.status(200).send()
      }
    } catch (e) {
      res.status(401).send(e.message)
    }
  },
  async updatePassword(req, res) {
    try {
      const user = await User.findByCredentials(req.body.user.email, req.body.oldPassword)
      user.password = req.body.newPassword
      user.save()
      res.status(200).send()
    } catch (e) {
      res.status(401).send(e.message)
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
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
          res.status(401).send(err)
        } else {
          res.status(204).send(`${data} deleted`)
        }
      })
    } catch (e) {

      res.status(401).send(e)
    }
  },
  async updateColor(req, res) {
    try {
      let user = await User.findById(req.body.userId)
      user.color = req.body.color;
      user.save()
      return res.status(200).send(user)
    } catch (e) {
      return res.status(400).send(e)
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