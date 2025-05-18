// Import necessary Firebase functions (if using modular version)
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Or if using CDN version:
const auth = firebase.auth();

// Function to update user profile in UI
function updateUserProfile(user) {
    if (user) {
        // Update display name
        const displayName = user.displayName || "User";
        document.getElementById('userDisplayName').textContent = displayName;
        
        // Update email
        document.getElementById('userEmail').textContent = user.email || "No email provided";
        
        // Update profile picture (if available)
        if (user.photoURL) {
            document.getElementById('userProfilePic').src = user.photoURL;
        }
        
        // You can update other elements as needed
    } else {
        // User is signed out
        document.getElementById('userDisplayName').textContent = "Guest";
        document.getElementById('userEmail').textContent = "Please sign in";
    }
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    updateUserProfile(user);
});

// If you need to force refresh (after profile updates)
function refreshUserProfile() {
    const user = auth.currentUser;
    updateUserProfile(user);
}