import Router from 'express';

// validators
import validate from '../controllers/middleware/validateRequest';

// validations
import { registerValidation, loginValidation } from './validations/auth';

// controllers
import { register, login } from '../controllers/userController';

// helpers

const router = Router();

// routes
router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);

export default router;
