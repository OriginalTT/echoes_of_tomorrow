'use client';

import Image from "next/image";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";

import { useRef, useEffect, useState } from 'react';
// import p5 from 'p5';

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
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default function Home() {
  // const sketchRef = useRef();
  // const p5InstanceRef = useRef();
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = query(collection(db, "votes"), where("target", "==", "polution"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const result = [];
    querySnapshot.forEach((doc) => {
      result.push(doc.data());
    })
    setVotes(result);
    setLoading(false)
  })

  // useEffect(() => {
  //   // Define the p5 sketch
  //   const sketch = (p) => {
  //     let targetX = 0;
  //     let velocityX = 0;
  //     let accelerationX = 0;

  //     p.setup = () => {
  //       p.createCanvas(1920, 1080);
  //       p.background(200);
  //     };

  //     p.draw = () => {
  //       p.background(200);
  //       p.text(`Votes: ${voteCount}`, 10, 20);
  //       p.text(`Velocity: ${velocityX}`, 70, 20);

  //       // Update velocity based on acceleration
  //       velocityX += accelerationX;
  //       targetX += velocityX;

  //       // Keep targetX within canvas boundaries
  //       if (targetX > p.width) {
  //         targetX = 0;
  //       };

  //       // Draw the ellipse at the updated position
  //       p.fill(255, 0, 0);
  //       p.ellipse(targetX, p.height / 2, 35, 35);
  //     };

  //     // Method to update acceleration
  //     p.setAcceleration = (newAcceleration) => {
  //       accelerationX = newAcceleration;
  //     };
  //   };

  //   // Initialize p5 instance and attach it to the ref
  //   p5InstanceRef.current = new p5(sketch, sketchRef.current);

  //   // Cleanup the p5 instance on component unmount
  //   return () => {
  //     p5InstanceRef.current.remove();
  //   };
  // }, []);


  return (
    <main>
      {loading ? (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <Image src="/plant.gif" alt="Loading Data..." width={100} height={100} />
          <p>Loading Data...</p>
        </div>
      ) :
        (<div>
          <div className="flex flex-col">
            {
              votes.map((vote, index) => (
                <div className="flex gap-3" key={index}>
                  <p>{vote.target || "N/A"}</p>
                  <p>{vote.userId || "N/A"}</p>
                  <p>
                    {vote.timestamp
                      ? new Date(vote.timestamp.seconds * 1000).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>{vote.score || "N/A"}</p>
                </div>
              ))
            }
          </div>
          {/* <div ref={sketchRef}></div> */}
        </div>
        )
      }
    </main>
  );
}
