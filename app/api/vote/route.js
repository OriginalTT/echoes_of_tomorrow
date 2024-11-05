import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

export async function POST(req) {
    try {
        // Manually parse the JSON body

        const data = await req.json();
        console.log(data);
        const { userId, choiceId } = data;

        const addVote = await addDoc(collection(db, "votes"), {
            timestamp: serverTimestamp(),
            userId: String(userId),
            questionId: Number(data.question.id),
            choiceId: Number(choiceId),
            target: String(data.question.target),
            score: Number(data.question.choices[choiceId].score),
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