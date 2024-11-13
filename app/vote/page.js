'use client';
// Import the functions you need from the SDKs you need
import { db } from '../../lib/firebase';
import { getDocs, collection, query, where } from "firebase/firestore";
import { useAuth } from "../AuthProvider";

import { useState, useEffect } from 'react';
import Image from "next/image";

export default function Vote() {
    const [questionInfo, setQuestionInfo] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [answered, setAnswered] = useState(false);
    const [selected, setSelected] = useState(false);
    const [error, setError] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const { user } = useAuth();

    // Fetch Question
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "questions"));
                const questions = [];
                querySnapshot.forEach((doc) => {
                    questions.push(doc.data());
                });
                setQuestionInfo(questions[Math.floor(Math.random() * questions.length)]);
            } catch (e) {
                console.log("Transaction failed: ", e);
            }
        };
        fetchData();
    }, []);

    // Fetch if user has voted
    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, "votes"), where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const votes = [];
                querySnapshot.forEach((doc) => {
                    votes.push(doc.data());
                });
                if (votes.length > 0) {
                    setAnswered(true);
                }
            } catch (e) {
                console.log("Transaction failed: ", e);
            }
        };
        if (user) {
            fetchData();
        }
    }, [user]);

    const handleSelection = async (event) => {
        const selectedAnswer = event.target.value;
        if (!selected) {
            setSelected(true);
        }
        setSelectedAnswer(selectedAnswer);

        try {
            const res = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: String(user.uid),
                    choiceId: Number(selectedAnswer),
                    question: questionInfo,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setAnswered(true);
                setResponseMessage(data.message);
                setError('');
            } else {
                setAnswered(false);
                setSelected(false);
                setError(data.message || 'Something went wrong.');
                setResponseMessage('');
            }
        } catch (err) {
            setAnswered(false);
            setSelected(false);
            console.error('Error submitting the form:', err);
            setError('There was a problem submitting your answer. Please try again.');
            setResponseMessage('');
        }
    };

    return (
        <main className="flex flex-col items-center justify-center w-4/5 mx-auto mt-10">
            {!answered ?
                <div className='flex flex-col items-center gap-8'>
                    <header className='w-full h-auto'>
                        {questionInfo &&
                            <Image
                                src={"/questions/" + questionInfo.id + ".png"}
                                alt="banner"
                                width={945} height={615}
                                className="w-full object-cover object-bottom rounded"
                            />
                        }
                    </header>
                    <form>
                        <fieldset className="flex flex-col items-center gap-5">
                            <div>
                                <legend className="text-lg">
                                    {questionInfo && questionInfo.question}
                                </legend>
                            </div>
                            <div className='flex flex-col items-center gap-3'>
                                {questionInfo && questionInfo.choices.map((option, index) => (
                                    <div key={index}
                                        className="flex items-left gap-1 bg-gray-300 p-3 rounded w-full"
                                    >
                                        <input
                                            type="radio"
                                            id={"option_" + index}
                                            name="selected_option"
                                            value={index}
                                            onChange={handleSelection}
                                            disabled={selected}
                                            className='appearance-none' />
                                        <label htmlFor={"option_" + index}
                                            className='text-lg flex gap-1'
                                        >
                                            <p>{index + 1}.</p>
                                            <p>{option.label}</p>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </form>
                </div>
                : (selectedAnswer ?
                    <div>
                        <p
                            className='text-3xl text-center mt-10'
                        >{questionInfo.choices[selectedAnswer].result}</p>
                    </div>
                    :
                    <div>
                        <p
                            className='text-3xl text-center mt-10'
                        >You have already voted.</p>
                    </div>
                )
            }
        </main>
    );
}