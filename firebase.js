// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCujuJQGYbaz_3S-UelowfzhGXNZgUJO-w",
  authDomain: "netlify-8c948.firebaseapp.com",
  databaseURL: "https://netlify-8c948-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "netlify-8c948",
  storageBucket: "netlify-8c948.appspot.com",
  messagingSenderId: "993913833292",
  appId: "1:993913833292:web:1aedc0905817efc67f31e9",
  measurementId: "G-87W5MDF07K"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 