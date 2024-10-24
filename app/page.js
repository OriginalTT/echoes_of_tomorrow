'use client';

import { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

export default function Home() {
  const sketchRef = useRef();
  const p5InstanceRef = useRef(); // Ref to store p5.js instance
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    // Define the p5 sketch
    const sketch = (p) => {
      let targetX = 0;
      let velocityX = 0;
      let accelerationX = 0;

      p.setup = () => {
        p.createCanvas(400, 400);
        p.background(200);
      };

      p.draw = () => {
        p.background(200);

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
  }, []); // Run only once

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Hello</h1>
      <div ref={sketchRef}></div>
    </div>
  );
}
