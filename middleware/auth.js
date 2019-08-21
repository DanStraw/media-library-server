const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  try {
    const token = req.body.token || req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send({ Error: 'Please authenticate' });
    }
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) {
      return res.status(401).send({ Error: 'Please authenticate' });
    }
    req.body.token = token;
    req.body.user = user;
    next();
  } catch (e) {
    return res.status(401).send({ Error: e.message });
  }
}

module.exports = auth;