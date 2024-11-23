'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

export default function P5Sketch({ votes }) {
    const sketchRef = useRef();
    const p5InstanceRef = useRef();

    useEffect(() => {
        const sketch = (p) => {
            let localVotes = votes || [];
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
                p.image(background, 0, 0, 1920, 1080);
                p.image(highway, 50, 350, 600, 800);
                p.image(building, 300, 350, 300, 300);

                const rectWidth = 64;
                const rectHeight = 32;

                for (let i = 0; i < localVotes.length; i++) {
                    const x = (localVotes.length - i) * rectWidth + 1500;
                    const y = 1000;
                    const color =
                        localVotes[i].score === undefined
                            ? '5C5A32'
                            : localVotes[i].score >= 0
                                ? '#A9DE00'
                                : '#AE2C0C';

                    p.fill(color);
                    p.stroke('#5C5A32');
                    p.strokeWeight(5);
                    if (i === 0) {
                        p.rect(x, y, rectWidth, rectHeight, 0, 99, 99, 0);
                    } else if (i === localVotes.length - 1) {
                        p.rect(x, y, rectWidth, rectHeight, 99, 0, 0, 99);
                    } else {
                        p.rect(x, y, rectWidth, rectHeight);
                    }
                }
            };

            p.updateVotes = (newVotes) => {
                localVotes = newVotes;
            };
        };

        p5InstanceRef.current = new p5(sketch, sketchRef.current);

        return () => {
            p5InstanceRef.current.remove();
        };
    }, []);

    useEffect(() => {
        if (p5InstanceRef.current) {
            p5InstanceRef.current.updateVotes(votes);
        }
    }, [votes]);

    return <div ref={sketchRef} />;
}
