document.addEventListener('DOMContentLoaded', () => {
    // Get the Google Sign-In button
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    
    // Add click event listener for Google Sign-In
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    }

    // Check auth state on page load
    checkAuthState();
});

/**
 * Handles Google Sign-In process
 */
function handleGoogleSignIn() {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            // Successful sign-in
            console.log("Google sign-in successful", result.user);
            redirectToHome();
        })
        .catch((error) => {
            // Handle errors
            console.error("Google sign-in error:", error);
            showError("Failed to sign in with Google: " + error.message);
        });
}

/**
 * Checks the authentication state and redirects if user is already logged in
 */
function checkAuthState() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is already logged in, redirect to home
            redirectToHome();
        }
    });
}

/**
 * Redirects to the home page
 */
function redirectToHome() {
    window.location.href = "home.html";
}

/**
 * Displays an error message to the user
 * @param {string} message - The error message to display
 */
function showError(message) {
    // You can implement a more sophisticated error display
    alert(message);
}