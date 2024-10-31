'use client';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export default function Home() {
  const sketchRef = useRef();
  const p5InstanceRef = useRef();
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    // Define the p5 sketch
    const sketch = (p) => {
      let targetX = 0;
      let velocityX = 0;
      let accelerationX = 0;

      p.setup = () => {
        p.createCanvas(1920, 1080);
        p.background(200);
      };

      p.draw = () => {
        p.background(200);
        p.text(`Votes: ${voteCount}`, 10, 20);
        p.text(`Velocity: ${velocityX}`, 70, 20);

        // Update velocity based on acceleration
        velocityX += accelerationX;
        targetX += velocityX;

        // Keep targetX within canvas boundaries
        if (targetX > p.width) {
          targetX = 0;
        };

        // Draw the ellipse at the updated position
        p.fill(255, 0, 0);
        p.ellipse(targetX, p.height / 2, 35, 35);
      };

      // Method to update acceleration
      p.setAcceleration = (newAcceleration) => {
        accelerationX = newAcceleration;
      };
    };

    // Initialize p5 instance and attach it to the ref
    p5InstanceRef.current = new p5(sketch, sketchRef.current);

    // Cleanup the p5 instance on component unmount
    return () => {
      p5InstanceRef.current.remove();
    };
  }, []);

  // Fetch voteCount from the API
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch('/api'); // Adjust API endpoint as needed
        const data = await response.json();
        setVoteCount(data.votes); // Update voteCount with fetched data
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    // Polling interval to fetch voteCount periodically
    const interval = setInterval(() => {
      fetchVotes();
    }, 2000); // Fetch every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Update acceleration when voteCount changes
  useEffect(() => {
    if (p5InstanceRef.current) {
      const newAcceleration = p5InstanceRef.current.map(voteCount, 0, 100, 0, 0.2);
      p5InstanceRef.current.setAcceleration(newAcceleration);
    }
  }, [voteCount]);

  return (
    <div className="">
      <div ref={sketchRef}></div>
    </div>
  );
}
