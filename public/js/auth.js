
// Add this to the existing auth.js file after successful login

// In the saveAuthData function, add:
function saveAuthData(response) {
  if (response.data && response.data.token) {
    localStorage.setItem('zkGamingToken', response.data.token);
    localStorage.setItem('succinctVerified', 'true');
    
    if (response.data.user) {
      localStorage.setItem('zkUser', JSON.stringify(response.data.user));
      
      // Check if user needs onboarding
      if (!response.data.user.username || response.data.user.username.startsWith('Player')) {
        // New user, needs onboarding
        setTimeout(() => {
          window.location.href = '/onboarding';
        }, 1500);
      } else {
        // Existing user, go to games
        setTimeout(() => {
          window.location.href = '/games';
        }, 1500);
      }
    }
  }
}
