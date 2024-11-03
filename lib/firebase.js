import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDOFMKmigCxtPg9EpLXVfi4ys7MyvxW49w",
    authDomain: "testing-83908.firebaseapp.com",
    projectId: "testing-83908",
    storageBucket: "testing-83908.firebasestorage.app",
    messagingSenderId: "293376159716",
    appId: "1:293376159716:web:442a73613a64eb9a4661f1",
    measurementId: "G-H11F1LKQ1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
// Initialize other services as needed

export { app, auth, db };