// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  // Import the functions you need from the SDKs you need

  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";

  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";

  // TODO: Add SDKs for Firebase products that you want to use

  // https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
  const firebaseConfig = {

    apiKey: "AIzaSyAWqzCpJ2rdwxijZv43knm0VYj6x-eGPCw",

    authDomain: "wataxi-6e4e1.firebaseapp.com",

    projectId: "wataxi-6e4e1",

    storageBucket: "wataxi-6e4e1.firebasestorage.app",

    messagingSenderId: "233520730392",

    appId: "1:233520730392:web:28042f24e0347a3e424e6d",

    measurementId: "G-S6XE4J9138"

  };



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// DOM elements
const signInButton = document.getElementById('sign-in-button');
const signOutButton = document.getElementById('sign-out-button');
const signInContainer = document.getElementById('sign-in-container');
const userInfoContainer = document.getElementById('user-info-container');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userPhoto = document.getElementById('user-photo');

// Sign in with Google
signInButton.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            
            // The signed-in user info
            const user = result.user;
            console.log(user);
            
            // Redirect to location page after successful login
            window.location.href = "location.html";
        })
        .catch((error) => {
            // Handle Errors here
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
            alert("Sign in failed: " + errorMessage);
        });
});

// Sign out
signOutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Sign-out successful
        // Redirect to login page after sign out
        window.location.href = "index.html";
    }).catch((error) => {
        // An error happened
        console.error(error);
        alert("Sign out failed: " + error.message);
    });
});

// Auth state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        signInContainer.classList.add('hidden');
        userInfoContainer.classList.remove('hidden');
        
        // Update UI with user info
        userName.textContent = user.displayName;
        userEmail.textContent = user.email;
        userPhoto.src = user.photoURL;
        
        // If user is already logged in and on login page, redirect to location
        if (window.location.pathname.endsWith('index.html')) {
            window.location.href = "location.html";
        }
    } else {
        // User is signed out
        signInContainer.classList.remove('hidden');
        userInfoContainer.classList.add('hidden');
        
        // If user is logged out and on location page, redirect to login
        if (window.location.pathname.endsWith('location.html')) {
            window.location.href = "index.html";
        }
    }
});






