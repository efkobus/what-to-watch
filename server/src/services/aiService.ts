import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const enhanceMovieDescription = async (movieId: string, type: string = 'movie') => {
  try {
    // Get movie data from TMDB
    const movieData = await axios.get(`${TMDB_BASE_URL}/${type}/${movieId}`, {
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
    
    const genreNames = genres.map((genre: any) => genre.name).join(', ');
    const director = movieData.data.credits?.crew?.find((person: any) => person.job === 'Director')?.name || 'Unknown';
    const cast = movieData.data.credits?.cast?.slice(0, 3).map((person: any) => person.name).join(', ') || 'Unknown';
    
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
    
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: promptText,
      max_tokens: 500,
      temperature: 0.7,
    });
    
    // Add null check to handle potential undefined values
    if (!completion.data.choices || completion.data.choices.length === 0) {
      throw new Error('No completion choices returned from OpenAI');
    }
    
    return completion.data.choices[0].text?.trim() || 'No description generated';
  } catch (error) {
    console.error('Error enhancing movie description:', error);
    throw new Error('Failed to generate AI-enhanced description');
  }
};