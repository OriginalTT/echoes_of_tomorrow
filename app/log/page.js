'use client';

import Image from "next/image";
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from 'react';

export default function Home() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "votes"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const result = [];
      querySnapshot.forEach((doc) => {
        result.push(doc.data());
      })
      result.sort((a, b) => b.timestamp - a.timestamp);
      setVotes(result);
      setLoading(false)
    })
    return () => {
      unsubscribe();
    }
  }, [])

  useEffect(() => {
    console.log(votes);
  }, [votes])


  return (
    <main>
      {loading ? (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <Image src="/plant.gif" alt="Loading Data..." width={100} height={100} />
          <p>Loading Data...</p>
        </div>
      ) :
        (<div>
          <Image src="/qr_code.png" alt="QR Code" width={100} height={100} />
          <table>
            <thead>
              <tr>
                <th className="px-3">Timestamp</th>
                <th className="px-3">User ID</th>
                <th className="px-3">Target</th>
                <th className="px-3">Question</th>
                <th className="px-3">Choice</th>
                <th className="px-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {
                votes.map((vote, index) => (
                  <tr key={index}>
                    <td className="px-3">
                      {vote.timestamp
                        ? new Date(vote.timestamp.seconds * 1000).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-3">{vote.userId != null ? vote.userId : "N/A"}</td>
                    <td className="px-3">{vote.target != null ? vote.target : "N/A"}</td>
                    <td className="px-3">{vote.questionId != null ? vote.questionId : "N/A"}</td>
                    <td className="px-3">{vote.choiceId != null ? vote.choiceId : "N/A"}</td>
                    <td className="px-3">{vote.score != null ? vote.score : "N/A"}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        )
      }
    </main>
  );
}
