# Silverfort Full Stack App

A basic Express server with TypeScript and a React frontend with TypeScript.

## Project Structure

```
silverfortFullStack/
├── backend/                 # Express server with TypeScript
│   ├── src/
│   │   └── server.ts       # Main server file
│   ├── package.json        # Backend dependencies
│   ├── tsconfig.json       # TypeScript config for backend
│   └── nodemon.json        # Nodemon configuration
├── frontend/               # React app with TypeScript
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── App.css         # App styles
│   │   ├── index.tsx       # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Frontend dependencies
│   └── tsconfig.json       # TypeScript config for frontend
└── README.md
```

## Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:3001` with nodemon for auto-restart.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
```

The React app will start on `http://localhost:3000` and automatically proxy API requests to the backend.

## Features

- **Backend**: Express server with TypeScript
- **Frontend**: React app with TypeScript
- **Development**: Nodemon for auto-restart, React hot reload
- **API**: CORS enabled, JSON responses
- **Proxy**: Frontend automatically proxies `/api/*` requests to backend

## API Endpoints

- `GET /` - Server status
- `GET /api/hello` - Hello world message
- `GET /api/health` - Health check

## Scripts

### Backend
- `npm run dev` - Start with nodemon (auto-restart)
- `npm run dev:ts` - Start with ts-node
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production build

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests


