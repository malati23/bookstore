// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxVA_CCakr-s7LGOEJ7COrFYo7sQcpRFI",
  authDomain: "bookstore-d3a8e.firebaseapp.com",
  projectId: "bookstore-d3a8e",
  storageBucket: "bookstore-d3a8e.firebasestorage.app",
  messagingSenderId: "1072771404123",
  appId: "1:1072771404123:web:4c80f4788185dbab710a7e",
  measurementId: "G-8JPP4QH80Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);