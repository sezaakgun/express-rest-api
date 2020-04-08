const router = require('express').Router();

// controllers
const authController = require('../controllers/authController');

// validations
const authValidations = require('./validations/auth');

// validators
const validate = require('../controllers/middleware/validateRequest');

// routes
router.post('/register', validate(authValidations.registerValidation), authController.register);
router.post('/login', validate(authValidations.loginValidation), authController.login);

module.exports = router;
