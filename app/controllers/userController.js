// models
const User = require('../models/User').default;

// enums
const userEnums = require('../enums/userEnums');

exports.find = (req, res) => {
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

exports.delete = (req, res) => {
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
