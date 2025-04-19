// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD57L1abdQxBo-gSviix4EHXp4ka1bJXhQ",
  authDomain: "podoroj-5207b.firebaseapp.com",
  projectId: "podoroj-5207b",
  storageBucket: "podoroj-5207b.firebasestorage.app",
  messagingSenderId: "777083233422",
  appId: "1:777083233422:web:0e05998f0edc585fced5df",
  measurementId: "G-Z7Z9NKMDG5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db, storage };