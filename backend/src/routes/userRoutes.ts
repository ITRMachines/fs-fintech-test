import express from 'express';
import * as userController from '../controllers/userController';
import authenticate from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', userController.login);

// Protected routes
router.get('/', authenticate, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);


export default router;