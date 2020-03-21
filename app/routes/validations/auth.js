const joi = require('joi');

exports.registerValidation = joi.object().keys({
  name: joi
    .string()
    .trim()
    .min(2)
    .required(),
  surname: joi
    .string()
    .trim()
    .min(2)
    .required(),
  email: joi
    .string()
    .email()
    .required(),
  password: joi
    .string()
    .min(6)
    .max(30)
    .required()
});

exports.loginValidation = joi.object().keys({
  email: joi
    .string()
    .email()
    .required(),
  password: joi
    .string()
    .min(6)
    .max(30)
    .required()
});
