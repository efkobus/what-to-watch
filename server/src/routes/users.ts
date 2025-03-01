import express from 'express';
import { register, login, getProfile } from '../controllers/auth';
import { auth } from '../middleware/auth';

const router = express.Router();
router.use(express.json());

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);

export const userRouter = router;