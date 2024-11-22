'use client';

import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { useEffect, useState, useRef } from 'react';
import p5 from 'p5';

export default function Home() {
    const sketchRef = useRef();
    const p5InstanceRef = useRef();
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "votes"), orderBy("timestamp", "desc"), limit(5));

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
        // Define the p5 sketch
        const sketch = (p) => {
            let votes = [];
            let background, highway, building;

            p.preload = () => {
                background = p.loadImage('/p5/field.jpg');
                highway = p.loadImage('/p5/highway.png');
                building = p.loadImage('/p5/building.png');
            };

            p.setup = () => {
                p.createCanvas(1920, 1080);
            };

            p.draw = () => {
                p.image(background, 0, 0, 1920, 1080); //Background Image

                p.image(highway, 50, 350, 600, 800);
                p.image(building, 300, 350, 300, 300);


                // Draw Vote UI
                const rectWidth = 64;
                const rectHeight = 32;

                for (let i = 0; i < votes.length; i++) {
                    const x = (votes.length - i) * rectWidth + 1500;
                    const y = 1000;
                    const color = votes[i].score == undefined ? '5C5A32' : votes[i].score >= 0 ? '#A9DE00' : '#AE2C0C';

                    p.fill(color);
                    p.stroke('#5C5A32');
                    p.strokeWeight(5);
                    if (i == 0) {
                        p.rect(x, y, rectWidth, rectHeight, 0, 99, 99, 0); // -2 for spacing
                    } else if (i == votes.length - 1) {
                        p.rect(x, y, rectWidth, rectHeight, 99, 0, 0, 99); // -2 for spacing
                    } else {
                        p.rect(x, y, rectWidth, rectHeight); // -2 for spacing
                    }
                }
            };

            p.updateVotes = (newVotes) => {
                votes = newVotes;
            }
        };

        // Initialize p5 instance and attach it to the ref
        p5InstanceRef.current = new p5(sketch, sketchRef.current);

        // Cleanup the p5 instance on component unmount
        return () => {
            p5InstanceRef.current.remove();
        };
    }, []);

    useEffect(() => {
        if (p5InstanceRef.current) {
            console.log(votes);
            p5InstanceRef.current.updateVotes(votes);
        }
    }, [votes]);


    return (
        <main>
            <div ref={sketchRef} />
        </main>
    );
}
