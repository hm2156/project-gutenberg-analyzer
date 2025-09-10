import React from 'react';

const LoadingSpinner = ({ message }) => (
  <div className="text-center py-8">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
    <p className="text-lg text-gray-300">{message}</p>
    <p className="text-sm text-gray-400 mt-2">This may take 30-60 seconds...</p>
  </div>
);

export default LoadingSpinner;