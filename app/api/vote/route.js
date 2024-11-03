import { NextResponse } from 'next/server';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

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
const db = getFirestore(app);

export async function POST(req) {
    try {
        // Manually parse the JSON body
        const { userId, questionId, choiceId } = await req.json();

        const questionsDocRef = doc(db, "questions", String(questionId));
        const questionDocSnap = await getDoc(questionsDocRef);

        if (!questionDocSnap.exists()) {
            throw new Error('Question not found');
        }

        const target = questionDocSnap.data().target;
        const score = questionDocSnap.data().choices[choiceId].score;

        const addVote = await addDoc(collection(db, "votes"), {
            timestamp: serverTimestamp(),
            userId: userId,
            questionId: questionId,
            choiceId: choiceId,
            target: target,
            score: score,
        });

        return new NextResponse(JSON.stringify({ message: 'Your vote has been recorded successfully!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing vote:', error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};