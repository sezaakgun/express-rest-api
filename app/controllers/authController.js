/* eslint-disable no-underscore-dangle */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// models
const User = require('../models/User').default;

// enums
const authEnums = require('../enums/authEnums');

exports.register = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        message: authEnums.EMAIL_EXIST,
        email: req.body.email
      });
    }

    const passHash = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      date: Date.now(),
      password: passHash
    });

    await newUser.save();

    return res.status(201).json({
      message: authEnums.CREATED
    });
  } catch (err) {
    return res.status(500).json({
      error: err
    });
  }
};

exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    user = user || Object({ password: '' });

    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) {
      return res.status(401).json({
        message: authEnums.AUTH_FAILED
      });
    }

    const expires = '6h';
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id
      },
      process.env.JWT_KEY,
      {
        expiresIn: expires
      }
    );

    return res.status(200).json({
      message: authEnums.AUTH_SUCCESSFUL,
      token,
      expiresIn: expires,
      userId: user._id
    });
  } catch (err) {
    return res.status(500).json({
      ...err
    });
  }
};
