/* eslint-disable no-underscore-dangle */
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

// models
const User = require('../models/User').default;

// enums
const userEnums = require('../enums/userEnums');

// helpers

export const register = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        message: userEnums.EMAIL_EXIST,
        email: req.body.email
      });
    }

    const passHash = await hash(req.body.password, 10);

    const newUser = new User({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      date: Date.now(),
      password: passHash
    });

    await newUser.save();

    return res.status(201).json({
      message: userEnums.CREATED
    });
  } catch (err) {
    return res.status(500).json({
      error: err
    });
  }
};

export const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    user = user || Object({ password: '' });

    const result = await compare(req.body.password, user.password);

    if (!result) {
      return res.status(401).json({
        message: userEnums.AUTH_FAILED
      });
    }

    const expires = '6h';
    const token = sign(
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
      message: userEnums.AUTH_SUCCESSFUL,
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

export const findOne = (req, res) => {
  User.findOne({ _id: req.params.id }, { email: 0, password: 0 }, (err, user) => {
    if (err) {
      return res.status(500).json({
        ...err
      });
    }

    return res.status(200).json({
      user
    });
  });
};

export const deleteOne = (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, { state: 1 }, err => {
    if (err) {
      return res.status(500).json({
        ...err
      });
    }

    return res.status(200).json({
      message: userEnums.DELETED
    });
  });
};

export const updateOne = async (req, res) => {
  try {
    const changes = {
      name: req.body.name,
      surname: req.body.surname
    };

    const user = await User.findOneAndUpdate({ _id: req.params.id }, changes, { new: true });

    if (!user) {
      return res.status(404).json({
        message: userEnums.NOT_FOUND
      });
    }

    return res.status(200).json({
      message: userEnums.UPDATED,
      changes
    });
  } catch (err) {
    return res.status(500).json({
      error: err
    });
  }
};