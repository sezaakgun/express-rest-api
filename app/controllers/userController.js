// models
const User = require('../models/User').default;

// enums
const userEnums = require('../enums/userEnums');

/**
 * @api {get} /users/:id Find User
 * @apiName FindUser
 * @apiGroup Users
 *
 * @apiParam {String} id User id.
 *
 * @apiSuccess {Object} message User Object.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user":
 *        {
 *          "name":"Seza",
 *          "surname": "Akgün",
 *          "date": "2019-10-01T13:27:51.958+00:00"
 *       }
 *     }
 */
exports.find = (req, res) => {
  User.findOne(
    { _id: req.params.id, state: 1 },
    { email: 0, password: 0, state: 0 },
    (err, user) => {
      if (err) {
        return res.status(500).json({
          ...err
        });
      }

      return res.status(200).json({
        user
      });
    }
  );
};

/**
 * @api {get} /users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiParam {String} id User id.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": "$current-success-message"
 *     }
 */
exports.delete = (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, { state: 0 }, err => {
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

/**
 * @api {get} /users/:id Update User
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiParam {String} id User id.
 * @apiParam {String} [name] User id.
 * @apiParam {String} [surname] User id.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": "$current-success-message",
 *      "changes":
 *       {
 *        "name": "Rafet",
 *        "surname": "Topçu"
 *       }
 *     }
 *
 *  @apiError UserNotFound User not Found
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "$current-error-message"
 *     }
 */
exports.update = async (req, res) => {
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
