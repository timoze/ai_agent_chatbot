# AI Chat Assistant

A modern, responsive web application that allows users to interact with AI using natural language. Built with Next.js, FastAPI, and integrated with a large language model API.

## Features

- 💬 Real-time chat interface with AI responses
- 🌓 Dark/Light mode toggle
- 📱 Fully responsive design
- ⚡ Fast API backend with proper error handling
- 📝 Chat history visualization
- 🔄 Loading states and smooth transitions

## Tech Stack

### Frontend
- **Next.js** - React framework for building the UI
- **TailwindCSS** - For styling
- **React Hooks** - For state management

### Backend
- **FastAPI** - High-performance Python web framework
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server implementation
- **LLM Integration** - API integration with a large language model

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── styles/
│   ├── .env.local.example
│   ├── next.config.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env
   ```

5. Edit the `.env` file and add your API keys and configuration.

6. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file by copying the example:
   ```bash
   cp .env.local.example .env.local
   ```

4. Edit the `.env.local` file if needed.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

Once the backend is running, you can access the Swagger documentation at [http://localhost:8000/docs](http://localhost:8000/docs) or ReDoc at [http://localhost:8000/redoc](http://localhost:8000/redoc).

## Prompt Engineering

The following prompts were used to interact with the LLM:

```
# System prompt
You are a helpful AI assistant designed to provide clear, accurate, and concise information. Your responses should be helpful, respectful, and engaging.

# Message generation prompt
Given the user's input: {user_input}
Generate a helpful and informative response while maintaining a conversational tone.
```

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_api_key_here
MODEL_NAME=gpt-4
MAX_TOKENS=1000
LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## License

MIT