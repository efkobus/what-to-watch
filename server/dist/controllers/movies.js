"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrending = exports.getRecommendations = exports.getMovieDetails = exports.searchMovies = void 0;
const tmdbService_1 = require("../services/tmdbService");
const searchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, page = 1 } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }
        const results = yield tmdbService_1.tmdbService.searchMulti(query, Number(page));
        return res.json(results);
    }
    catch (error) {
        console.error('Error searching movies:', error);
        return res.status(500).json({ message: 'Failed to search movies' });
    }
});
exports.searchMovies = searchMovies;
const getMovieDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const type = req.query.type || 'movie';
        if (type === 'movie') {
            const movieDetails = yield tmdbService_1.tmdbService.getMovieDetails(id);
            return res.json(movieDetails);
        }
        else if (type === 'tv') {
            const tvDetails = yield tmdbService_1.tmdbService.getTvDetails(id);
            return res.json(tvDetails);
        }
        else {
            return res.status(400).json({ message: 'Invalid content type. Must be "movie" or "tv"' });
        }
    }
    catch (error) {
        console.error('Error getting content details:', error);
        return res.status(500).json({ message: 'Failed to get content details' });
    }
});
exports.getMovieDetails = getMovieDetails;
const getRecommendations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const type = req.query.type || 'movie';
        if (type !== 'movie' && type !== 'tv') {
            return res.status(400).json({ message: 'Invalid content type. Must be "movie" or "tv"' });
        }
        const recommendations = yield tmdbService_1.tmdbService.getRecommendations(id, type);
        return res.json(recommendations);
    }
    catch (error) {
        console.error('Error getting recommendations:', error);
        return res.status(500).json({ message: 'Failed to get recommendations' });
    }
});
exports.getRecommendations = getRecommendations;
const getTrending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaType = req.query.mediaType || 'all';
        const timeWindow = req.query.timeWindow || 'week';
        const trending = yield tmdbService_1.tmdbService.getTrending(mediaType, timeWindow);
        return res.json(trending);
    }
    catch (error) {
        console.error('Error getting trending content:', error);
        return res.status(500).json({ message: 'Failed to get trending content' });
    }
});
exports.getTrending = getTrending;
