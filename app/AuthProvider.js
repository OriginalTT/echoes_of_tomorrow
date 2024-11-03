'use client';

import Image from "next/image";
import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../lib/firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";


// Create a Context for Auth
const AuthContext = createContext();

// Custom hook to use the AuthContext
export function useAuth() {
    return useContext(AuthContext);
}

// AuthProvider component
export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
