// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDe66omLs9tSAPjP43hiXBpfnYnzh7aJjA",
  authDomain: "eighth-jigsaw-410408.firebaseapp.com",
  projectId: "eighth-jigsaw-410408",
  storageBucket: "eighth-jigsaw-410408.appspot.com", // Fixed value
  messagingSenderId: "657295362911",
  appId: "1:657295362911:web:9d1670d014a96a5c9344ea",
  measurementId: "G-L6NPFZW981"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body:payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});