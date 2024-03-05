// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4UwqXhCmlNU87DAUxI_S90K12wyRlxS8",
  authDomain: "webcarros-23ec3.firebaseapp.com",
  projectId: "webcarros-23ec3",
  storageBucket: "webcarros-23ec3.appspot.com",
  messagingSenderId: "1006730316263",
  appId: "1:1006730316263:web:93ddf5b6b16ca843ca9542"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app);
const storage = getStorage(app);

export {
  db, 
  auth,
  storage
}