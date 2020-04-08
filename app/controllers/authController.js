/* eslint-disable no-underscore-dangle */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// models
const User = require('../models/User').default;

// enums
const authEnums = require('../enums/authEnums');

/**
 * @api {post} /auth/register Register
 * @apiName Register
 * @apiGroup Auth
 *
 * @apiParam {String} email Users email.
 * @apiParam {String} password Users password.
 * @apiParam {String} name Users name.
 * @apiParam {String} surname Users surname.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "$current-success-message",
 *     }
 *
 * @apiError UserMailExist Mail provided by user is used before.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "$current-error-message"
 *       "email" : "$user-email"
 *     }
 */
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

/**
 * @api {post} /auth/login Login
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam {String} email Users email.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} token JWT Token.
 * @apiSuccess {Number} expiresIn JWT Token Lifespan.
 * @apiSuccess {String} userId Mongo Object ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "$current-success-message",
 *       "token": "jwt-token",
 *       "expiresIn": "jwt-token-lifespan",
 *       "userId": : "user-id"
 *     }
 *
 * @apiError AuthFailed User credentials doesn't match
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Found
 *     {
 *       "message": "$current-error-message"
 *     }
 */
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
