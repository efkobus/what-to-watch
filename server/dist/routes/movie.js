"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieRouter = void 0;
const express_1 = __importDefault(require("express"));
const movies_1 = require("../controllers/movies");
const router = express_1.default.Router();
// Public routes
router.get('/search', movies_1.searchMovies);
router.get('/trending', movies_1.getTrending);
router.get('/:id', movies_1.getMovieDetails);
router.get('/:id/recommendations', movies_1.getRecommendations);
// Protected routes (future use if needed)
// router.get('/user-recommendations', auth, getUserRecommendations);
exports.movieRouter = router;
