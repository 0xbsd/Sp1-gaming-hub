export const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend.railway.app' 
    : 'http://localhost:3000',
  endpoints: {
    auth: '/api/auth',
    user: '/api/user',
    games: '/api/games'
  }
};