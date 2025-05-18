// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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


import { signInWithPopup } from "firebase/auth";

function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      
      // The signed-in user info
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      // Handle Errors here
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorMessage);
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