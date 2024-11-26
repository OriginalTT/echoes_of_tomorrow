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
                console.log("User ID:", auth.currentUser.uid);
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
            {loading ? (
                <main className="flex flex-col justify-center items-center">
                    <Image src={"/bg_noise.png"} alt="background image" width={390} height={753} quality={100}
                        className="w-screen h-screen object-cover fixed top-0 left-0 z-[-1]" />
                    <div className='bg-gradient-to-b from-[#69860C] to-[#b5cc6b] 
            w-screen h-screen fixed top-0 left-0 z-[-2]'></div>
                    <div className='flex flex-col items-center mt-60'>
                        {/* <Image src={'/loader.png'} alt="check mark" width={250} height={250} />
                        <p
                            className='text-2xl font-bold text-white text-center mt-10'
                        >Authenticating...</p> */}
                        <div className='flex flex-col items-center'>
                            <Image src={'/loader.png'} alt="authenticating" width={250} height={250} />
                            <p className='text-2xl font-bold text-white text-center mt-10'>
                                Authenticating...
                            </p>
                        </div>
                    </div>
                </main>) : null}
        </AuthContext.Provider>
    );
}
