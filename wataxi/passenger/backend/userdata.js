
        // Get user data from session storage
const userData = JSON.parse(sessionStorage.getItem('user'));

if (userData) {
    console.log("User is logged in:", userData);
    // Use the data as needed
    
    document.getElementById('user-avatar').src = userData.photoURL;
     document.getElementById('username').textContent = userData.displayName;
      document.getElementById('email').textContent = userData.email;
} 

// else {
//     console.log("No user session found");
//     // Redirect to login if needed
//     window.location.href = "index.html";
// }
  