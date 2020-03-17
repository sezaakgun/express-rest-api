import { object, string } from 'joi';

export const registerValidation = object().keys({
  name: string()
    .trim()
    .min(2)
    .required(),
  surname: string()
    .trim()
    .min(2)
    .required(),
  email: string()
    .email()
    .required(),
  password: string()
    .min(6)
    .max(30)
    .required()
});

export const loginValidation = object().keys({
  email: string()
    .email()
    .required(),
  password: string()
    .min(6)
    .max(30)
    .required()
});
