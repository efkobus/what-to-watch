import { Request, Response, RequestHandler } from 'express';
import { tmdbService } from '../services/tmdbService';

interface SearchQuery {
  query?: string;
}

interface TypeQuery {
  type?: string;
}

interface MovieParams {
  id: string;
}

interface TrendingQuery {
  mediaType?: 'all' | 'movie' | 'tv';
  timeWindow?: 'day' | 'week';
}

export const moviesController = {
  search: (async (req: Request<{}, {}, {}, SearchQuery>, res: Response) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const results = await tmdbService.searchMulti(query);
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Failed to search movies' });
    }
  }) as RequestHandler<{}, any, any, SearchQuery>,

  getDetails: (async (req: Request<MovieParams, {}, {}, TypeQuery>, res: Response) => {
    try {
      const { id } = req.params;
      const { type = 'movie' } = req.query;

      if (!id) {
        res.status(400).json({ error: 'Movie ID is required' });
        return;
      }

      const movieDetails = await tmdbService.getMovieDetails(id, type);
      res.json(movieDetails);
    } catch (error) {
      console.error('Get movie details error:', error);
      res.status(500).json({ error: 'Failed to get movie details' });
    }
  }) as RequestHandler<MovieParams, any, any, TypeQuery>,

  getTrending: (async (req: Request<{}, {}, {}, TrendingQuery>, res: Response) => {
    try {
      const { mediaType = 'all', timeWindow = 'week' } = req.query;
      const results = await tmdbService.getTrending(mediaType, timeWindow);
      res.json(results);
    } catch (error) {
      console.error('Get trending error:', error);
      res.status(500).json({ error: 'Failed to get trending content' });
    }
  }) as RequestHandler<{}, any, any, TrendingQuery>,

  getRecommendations: (async (req: Request<MovieParams, {}, {}, TypeQuery>, res: Response) => {
    try {
      const { id } = req.params;
      const { type = 'movie' } = req.query;

      if (!id) {
        res.status(400).json({ error: 'Movie ID is required' });
        return;
      }

      const recommendations = await tmdbService.getRecommendations(id, type);
      res.json(recommendations);
    } catch (error) {
      console.error('Get recommendations error:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  }) as RequestHandler<MovieParams, any, any, TypeQuery>,
};