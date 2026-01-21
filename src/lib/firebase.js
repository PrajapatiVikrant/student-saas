// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBflJVAjryQaZnNhEa3MvVitoxWwaHR1WA",
  authDomain: "vikrant-sass.firebaseapp.com",
  projectId: "vikrant-sass",
  messagingSenderId: "966027570086",
  appId: "1:966027570086:web:6931d007e8c5d21f3b7d67",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);