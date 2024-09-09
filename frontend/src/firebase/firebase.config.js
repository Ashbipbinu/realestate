

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-realestate-240f1.firebaseapp.com",
  projectId: "mern-realestate-240f1",
  storageBucket: "mern-realestate-240f1.appspot.com",
  messagingSenderId: "825798779184",
  appId: "1:825798779184:web:ae8f2f11a68d6b3d3ee8f5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);