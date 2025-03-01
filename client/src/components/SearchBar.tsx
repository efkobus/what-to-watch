'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className={`flex w-full max-w-3xl rounded-full overflow-hidden shadow-lg transition-all ${className}`}
    >
      <input
        type="text"
        placeholder="Search for movies, TV shows, actors..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-6 py-3 outline-none text-gray-700"
        aria-label="Search"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 transition-colors"
        aria-label="Submit search"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
