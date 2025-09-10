import React, { useState } from 'react';

const BookInput = ({ onAnalyze, isLoading }) => {
  const [bookId, setBookId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookId.trim()) {
      onAnalyze(bookId.trim());
    }
  };

  const popularBooks = [
    { id: '11', title: "Alice's Adventures in Wonderland" },
    { id: '74', title: "The Adventures of Tom Sawyer" },
    { id: '46', title: "A Christmas Carol" },
    { id: '1661', title: "The Adventures of Sherlock Holmes" },
    { id: '2701', title: "Moby Dick" }
  ];

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Gutenberg Book ID
          </label>
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="e.g., 11"
            className="w-full max-w-md px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        <div className="text-sm text-gray-400">
          <p className="mb-2">Popular books to try:</p>
          <div className="space-y-1">
            {popularBooks.map(book => (
              <button
                key={book.id}
                type="button"
                onClick={() => setBookId(book.id)}
                className="block w-full max-w-md text-left px-2 py-1 hover:bg-gray-700 rounded text-blue-400 hover:text-blue-300 transition-colors"
                disabled={isLoading}
              >
                {book.id} - {book.title}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !bookId.trim()}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Characters'}
        </button>
      </form>
    </div>
  );
};

export default BookInput;