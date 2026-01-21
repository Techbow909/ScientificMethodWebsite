# Scientific Method Website - Gemini AI Setup Guide

## Setup Instructions

### 1. Get Your Gemini API Key
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Click "Create API Key"
- Copy your API key

### 2. Install Dependencies
Open terminal in the project directory and run:
```bash
npm install
```

### 3. Configure Environment
1. Copy `.env.example` to `.env`
2. Paste your Gemini API key in the `.env` file:
```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```

### 4. Start the Server
Run one of these commands:

**For production:**
```bash
npm start
```

**For development (with auto-reload):**
```bash
npm run dev
```

### 5. Access the Website
Open your browser and go to:
```
http://localhost:3000
```

## Features

- **Home Page**: Welcome and navigation
- **Method Page**: 8 steps of the scientific method with expandable cards
- **AI Assistant Page**: Chat with Gemini AI about science and the scientific method
- **About Us**: Information about the guide

## How the AI Assistant Works

1. **Client-side**: You type a question in the chat interface
2. **Server-side**: Your message is securely sent to your Node.js server
3. **API Call**: The server calls Google's Gemini API with your question
4. **Response**: The AI response is sent back to your browser and displayed in the chat

Your API key is **never exposed** to the browser - it's kept safe on your server.

## Project Structure

```
├── index.html        # Main HTML file with chat interface
├── script.js         # Frontend JS with chat functions
├── styles.css        # CSS styling for all pages including chat
├── server.js         # Node.js/Express server with Gemini integration
├── package.json      # Project dependencies
├── .env.example      # Example environment file
├── .gitignore        # Git ignore file
└── README.md         # Project documentation
```

## Troubleshooting

### Server won't start
- Check that port 3000 is not already in use
- Verify `.env` file exists with valid `GEMINI_API_KEY`
- Ensure Node.js is installed: `node --version`

### Chat not working
- Open browser DevTools (F12) and check Console for errors
- Verify server is running: visit `http://localhost:3000/api/health`
- Check that `.env` has the correct API key format

### API Key errors
- Make sure there are no extra spaces in your API key
- Verify the key is from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Next Steps

You can enhance this by:
- Adding conversation history/memory
- Implementing different Gemini models
- Adding message export functionality
- Creating system prompts for specific topics
- Adding rate limiting for API calls
