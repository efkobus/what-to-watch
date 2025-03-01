import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { moviesController } from './controllers/movies';
// These routes will be created later
// import { aiRouter } from './routes/ai';
import { userRouter } from './routes/users';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Create router for movies
const movieRouter: Router = express.Router();

// Add routes to router
movieRouter.get('/search', moviesController.search);
movieRouter.get('/:id', moviesController.getDetails);

// Mount routers
app.use('/api/movies', movieRouter);
app.use('/api/users', userRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
