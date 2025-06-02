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

// Function to store user data in session storage
function storeUserSession(user) {
    sessionStorage.setItem('user', JSON.stringify({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
    }));
}

// Function to clear user data from session storage
function clearUserSession() {
    sessionStorage.removeItem('user');
}

// Function to load user data from session storage
function loadUserSession() {
    const userData = sessionStorage.getItem('user');
    if (userData) {
        return JSON.parse(userData);
    }
    return null;
}

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
            
            // Store user data in session storage
            storeUserSession(user);
            
            // Redirect to home page after successful login
            window.location.href = "home.html";
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
        // Clear user data from session storage
        clearUserSession();
        
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
        
        // Store user data in session storage
        storeUserSession(user);
        
        // If user is already logged in and on login page, redirect to home
        if (window.location.pathname.endsWith('index.html')) {
            window.location.href = "home.html";
        }
    } else {
        // User is signed out
        signInContainer.classList.remove('hidden');
        userInfoContainer.classList.add('hidden');
        
        // Clear user data from session storage
        clearUserSession();
        
        // If user is logged out and on home page, redirect to login
        if (window.location.pathname.endsWith('home.html')) {
            window.location.href = "index.html";
        }
    }
});

// On page load, check for existing session data
document.addEventListener('DOMContentLoaded', () => {
    const userData = loadUserSession();
    if (userData) {
        // Update UI with stored user info
        if (userName) userName.textContent = userData.displayName;
        if (userEmail) userEmail.textContent = userData.email;
        if (userPhoto) userPhoto.src = userData.photoURL;
        
        // Show user info container if available
        if (signInContainer) signInContainer.classList.add('hidden');
        if (userInfoContainer) userInfoContainer.classList.remove('hidden');
    }
});