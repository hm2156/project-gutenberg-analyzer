# Project Gutenberg Character Analyzer

A web app that analyzes character relationships in Project Gutenberg books using AI.

## Features

- AI-powered character analysis with Groq API
- Interactive network visualization with D3.js
- Dark mode UI with Tailwind CSS
- Works with any Project Gutenberg book ID

## Setup

1. Clone and install:
```bash
git clone https://github.com/hm2156/project-gutenberg-analyzer.git
cd project-gutenberg-analyzer
npm install
```

2. Add your Groq API key to `.env`:
```
REACT_APP_GROQ_API_KEY=your_key_here
```

3. Run:
```bash
npm start
```

## Usage

Enter a Project Gutenberg book ID (like 11 for Alice in Wonderland) and click "Analyze Characters".

## Tech Stack

React, Tailwind CSS, D3.js, Groq API