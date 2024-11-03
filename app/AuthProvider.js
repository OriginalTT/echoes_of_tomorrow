'use client';

import Image from "next/image";
import { useState, useEffect, createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDOFMKmigCxtPg9EpLXVfi4ys7MyvxW49w",
    authDomain: "testing-83908.firebaseapp.com",
    projectId: "testing-83908",
    storageBucket: "testing-83908.firebasestorage.app",
    messagingSenderId: "293376159716",
    appId: "1:293376159716:web:442a73613a64eb9a4661f1",
    measurementId: "G-H11F1LKQ1C"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create a Context for Auth
const AuthContext = createContext();

// Custom hook to use the AuthContext
export function useAuth() {
    return useContext(AuthContext);
}

// AuthProvider component
export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // To handle loading state

    useEffect(() => {
        // Sign in anonymously
        signInAnonymously(auth)
            .then(() => {
                console.log("Signed in anonymously");
            })
            .catch((error) => {
                console.error("Error signing in anonymously:", error.code, error.message);
            });

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
            {loading && (
                <main className="w-full h-screen flex flex-col justify-center items-center">
                    <Image src="/plant.gif" alt="Loading..." width={100} height={100} />
                    <p>Authenticating...</p>
                </main>)}
        </AuthContext.Provider>
    );
}
