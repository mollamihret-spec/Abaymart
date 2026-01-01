// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA1fzS6xJm1sXi8rJs6s5NwD0HIv38GAz4",
  authDomain: "clone-f5c60.firebaseapp.com",
  projectId: "clone-f5c60",
  storageBucket: "clone-f5c60.firebasestorage.app",
  messagingSenderId: "658257438148",
  appId: "1:658257438148:web:42e7631ac54c4c9ce1f091",
  measurementId: "G-VDM4M6FZ0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app)