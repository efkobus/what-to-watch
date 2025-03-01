import { Router } from 'express';
import { moviesController } from '../controllers/movies';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/search', moviesController.search);
router.get('/trending', moviesController.getTrending);
router.get('/:id', moviesController.getDetails);
router.get('/:id/recommendations', moviesController.getRecommendations);

// Protected routes (future use if needed)
// router.get('/user-recommendations', auth, getUserRecommendations);

export { router as movieRouter };