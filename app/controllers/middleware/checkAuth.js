/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.token = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Expired or invalid token. Please login again'
    });
  }
};
