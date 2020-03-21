const router = require('express').Router();

// controllers
const userController = require('../controllers/userController');

// validations
const authValidations = require('./validations/auth');

// validators
const validate = require('../controllers/middleware/validateRequest');

// routes
router.post('/register', validate(authValidations.registerValidation), userController.register);
router.post('/login', validate(authValidations.loginValidation), userController.login);

module.exports = router;
