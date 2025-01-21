// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { saveTokenToBackend } from "./saveTokenToBackend";
const base_VAPKEY = import.meta.env.VITE_APP_VAPIDKEY;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "eighth-jigsaw-410408",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const generatToken = async () => {
  if ("Notification" in window && "serviceWorker" in navigator) {
    const permission = await Notification.requestPermission();
    console.log("Permission status:", permission);

    if (permission === "granted") {
      try {
        const token = await getToken(messaging, {
          vapidKey: base_VAPKEY
        });

        if (token) {
          console.log("FCM Token:", token);
          try {
            const successMessage = await saveTokenToBackend(token);
            console.log("Token saved successfully:", successMessage);
          } catch (err) {
            console.error("Error saving token:", err.message);
          }
        } else {
          console.error("Failed to generate FCM Token.");
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    } else {
      console.error("Notification permission denied.");
    }
  } else {
    console.error("Notifications or service workers are not supported in this browser.");
  }
};