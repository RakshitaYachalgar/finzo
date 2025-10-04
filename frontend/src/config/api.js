// API configuration for different environments
const API_CONFIG = {
  // For development: React on 3001, API on 3000
  // For production: Both on same domain with relative paths
  BASE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
};

// Helper function to build API URLs
export const apiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;

export default API_CONFIG;