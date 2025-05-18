

// Import the functions you need from the SDKs you need
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0pN-FWpO4zkPqqTP8hyaDmUwyCsoSmS0",
  authDomain: "wataxi-app.firebaseapp.com",
  projectId: "wataxi-app",
  storageBucket: "wataxi-app.firebasestorage.app",
  messagingSenderId: "851282788694",
  appId: "1:851282788694:web:ac678a2b0ba613e6f016f7",
  measurementId: "G-3JE3J9JPE9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Google Sign-In Function
function handleGoogleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  // Optional: Add custom parameters
  provider.setCustomParameters({
    prompt: 'select_account' // Forces account selection
  });
  
  // Sign in with popup
  auth.signInWithPopup(provider)
    .then((result) => {
      // Successful sign-in
      const user = result.user;
      console.log('Signed in user:', user);
      
      // Redirect or update UI
      window.location.href = '/dashboard.html'; // Example redirect
    })
    .catch((error) => {
      // Handle errors
      console.error('Google sign-in error:', error);
      
      // Show error to user
      alert(`Sign-in failed: ${error.message}`);
    });
}

// Add event listener to your button
document.getElementById('googleSignInBtn')
  .addEventListener('click', handleGoogleSignIn);

// Optional: Check auth state on page load
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is already signed in
    console.log('User already authenticated:', user);
    // You might want to redirect them
  }

});