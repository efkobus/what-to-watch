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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmdbService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
if (!TMDB_API_KEY) {
    console.error('TMDB API key is not set in environment variables');
}
/**
 * Service for interacting with The Movie Database (TMDB) API
 */
exports.tmdbService = {
    /**
     * Search for movies and TV shows
     * @param query Search query
     * @param page Page number (default: 1)
     */
    searchMulti: (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, page = 1) {
        try {
            const response = yield axios_1.default.get(`${TMDB_BASE_URL}/search/multi`, {
                params: {
                    api_key: TMDB_API_KEY,
                    query,
                    page,
                    include_adult: false,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Error searching TMDB:', error);
            throw new Error('Failed to search for content');
        }
    }),
    /**
     * Get details for a specific movie
     * @param id Movie ID
     */
    getMovieDetails: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${TMDB_BASE_URL}/movie/${id}`, {
                params: {
                    api_key: TMDB_API_KEY,
                    append_to_response: 'credits,videos,similar,reviews',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching movie details:', error);
            throw new Error('Failed to get movie details');
        }
    }),
    /**
     * Get details for a specific TV show
     * @param id TV show ID
     */
    getTvDetails: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${TMDB_BASE_URL}/tv/${id}`, {
                params: {
                    api_key: TMDB_API_KEY,
                    append_to_response: 'credits,videos,similar,reviews',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching TV show details:', error);
            throw new Error('Failed to get TV show details');
        }
    }),
    /**
     * Get recommendations for a movie or TV show
     * @param id Content ID
     * @param type Content type (movie or tv)
     */
    getRecommendations: (id, type) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${TMDB_BASE_URL}/${type}/${id}/recommendations`, {
                params: {
                    api_key: TMDB_API_KEY,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching recommendations:', error);
            throw new Error('Failed to get recommendations');
        }
    }),
    /**
     * Get trending movies or TV shows
     * @param mediaType Media type (all, movie, tv)
     * @param timeWindow Time window (day, week)
     */
    getTrending: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (mediaType = 'all', timeWindow = 'week') {
        try {
            const response = yield axios_1.default.get(`${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}`, {
                params: {
                    api_key: TMDB_API_KEY,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching trending content:', error);
            throw new Error('Failed to get trending content');
        }
    }),
};
exports.default = exports.tmdbService;
