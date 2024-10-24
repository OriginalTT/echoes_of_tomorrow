'use client'

import { useState, useEffect } from 'react';


export default function Interact() {
    const [voteCount, setVoteCount] = useState(0);
    const deviceId = 'test-device'; // Example device ID; replace with UUID in production

    // Polling logic to fetch the latest vote count
    useEffect(() => {
        const interval = setInterval(() => {
            fetch('/api')
                .then((res) => res.json())
                .then((data) => setVoteCount(data.votes))
                .catch((err) => console.error('Polling error:', err));
        }, 2000); // Poll every 2 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Handle voting
    const handleVote = () => {
        fetch(`/api`, {
            method: 'POST',
            body: JSON.stringify({ "deviceId": deviceId }),
        })
            .then((res) => res.json())
            .then((data) => setVoteCount(data.votes))
            .catch((err) => console.error('Error submitting vote:', err));
    };

    return (
        <div>
            <h1>Interactive Art Installation</h1>
            <h2>Current Votes: {voteCount}</h2>
            <button onClick={handleVote}>Vote</button>
        </div>)
}
