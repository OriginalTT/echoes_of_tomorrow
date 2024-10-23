'use client'

import { useRef, useEffect } from 'react';
import p5 from 'p5';

export default function Home() {
  const sketchRef = useRef();

  useEffect(() => {
    // Define the p5 sketch
    const sketch = (p) => {

      let targetX = 0;
      p.setup = () => {
        p.createCanvas(400, 400);
        p.background(200);
      };

      p.draw = () => {
        p.background(200);
        p.fill(255, 0, 0);
        p.ellipse(targetX, p.height / 2, 35, 35);
        targetX = ((targetX + 1) % 400);
      };
    };

    // Initialize p5 instance and attach it to the ref
    const p5Instance = new p5(sketch, sketchRef.current);

    // Cleanup the p5 instance on component unmount
    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Hello</h1>
      <div ref={sketchRef}></div>
    </div>
  );
}
