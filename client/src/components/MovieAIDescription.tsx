import { useState, useEffect } from 'react';
import * as aiService from '@/service/aiService';

interface MovieAIDescriptionProps {
  movieId: string;
}

export default function MovieAIDescription({ movieId }: MovieAIDescriptionProps) {
  const [aiDescription, setAiDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAIDescription = async () => {
      try {
        setLoading(true);
        const response = await aiService.enhanceMovieDescription(movieId);
        setAiDescription(response.data.description);
        setError(null);
      } catch (err) {
        setError('Failed to load AI-enhanced description');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAIDescription();
  }, [movieId]);

  if (loading) return <div className="animate-pulse h-24 bg-gray-200 rounded"></div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">AI-Enhanced Analysis</h3>
      <p className="text-gray-700">{aiDescription}</p>
    </div>
  );
}