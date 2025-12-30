import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXUtQR7MN1LP71uQYpIXCcGhB9jRDJ6Rc",
  authDomain: "bruin-pong.firebaseapp.com",
  projectId: "bruin-pong",
  storageBucket: "bruin-pong.firebasestorage.app",
  messagingSenderId: "331865906008",
  appId: "1:331865906008:web:cd696c06343b82e515e32d",
  measurementId: "G-EHMYF6ZWS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

