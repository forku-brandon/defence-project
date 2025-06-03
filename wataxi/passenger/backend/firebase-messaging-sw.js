// Import Firebase scripts (must use importScripts in service worker)
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize Firebase app in service worker
firebase.initializeApp({
  apiKey: "AIzaSyD0pN-FWpO4zkPqqTP8hyaDmUwyCsoSmS0",
  authDomain: "wataxi-app.firebaseapp.com",
  projectId: "wataxi-app",
  storageBucket: "wataxi-app.firebasestorage.app",
  messagingSenderId: "851282788694",
  appId: "1:851282788694:web:ac678a2b0ba613e6f016f7",
  measurementId: "G-3JE3J9JPE9"
});

const messaging = firebase.messaging();

// Customize background message handler
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '../assets/images/logo/favicon.png', // Use your app's logo
    badge: '../assets/images/logo/favicon.png', // For mobile
    data: payload.data || {} // Pass any additional data
  };

  // Show notification
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Optional: Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event.notification);
  
  // Close the notification
  event.notification.close();
  
  // Focus or open the app
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // Check if app is already open
      for (const client of windowClients) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open app if not already open
      if (clients.openWindow) {
        return clients.openWindow('https://your-wataxi-app-url.com'); // Replace with your app URL
      }
    })
  );
});

// Optional: Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event.notification);
});

// Optional: Handle push subscription changes
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Push subscription changed');
  event.waitUntil(
    messaging.getToken().then((token) => {
      if (token) {
        console.log('New FCM token:', token);
        // Send new token to your server
        // sendTokenToServer(token);
      }
    })
  );
});