import React, { useState } from 'react';
import BookInput from './components/BookInput';
import LoadingSpinner from './components/LoadingSpinner';
import CharacterNetwork from './components/CharacterNetwork';
import { fetchBook } from './services/gutenbergApi';
import { analyzeCharacters } from './Gutenberg/llmService';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (bookId) => {
    setIsLoading(true);
    setError('');
    setAnalysisResults(null);

    try {
      setLoadingMessage('Downloading book from Project Gutenberg...');
      const bookText = await fetchBook(bookId);
      
      setLoadingMessage('Analyzing characters with AI...');
      const results = await analyzeCharacters(bookText);
      
      setAnalysisResults(results);
      console.log('Analysis complete:', results);
      
    } catch (err) {
      setError(err.message);
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 mt-6 text-left">
            Project Gutenberg Character Analyzer
          </h1>
          <p className="text-lg text-gray-400 text-left">
            Enter a book ID to analyze character relationships using AI
          </p>
        </header>

        <BookInput onAnalyze={handleAnalyze} isLoading={isLoading} className="align-left"/>

        {isLoading && <LoadingSpinner message={loadingMessage} />}

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-900 border border-red-700 rounded-md">
            <p className="text-red-200">{error}</p>
          </div>
        )}

{analysisResults && (
          <div className="mt-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-white">Analysis Complete! </h2>
              <p className="text-lg text-gray-300">
                Found <strong className="text-blue-500">{analysisResults.characters?.length || 0} characters</strong> and{' '}
                <strong className="text-blue-500">{analysisResults.interactions?.length || 0} interactions</strong>
              </p>
            </div>

            
            <CharacterNetwork data={analysisResults} />

            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Main Characters</h3>
                <div className="space-y-3">
                  {analysisResults.characters?.map((char, idx) => (
                    <div key={idx} className="border-l-4 border-blue-400 pl-4 py-2">
                      <div className="font-medium text-lg text-white">{char.name}</div>
                      <div className="text-sm text-gray-400">{char.mentions} mentions</div>
                      <div className="text-sm text-gray-300 mt-1">{char.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Character Relationships</h3>
                <div className="space-y-3">
                  {analysisResults.interactions?.map((rel, idx) => (
                    <div key={idx} className="border-l-4 border-green-400 pl-4 py-2">
                      <div className="font-medium text-lg text-white">
                        {rel.character1} ↔ {rel.character2}
                      </div>
                      <div className="text-sm text-gray-400">
                        Interaction strength: {rel.strength}
                      </div>
                      <div className="text-sm text-gray-300 mt-1">{rel.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;