// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { saveTokenToBackend } from "./saveTokenToBackend";
const firebaseConfig = {
  apiKey: "AIzaSyDe66omLs9tSAPjP43hiXBpfnYnzh7aJjA",
  authDomain: "eighth-jigsaw-410408.firebaseapp.com",
  projectId: "eighth-jigsaw-410408",
  storageBucket: "eighth-jigsaw-410408.appspot.com", 
  messagingSenderId: "657295362911",
  appId: "1:657295362911:web:9d1670d014a96a5c9344ea",
  measurementId: "G-L6NPFZW981"
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
          vapidKey: "BGG-kSzdks0FDsI9i9d_WWN3f24Bu8YNeDualbqciiDCGRvrJ_iwKMmpu5wam7KhG0dKL8FgM7TXiwn7AKnidlg"
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