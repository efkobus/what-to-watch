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
exports.enhanceMovieDescription = void 0;
const axios_1 = __importDefault(require("axios"));
const openai_1 = require("openai");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const configuration = new openai_1.Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const enhanceMovieDescription = (movieId_1, ...args_1) => __awaiter(void 0, [movieId_1, ...args_1], void 0, function* (movieId, type = 'movie') {
    var _a, _b, _c, _d, _e, _f;
    try {
        // Get movie data from TMDB
        const movieData = yield axios_1.default.get(`${TMDB_BASE_URL}/${type}/${movieId}`, {
            params: {
                api_key: TMDB_API_KEY,
                append_to_response: 'credits,reviews'
            }
        });
        const { title, name, overview, genres, vote_average, release_date, first_air_date } = movieData.data;
        const movieTitle = title || name;
        const releaseYear = release_date ? new Date(release_date).getFullYear()
            : first_air_date ? new Date(first_air_date).getFullYear()
                : 'Unknown';
        const genreNames = genres.map((genre) => genre.name).join(', ');
        const director = ((_c = (_b = (_a = movieData.data.credits) === null || _a === void 0 ? void 0 : _a.crew) === null || _b === void 0 ? void 0 : _b.find((person) => person.job === 'Director')) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown';
        const cast = ((_e = (_d = movieData.data.credits) === null || _d === void 0 ? void 0 : _d.cast) === null || _e === void 0 ? void 0 : _e.slice(0, 3).map((person) => person.name).join(', ')) || 'Unknown';
        // Generate enhanced description with OpenAI
        const promptText = `
      Create a compelling and insightful analysis for "${movieTitle}" (${releaseYear}).
      
      Basic information:
      - Genres: ${genreNames}
      - Director: ${director}
      - Main cast: ${cast}
      - Rating: ${vote_average}/10
      
      Original overview: "${overview}"
      
      Write a rich description that includes:
      1. A brief analysis of its significance in film/TV history
      2. Commentary on cinematic elements like direction, acting, and themes
      3. How it compares to similar movies/shows in the genre
      4. What type of audience would enjoy it most
      
      Format this as a conversational, engaging paragraph that feels like a knowledgeable friend's recommendation. Keep it under 250 words.
    `;
        const completion = yield openai.createCompletion({
            model: "text-davinci-003",
            prompt: promptText,
            max_tokens: 500,
            temperature: 0.7,
        });
        // Add null check to handle potential undefined values
        if (!completion.data.choices || completion.data.choices.length === 0) {
            throw new Error('No completion choices returned from OpenAI');
        }
        return ((_f = completion.data.choices[0].text) === null || _f === void 0 ? void 0 : _f.trim()) || 'No description generated';
    }
    catch (error) {
        console.error('Error enhancing movie description:', error);
        throw new Error('Failed to generate AI-enhanced description');
    }
});
exports.enhanceMovieDescription = enhanceMovieDescription;
