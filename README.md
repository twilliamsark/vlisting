# YouTube Video Listings App

A React application for storing and managing YouTube video listings. Each listing includes name, URL, technique, and format fields. Features YouTube URL validation and optional thumbnail embedding for better UX. Data is stored locally in the browser.

## Features

- Add new video listings with validation
- Display listings in a table with thumbnails
- Delete listings
- Persistent storage using localStorage

## Tech Stack

- React 18 with TypeScript
- Vite for build tool
- Zustand for state management
- Material-UI for components
- React Hook Form with Yup for form validation

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
```

## Usage

- Enter a YouTube URL, name, technique, and format in the form.
- The app validates the URL and extracts the video ID for thumbnails.
- Listings are saved to localStorage and displayed in the table.
- Click the URL to open the video, or delete unwanted listings.
  import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])
