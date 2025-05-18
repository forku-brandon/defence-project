// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Export the auth instances
window.auth = auth;
window.googleProvider = googleProvider;