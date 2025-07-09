// Mock API configuration for development/demo
export const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? window.location.origin  // Use same origin for now
    : 'http://localhost:3000',
  endpoints: {
    auth: '/api/auth',
    user: '/api/user', 
    games: '/api/games'
  },
  // Mock API flag for frontend-only deployment
  useMockAPI: true
};

// Mock API implementation for demo purposes
export const mockAPI = {
  auth: {
    login: async (credentials) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: {
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: '1',
            username: credentials.username || 'Player' + Math.floor(Math.random() * 1000),
            email: credentials.email || 'player@example.com',
            zkPoints: 100,
            level: 1
          }
        }
      };
    },
    
    logout: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }
  },
  
  user: {
    getProfile: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedUser = localStorage.getItem('zkUser');
      const defaultUser = {
        id: '1',
        username: 'Player',
        email: 'player@example.com',
        zkPoints: 100,
        level: 1,
        gamesPlayed: 0,
        achievements: []
      };
      
      return {
        success: true,
        data: savedUser ? JSON.parse(savedUser) : defaultUser
      };
    },
    
    updateProfile: async (userData) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentUser = JSON.parse(localStorage.getItem('zkUser') || '{}');
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('zkUser', JSON.stringify(updatedUser));
      
      return {
        success: true,
        data: updatedUser
      };
    },
    
    getStats: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: {
          totalGames: parseInt(localStorage.getItem('totalGames') || '0'),
          totalScore: parseInt(localStorage.getItem('totalScore') || '0'),
          averageScore: parseInt(localStorage.getItem('averageScore') || '0'),
          highScore: parseInt(localStorage.getItem('highScore') || '0')
        }
      };
    },
    
    getAchievements: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: JSON.parse(localStorage.getItem('achievements') || '[]')
      };
    },
    
    getGameHistory: async (limit = 10) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: {
          sessions: JSON.parse(localStorage.getItem('gameHistory') || '[]').slice(0, limit)
        }
      };
    }
  },
  
  games: {
    submitScore: async (gameId, score, metadata = {}) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Save to localStorage for persistence
      const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
      const session = {
        gameId,
        score,
        metadata,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };
      
      history.unshift(session);
      localStorage.setItem('gameHistory', JSON.stringify(history.slice(0, 50))); // Keep last 50
      
      // Update high score
      const currentHigh = parseInt(localStorage.getItem('highScore') || '0');
      if (score > currentHigh) {
        localStorage.setItem('highScore', score.toString());
      }
      
      return {
        success: true,
        data: { sessionId: session.id, newHighScore: score > currentHigh }
      };
    }
  }
};

// Initialize global API object
if (typeof window !== 'undefined') {
  window.zkAPI = API_CONFIG.useMockAPI ? mockAPI : {
    // Real API implementation would go here
    auth: {
      login: async () => ({ success: false, error: 'Real API not implemented' }),
      logout: async () => ({ success: true })
    },
    user: {
      getProfile: async () => ({ success: false, error: 'Real API not implemented' }),
      updateProfile: async () => ({ success: false, error: 'Real API not implemented' }),
      getStats: async () => ({ success: false, error: 'Real API not implemented' }),
      getAchievements: async () => ({ success: false, error: 'Real API not implemented' }),
      getGameHistory: async () => ({ success: false, error: 'Real API not implemented' })
    },
    games: {
      submitScore: async () => ({ success: false, error: 'Real API not implemented' })
    }
  };
}