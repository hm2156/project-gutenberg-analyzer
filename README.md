# Project Gutenberg Character Analyzer

An AI-powered web application that analyzes character relationships in classic literature from Project Gutenberg books. Discover hidden connections between characters using interactive network visualizations.

## Features

- 📚 **AI-Powered Analysis**: Uses Groq API to analyze character relationships
- 🎨 **Interactive Visualization**: D3.js network graphs showing character connections
- 🌙 **Dark Mode UI**: Modern dark theme with Tailwind CSS
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔍 **Smart Text Sampling**: Handles long books efficiently
- 🚀 **Real-time Analysis**: Fast character relationship detection

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, D3.js
- **Backend**: Groq API (LLM), Project Gutenberg API
- **Build Tools**: Create React App, PostCSS
- **Deployment**: Ready for Vercel, Netlify, or GitHub Pages

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Groq API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hm2156/project-gutenberg-analyzer.git
cd project-gutenberg-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

4. Get your Groq API key from [https://console.groq.com/keys](https://console.groq.com/keys)

5. Start the development server:
```bash
npm start
```

6. Open [http://localhost:3000](http://localhost:3000) to view the application

## Usage

1. Enter a Project Gutenberg book ID (e.g., 11 for Alice's Adventures in Wonderland)
2. Click "Analyze Characters" to start the AI analysis
3. View the interactive character network visualization
4. Explore character relationships and interaction strengths

### Popular Book IDs to Try

- **11** - Alice's Adventures in Wonderland
- **74** - The Adventures of Tom Sawyer
- **46** - A Christmas Carol
- **1661** - The Adventures of Sherlock Holmes
- **2701** - Moby Dick

## How It Works

1. **Book Fetching**: Downloads book content from Project Gutenberg using a CORS proxy
2. **Text Processing**: Cleans and samples the text for AI analysis
3. **AI Analysis**: Uses Groq's LLM to identify characters and their relationships
4. **Visualization**: Creates an interactive D3.js network graph
5. **Display**: Shows character details and relationship descriptions

## Project Structure

```
src/
├── components/
│   ├── BookInput.js          # User input component
│   ├── CharacterNetwork.js   # D3.js visualization
│   ├── LoadingSpinner.js    # Loading indicator
│   └── ResultsDisplay.js     # Results display
├── Gutenberg/
│   └── llmService.js        # Groq API integration
├── services/
│   └── gutenbergApi.js      # Project Gutenberg API
├── App.js                   # Main application component
└── index.js                 # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Project Gutenberg](https://www.gutenberg.org/) for providing free e-books
- [Groq](https://groq.com/) for AI API services
- [D3.js](https://d3js.org/) for data visualization
- [Tailwind CSS](https://tailwindcss.com/) for styling