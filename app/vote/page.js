'use client';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { useAuth } from "../AuthProvider";

const firebaseConfig = {
    apiKey: "AIzaSyDOFMKmigCxtPg9EpLXVfi4ys7MyvxW49w",
    authDomain: "testing-83908.firebaseapp.com",
    projectId: "testing-83908",
    storageBucket: "testing-83908.firebasestorage.app",
    messagingSenderId: "293376159716",
    appId: "1:293376159716:web:442a73613a64eb9a4661f1",
    measurementId: "G-H11F1LKQ1C"
};

import { useState, useEffect } from 'react';
import Image from "next/image";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Vote() {
    const [questionInfo, setQuestionInfo] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');

    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const { user, loading } = useAuth();

    // Fetch Question
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "questions"));
                const questions = [];
                querySnapshot.forEach((doc) => {
                    questions.push(doc.data());
                });
                setQuestionInfo(questions);
            } catch (e) {
                console.log("Transaction failed: ", e);
            }
        };
        fetchData();
    }, []);

    const handleChange = async (event) => {
        const selectedAnswer = event.target.value;
        setSelectedAnswer(selectedAnswer);

        try {
            const res = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: String(user.uid),
                    questionId: Number(questionInfo[0].id),
                    choiceId: Number(selectedAnswer),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setResponseMessage(data.message);
                setError('');
            } else {
                setError(data.message || 'Something went wrong.');
                setResponseMessage('');
            }
        } catch (err) {
            console.error('Error submitting the form:', err);
            setError('There was a problem submitting your answer. Please try again.');
            setResponseMessage('');
        }
    };

    return (
        <main className="flex flex-col items-center justify-center w-full">
            {loading ? (<div>Loading user data...</div>) : (
                <>
                    <header className="w-full">
                        <Image
                            src="/banner.jpg"
                            alt="banner"
                            width={945} height={615}
                            className="w-full h-[150px] object-cover object-bottom"
                        />
                    </header>
                    <form className="w-4/5">
                        <fieldset className="flex flex-col items-center gap-3">
                            <legend className="text-xl my-3">
                                {questionInfo && questionInfo[0].question}
                            </legend>
                            {questionInfo && questionInfo[0].choices.map((option, index) => (
                                <div key={index}
                                    className="flex items-left gap-1 bg-gray-300 p-1 rounded w-full"
                                >
                                    <input
                                        type="radio"
                                        id={"option_" + index}
                                        name="selected_option"
                                        value={index}
                                        onChange={handleChange} />
                                    <label htmlFor={"option_" + index}>{option.label}</label>
                                </div>
                            ))}
                        </fieldset>
                    </form>
                    <div>
                        {responseMessage && <p>{responseMessage}</p>}
                        {responseMessage && <p>{questionInfo[0].choices[selectedAnswer].result}</p>}
                    </div>
                </>
            )}
        </main>
    );
}