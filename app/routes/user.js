import Router from 'express';

// middleware
import checkAuth from '../controllers/middleware/checkAuth';

// controllers
import { findOne, updateOne, deleteOne } from '../controllers/userController';

// helpers

const router = Router();

router.get('/:id', checkAuth, findOne);
router.put('/:id', checkAuth, updateOne);
router.delete('/:id', checkAuth, deleteOne);

export default router;
