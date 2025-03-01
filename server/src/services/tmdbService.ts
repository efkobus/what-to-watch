import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.error('TMDB API key is not set in environment variables');
}

/**
 * Service for interacting with The Movie Database (TMDB) API
 */
export const tmdbService = {
  /**
   * Search for movies and TV shows
   * @param query Search query
   */
  searchMulti: async (query: string) => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
        params: {
          query,
          include_adult: false,
          language: 'en-US',
          page: 1,
        },
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      });

      // Filter and transform the results
      const results = response.data.results
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .map((item: any) => ({
          id: item.id,
          title: item.media_type === 'movie' ? item.title : item.name,
          poster_path: item.poster_path,
          release_date: item.media_type === 'movie' ? item.release_date : item.first_air_date,
          vote_average: item.vote_average,
          media_type: item.media_type,
          overview: item.overview,
        }));

      return results;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  /**
   * Get details for a specific movie or TV show
   * @param id Content ID
   * @param mediaType Content type (movie or tv)
   */
  getMovieDetails: async (id: string, mediaType: string = 'movie') => {
    try {
      const endpoint = mediaType === 'tv' ? 'tv' : 'movie';
      const [details, watchProviders] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/${endpoint}/${id}`, {
          params: {
            append_to_response: 'credits,videos',
          },
          headers: {
            Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          },
        }),
        tmdbService.getWatchProviders(id, mediaType),
      ]);

      // Transform the response to handle both movies and TV shows
      const data = {
        ...details.data,
        title: mediaType === 'tv' ? details.data.name : details.data.title,
        release_date: mediaType === 'tv' ? details.data.first_air_date : details.data.release_date,
        runtime: mediaType === 'tv' ? (details.data.episode_run_time?.[0] ?? null) : details.data.runtime,
        watchProviders: watchProviders,
        media_type: mediaType,
      };

      return data;
    } catch (error) {
      console.error('Error fetching details:', error);
      throw error;
    }
  },

  /**
   * Get watch providers for a specific movie or TV show
   * @param id Content ID
   * @param mediaType Content type (movie or tv)
   */
  getWatchProviders: async (id: string, mediaType: string = 'movie') => {
    try {
      const endpoint = mediaType === 'tv' ? 'tv' : 'movie';
      const response = await axios.get(
        `${TMDB_BASE_URL}/${endpoint}/${id}/watch/providers`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          },
        }
      );
      return response.data.results?.US ?? null;
    } catch (error) {
      console.error('Error fetching watch providers:', error);
      return null;
    }
  },

  /**
   * Get trending movies and TV shows
   * @param mediaType Type of media to get trending items for (all, movie, or tv)
   * @param timeWindow Time window to get trending items for (day or week)
   */
  getTrending: async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          },
        }
      );

      // Transform the results to match our standard format
      const results = response.data.results.map((item: any) => ({
        id: item.id,
        title: item.media_type === 'movie' ? item.title : item.name,
        poster_path: item.poster_path,
        release_date: item.media_type === 'movie' ? item.release_date : item.first_air_date,
        vote_average: item.vote_average,
        media_type: item.media_type,
        overview: item.overview,
      }));

      return results;
    } catch (error) {
      console.error('Error fetching trending:', error);
      throw error;
    }
  },

  /**
   * Get recommendations for a movie or TV show
   * @param id Content ID
   * @param mediaType Content type (movie or tv)
   */
  getRecommendations: async (id: string, mediaType: string = 'movie') => {
    try {
      const endpoint = mediaType === 'tv' ? 'tv' : 'movie';
      const response = await axios.get(
        `${TMDB_BASE_URL}/${endpoint}/${id}/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          },
        }
      );

      // Transform the results to match our standard format
      const results = response.data.results.map((item: any) => ({
        id: item.id,
        title: mediaType === 'movie' ? item.title : item.name,
        poster_path: item.poster_path,
        release_date: mediaType === 'movie' ? item.release_date : item.first_air_date,
        vote_average: item.vote_average,
        media_type: mediaType,
        overview: item.overview,
      }));

      return results;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },
};

export default tmdbService;