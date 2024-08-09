// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0YyFw6FQmLgb9herzC3J8Up6NlRwtPKI",
  authDomain: "inventory-management-4214f.firebaseapp.com",
  projectId: "inventory-management-4214f",
  storageBucket: "inventory-management-4214f.appspot.com",
  messagingSenderId: "451928074847",
  appId: "1:451928074847:web:6d5349b951d4a164c0c9ea",
  measurementId: "G-BFMR2QE882"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();
export { app, provider, firestore };
