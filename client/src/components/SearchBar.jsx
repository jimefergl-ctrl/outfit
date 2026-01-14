import { useState } from 'react';

const EXAMPLE_SEARCHES = [
  'purses inspired by Chanel',
  'elegant black dress',
  'casual summer outfit',
  'vintage bohemian skirt',
  'designer style heels'
];

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    onSearch(example);
  };

  return (
    <div className="card p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for style inspiration... e.g., 'purses inspired by Chanel'"
            className="input-field flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary whitespace-nowrap"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching...
              </span>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">Try these searches:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_SEARCHES.map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
