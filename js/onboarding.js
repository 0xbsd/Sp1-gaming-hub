

let onboardingState = {
  currentStep: 1,
  totalSteps: 6,
  userType: null,
  profileData: {
    username: '',
    email: '',
    avatar: '🎮',
    gameTypes: []
  },
  tutorialCompleted: false
};

// Initialize onboarding
document.addEventListener('DOMContentLoaded', () => {
  // Check if user needs onboarding
  const hasCompletedOnboarding = localStorage.getItem('zkOnboardingComplete');
  const isAuthenticated = localStorage.getItem('zkGamingToken');
  
  if (!isAuthenticated) {
    window.location.href = '/login';
    return;
  }
  
  if (hasCompletedOnboarding === 'true') {
    window.location.href = '/games';
    return;
  }
  
  // Start onboarding
  initializeOnboarding();
});

function initializeOnboarding() {
  updateProgress();
  showStep(1);
}

function showStep(stepNum) {
  // Hide all steps
  document.querySelectorAll('.onboarding-step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Show current step
  const currentStep = document.getElementById(`step${stepNum}`);
  if (currentStep) {
    currentStep.classList.add('active');
  }
  
  onboardingState.currentStep = stepNum;
  updateProgress();
}

function nextStep() {
  if (validateCurrentStep()) {
    if (onboardingState.currentStep < onboardingState.totalSteps) {
      showStep(onboardingState.currentStep + 1);
    }
  }
}

function previousStep() {
  if (onboardingState.currentStep > 1) {
    showStep(onboardingState.currentStep - 1);
  }
}

function validateCurrentStep() {
  switch(onboardingState.currentStep) {
    case 2: // User type selection
      if (!onboardingState.userType) {
        alert('Please select your user type');
        return false;
      }
      break;
    case 5: // Profile setup
      if (!onboardingState.profileData.username || onboardingState.profileData.username.length < 3) {
        alert('Please enter a username (at least 3 characters)');
        return false;
      }
      break;
  }
  return true;
}

function updateProgress() {
  const progress = (onboardingState.currentStep / onboardingState.totalSteps) * 100;
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = progress + '%';
  }
}

function selectUserType(type) {
  onboardingState.userType = type;
  
  // Update UI
  document.querySelectorAll('.user-type-card').forEach(card => {
    card.classList.remove('selected');
  });
  event.currentTarget.classList.add('selected');
  
  // Enable next button
  document.getElementById('typeNextBtn').disabled = false;
}

async function completeOnboarding() {
  try {
    // Save profile data
    const response = await zkAPI.user.updateProfile({
      username: onboardingState.profileData.username,
      email: onboardingState.profileData.email,
      avatar: onboardingState.profileData.avatar,
      preferences: {
        userType: onboardingState.userType,
        gameTypes: onboardingState.profileData.gameTypes
      }
    });
    
    if (response.success) {
      // Mark onboarding as complete
      localStorage.setItem('zkOnboardingComplete', 'true');
      localStorage.setItem('zkUserType', onboardingState.userType);
      
      // Update user data
      const currentUser = JSON.parse(localStorage.getItem('zkUser') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('zkUser', JSON.stringify(updatedUser));
      
      // Show success and redirect
      showCompletionScreen();
    }
  } catch (error) {
    console.error('Failed to complete onboarding:', error);
    alert('Failed to save profile. Please try again.');
  }
}

function showCompletionScreen() {
  document.querySelector('.onboarding-container').innerHTML = `
    <div style="text-align: center; animation: fadeIn 0.5s ease;">
      <div style="font-size: 6rem; margin-bottom: 2rem;">🎉</div>
      <h1 style="font-size: 3rem; margin-bottom: 1rem;">Welcome to ZK Gaming!</h1>
      <p style="font-size: 1.5rem; color: var(--text-dim); margin-bottom: 3rem;">
        You're all set! Let's start playing.
      </p>
      <button class="btn btn-primary" onclick="enterHub()">
        <span>Enter Gaming Hub</span>
        <span>🚀</span>
      </button>
    </div>
  `;
}

function enterHub() {
  window.location.href = '/games';
}
