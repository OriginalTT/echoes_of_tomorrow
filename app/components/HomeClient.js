'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

const P5Sketch = dynamic(() => import('./P5Sketch'), { ssr: false });

export default function HomeClient() {
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'votes'),
            orderBy('timestamp', 'desc'),
            limit(5)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const result = [];
            querySnapshot.forEach((doc) => {
                result.push(doc.data());
            });
            result.sort((a, b) => b.timestamp - a.timestamp);
            setVotes(result);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <main>
            <P5Sketch votes={votes} />
        </main>
    );
}
