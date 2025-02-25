const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Token kerak!' });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Token noto‘g‘ri yoki muddati o‘tdi!' });
    }

    req.user = decoded;
    next();
  });
};
