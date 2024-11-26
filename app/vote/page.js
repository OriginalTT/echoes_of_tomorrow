'use client';
// Import the functions you need from the SDKs you need
import { db } from '../../lib/firebase';
import { getDocs, collection, query, where } from "firebase/firestore";
import { useAuth } from "../AuthProvider";

import { useState, useEffect } from 'react';
import Image from "next/image";

import { motion, AnimatePresence } from 'framer-motion';

import Welcome from "./components/Welcome";
import Choice from './components/Choice';

export default function Vote() {
    const [questionInfo, setQuestionInfo] = useState(null);
    const [welcome, setWelcome] = useState(true);
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [lookUp, setLookUp] = useState(false);

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
                const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
                shuffleArray(selectedQuestion.choices)
                setQuestionInfo(selectedQuestion);
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
        const choice = questionInfo.choices[event.target.value];
        setSelectedAnswer(Number(event.target.value));
        setTimeout(() => {
            setLookUp(true);
        }, 5000);

        try {
            const res = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: String(user.uid),
                    choiceId: Number(event.target.value),
                    question: questionInfo,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setAnswered(true);
            } else {
                setAnswered(false);
            }
        } catch (err) {
            setAnswered(false);
            console.error('Error submitting the form:', err);
        }
    };

    const handleExitWelcome = () => {
        setWelcome(false);
    }

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    return (
        <>
            <Image src={"/bg_noise.png"} alt="background image" width={390} height={753} quality={100}
                className="w-screen h-screen object-cover fixed top-0 left-0 z-[-1]" />
            <div className='bg-gradient-to-b from-[#69860C] to-[#b5cc6b] 
            w-screen h-screen fixed top-0 left-0 z-[-2]'></div>

            {/* WELCOME */}
            {welcome ? <Welcome exitWelcome={handleExitWelcome} /> : null}


            {/* HEADER */}
            {!welcome ? (
                <main className="flex flex-col items-center justify-center w-5/6 mx-auto mt-5">
                    <Image src={'/logo_horizontal.png'} alt="Logo" width={180} height={50} quality={100} />


                    {/* VOTED */}
                    {/* {(answered && !selectedAnswer) ?
                        <div className='flex flex-col items-center mt-40'>
                            <Image src={'/check.png'} alt="check mark" width={250} height={250} />
                            <p
                                className='text-2xl font-bold text-white text-center mt-10'
                            >You Have Already Voted</p>
                        </div>
                        : null} */}

                    <AnimatePresence mode="wait">
                        {/* VOTING FORM */}
                        {(selectedAnswer === null) ? //REPLACE w/ (!answered && !selectedAnswer)
                            <motion.form className='my-8'
                                key="form"
                                exit={{ opacity: 0, scale: 1.1 }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}>
                                <fieldset>
                                    <p className='text-white text-7xl font-bold'>Q.</p>
                                    <p className='text-white text-lg font-bold'>{questionInfo && questionInfo.question}</p>
                                    <div className='w-full mx-auto h-[2px] bg-white mt-5 mb-8' />
                                    <div className='flex flex-col items-center gap-5'>
                                        {questionInfo?.choices.map((option, index) => (
                                            <Choice
                                                key={index}
                                                option={option}
                                                index={index}
                                                handleSelection={handleSelection}
                                                selectedAnswer={selectedAnswer}
                                            />
                                        ))}
                                    </div>
                                </fieldset>
                            </motion.form> : null}


                        {/* RESULT */}
                        {selectedAnswer !== null && !lookUp ?
                            <motion.div className='mt-40'
                                key="result"
                                exit={{ opacity: 0, scale: 1.1 }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}>
                                {questionInfo.choices[selectedAnswer].score >= 0 ?
                                    <div className='flex flex-col items-center'>
                                        <Image src={'/thumbs_up.png'} alt="Thumbs up" width={250} height={250} />
                                        <p className='text-2xl font-bold text-white text-center mt-10'>
                                            Your answer enhance the ecosystem in Stratford!
                                        </p>
                                    </div>
                                    :
                                    <div className='flex flex-col items-center'>
                                        <Image src={'/thumbs_down.png'} alt="Thumbs down" width={250} height={250} />
                                        <p className='text-2xl font-bold text-white text-center mt-10'>
                                            Your answer negatively influences the ecosystem in Stratford.
                                        </p>
                                    </div>
                                }
                            </motion.div> : null}

                        {selectedAnswer !== null && lookUp ?
                            <motion.div className='mt-40'
                                key="lookUp"
                                exit={{ opacity: 0, scale: 1.1 }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}>
                                <div className='flex flex-col items-center'>
                                    <Image src={'/up.png'} alt="Arrow pointing upward" width={250} height={250} />
                                    <p className='text-2xl font-bold text-white text-center mt-10'>
                                        Look up at the screen. See how your choice effects the world.
                                    </p>
                                </div>
                            </motion.div> : null}
                    </AnimatePresence>
                </main>
            ) : null}
        </>
    );
}