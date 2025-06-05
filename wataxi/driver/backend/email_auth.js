// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider, 
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your Firebase configuration
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

// Error display function
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Sign up with email/password
document.getElementById('sign-up-button').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('number').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
        showError("Please fill in all fields");
        return;
    }
    
    if (password !== confirmPassword) {
        showError("Passwords don't match");
        return;
    }
    
    if (password.length < 6) {
        showError("Password must be at least 6 characters");
        return;
    }

    if (!validateEmail(email)) {
        showError("Please enter a valid email address");
        return;
    }

    try {
        // Show loading state
        const signUpButton = document.getElementById('sign-up-button');
        signUpButton.disabled = true;
        const originalText = signUpButton.textContent;
        signUpButton.textContent = "Creating account...";
        
        // Create user with email/password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update user profile with name and phone
        await updateProfile(userCredential.user, {
            displayName: name,
            phoneNumber: phone
        });

        // Redirect to location page
        window.location.href = "driver-document-verify.html";
    } catch (error) {
        console.error("Signup error:", error);
        showError(error.message);
    } finally {
        const signUpButton = document.getElementById('sign-up-button');
        signUpButton.disabled = false;
        signUpButton.textContent = "Sign up";
    }
});

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}