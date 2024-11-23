'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

export default function P5Sketch({ votes }) {
    const sketchRef = useRef();
    const p5InstanceRef = useRef();

    const imgIndex = (length, name, state) => {
        const degree = state[name] ? Math.abs(state[name]) : 0;
        return Math.min(degree, length - 1);
    }

    useEffect(() => {
        const sketch = (p) => {
            // Global
            let localVotes = votes || [];
            let globalState = localVotes.reduce(
                (accumulator, currentValue) => accumulator + currentValue.score,
                0) >= 0 ? 'good' : 'bad';

            // State
            let state = {};
            for (let i = 0; i < localVotes.length; i++) {
                if (localVotes[i].target in state) {
                    state[localVotes[i].target] += localVotes[i].score;
                } else {
                    state[localVotes[i].target] = localVotes[i].score;
                }
            }

            const changes = [];
            const exclamationLocation = {
                'bike_lane': [1920 / 2, 1080 / 2],
                'parking_lot': [838 / 2.13, 673 / 2.13],
                'public_transit': [2155 / 2.13, 916 / 2.13],
                'residence': [3113 / 2.13, 29 / 2.13],
            }

            // Images
            let bgGood, bgBad, exclamation,
                bikeLane, bikeLane1, bikeLane2, bikeLane3,
                parkingLot, parkingLot1, parkingLot2, parkingLot3,
                publicTransit, publicTransit1, publicTransit2, publicTransit3,
                residence, residence1, residence2, residence3, residence4,
                business, business1, business2, business3, business4,
                ecoFriendly, ecoFriendly1, ecoFriendly2, ecoFriendly3,
                localBusiness, localBusiness1, localBusiness2, localBusiness3, localBusiness4,
                manufacturing, manufacturing1, manufacturing2, manufacturing3,
                ecoTourism, ecoTourism1, ecoTourism2,
                festival, festival1, festival2, festival3,
                luxury, luxury1, luxury2,
                yearRoundTourism, yearRoundTourism1, yearRoundTourism2;

            p.preload = () => {
                bgGood = p.loadImage('/p5/bg/good.png');
                bgBad = p.loadImage('/p5/bg/bad.png');
                exclamation = p.loadImage('/p5/exclamation.png');

                // Q1
                bikeLane1 = p.loadImage('/p5/q1/bike_lane_1.png');
                bikeLane2 = p.loadImage('/p5/q1/bike_lane_2.png');
                bikeLane3 = p.loadImage('/p5/q1/bike_lane_3.png');
                bikeLane = [bikeLane1, bikeLane2, bikeLane3];

                parkingLot1 = p.loadImage('/p5/q1/parking_lot_1.png');
                parkingLot2 = p.loadImage('/p5/q1/parking_lot_2.png');
                parkingLot3 = p.loadImage('/p5/q1/parking_lot_3.png');
                parkingLot = [parkingLot1, parkingLot2, parkingLot3];

                publicTransit1 = p.loadImage('/p5/q1/public_transit_1.png');
                publicTransit2 = p.loadImage('/p5/q1/public_transit_2.png');
                publicTransit3 = p.loadImage('/p5/q1/public_transit_3.png');
                publicTransit = [publicTransit1, publicTransit2, publicTransit3];

                residence1 = p.loadImage('/p5/q1/residence_1.png');
                residence2 = p.loadImage('/p5/q1/residence_2.png');
                residence3 = p.loadImage('/p5/q1/residence_3.png');
                residence4 = p.loadImage('/p5/q1/residence_4.png');
                residence = [residence1, residence2, residence3, residence4];

                // Q2
                business1 = p.loadImage('/p5/q2/business_1.png');
                business2 = p.loadImage('/p5/q2/business_2.png');
                business3 = p.loadImage('/p5/q2/business_3.png');
                business4 = p.loadImage('/p5/q2/business_4.png');
                business = [business1, business2, business3, business4];

                ecoFriendly1 = p.loadImage('/p5/q2/eco_friendly_1.png');
                ecoFriendly2 = p.loadImage('/p5/q2/eco_friendly_2.png');
                ecoFriendly3 = p.loadImage('/p5/q2/eco_friendly_3.png');
                ecoFriendly = [ecoFriendly1, ecoFriendly2, ecoFriendly3];

                localBusiness1 = p.loadImage('/p5/q2/local_businesses_1.png');
                localBusiness2 = p.loadImage('/p5/q2/local_businesses_2.png');
                localBusiness3 = p.loadImage('/p5/q2/local_businesses_3.png');
                localBusiness4 = p.loadImage('/p5/q2/local_businesses_4.png');
                localBusiness = [localBusiness1, localBusiness2, localBusiness3, localBusiness4];

                manufacturing1 = p.loadImage('/p5/q2/manufacturing_1.png');
                manufacturing2 = p.loadImage('/p5/q2/manufacturing_2.png');
                manufacturing3 = p.loadImage('/p5/q2/manufacturing_3.png');
                manufacturing = [manufacturing1, manufacturing2, manufacturing3];

                // Q3
                ecoTourism1 = p.loadImage('/p5/q3/eco_tourism_1.png');
                ecoTourism2 = p.loadImage('/p5/q3/eco_tourism_2.png');
                ecoTourism = [ecoTourism1, ecoTourism2];

                festival1 = p.loadImage('/p5/q3/festival_1.png');
                festival2 = p.loadImage('/p5/q3/festival_2.png');
                festival3 = p.loadImage('/p5/q3/festival_3.png');
                festival = [festival1, festival2];

                luxury1 = p.loadImage('/p5/q3/luxury_1.png');
                luxury2 = p.loadImage('/p5/q3/luxury_2.png');
                luxury = [luxury1, luxury2];

                yearRoundTourism1 = p.loadImage('/p5/q3/year_round_tourism_1.png');
                yearRoundTourism2 = p.loadImage('/p5/q3/year_round_tourism_2.png');
                yearRoundTourism = [yearRoundTourism1, yearRoundTourism2];
            };

            p.setup = () => {
                p.createCanvas(1920, 1080);
            };

            p.draw = () => {
                p.image(globalState === 'good' ? bgGood : bgBad, 0, 0, 1920, 1080);

                // Q1
                p.image(bikeLane[imgIndex(3, 'bike_lane', state)], 0, 0, 1920, 1080);
                p.image(parkingLot[imgIndex(3, 'parking_lot', state)], 0, 0, 1920, 1080);
                p.image(publicTransit[imgIndex(3, 'public_transit', state)], 0, 0, 1920, 1080);
                p.image(residence[imgIndex(4, 'residence', state)], 0, 0, 1920, 1080);

                // Q2
                p.image(business[imgIndex(4, 'business', state)], 0, 0, 1920, 1080);
                p.image(ecoFriendly[imgIndex(3, 'eco_friendly', state)], 0, 0, 1920, 1080);
                p.image(localBusiness[imgIndex(4, 'local_businesses', state)], 0, 0, 1920, 1080);
                p.image(manufacturing[imgIndex(3, 'manufacturing', state)], 0, 0, 1920, 1080);

                // Q3
                p.image(ecoTourism[imgIndex(2, 'eco_tourism', state)], 0, 0, 1920, 1080);
                p.image(festival[imgIndex(3, 'festival', state)], 0, 0, 1920, 1080);
                p.image(luxury[imgIndex(2, 'luxury', state)], 0, 0, 1920, 1080);
                p.image(yearRoundTourism[imgIndex(2, 'year_round_tourism', state)], 0, 0, 1920, 1080);

                // Exclamation
                // for (let i = 0; i < changes.length; i++) {
                //     p.image(exclamation, exclamationLocation[changes[i]][0], exclamationLocation[changes[i]][1], 86, 281);
                // }
                // Vote UI
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
                globalState = localVotes.reduce(
                    (accumulator, currentValue) => accumulator + currentValue.score,
                    0) >= 0 ? 'good' : 'bad';

                state = {};
                for (let i = 0; i < localVotes.length; i++) {
                    if (localVotes[i].target in state) {
                        state[localVotes[i].target] += localVotes[i].score;
                    } else {
                        state[localVotes[i].target] = localVotes[i].score;
                    }
                }

                console.log(state);

                if (localVotes.length > 0) {
                    changes.push(localVotes[localVotes.length - 1].target);
                    setTimeout(() => changes.shift(), 10000);
                }
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
