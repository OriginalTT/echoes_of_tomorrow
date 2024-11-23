import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

export async function POST(req) {
    try {
        // Manually parse the JSON body

        const data = await req.json();
        const { userId, choiceId, question } = data;

        const voteInfo = {
            timestamp: serverTimestamp(),
            userId: String(userId),
            questionId: Number(question.id),
            choiceId: Number(question.choices[Number(choiceId)].id),
            target: String(question.choices[Number(choiceId)].target),
            score: Number(question.choices[Number(choiceId)].score),
        }
        const addVote = await addDoc(collection(db, "votes"), voteInfo);

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