importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBflJVAjryQaZnNhEa3MvVitoxWwaHR1WA",
  projectId: "vikrant",
  messagingSenderId: "966027570086",
  appId: "1:966027570086:web:6931d007e8c5d21f3b7d67"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(
    payload.notification.title,
    { body: payload.notification.body }
  );
});
