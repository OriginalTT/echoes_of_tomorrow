'use client';

import Image from "next/image"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
    '/onboarding_0.png',
    '/onboarding_1.png',
]

const descriptions = [
    'Answer the questions by select an option to see changes made on the projected screen.',
    'Check the scale on the bottom of the projected screen to track your progress. '
]

const variants = {
    enter: (direction) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        };
    }
};

const wrap = (min, max, v) => {
    const range = max - min;

    if (range <= 0) {
        throw new Error('The `max` must be greater than `min`.');
    }

    if (typeof v === 'undefined') {
        return (value) => wrap(min, max, value);
    }

    // Normalize the value within the range [0, range)
    const normalized = ((v - min) % range + range) % range;

    return normalized + min;
}

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

export default function Welcome({ exitWelcome }) {
    const [[page, direction], setPage] = useState([0, 0]);
    const [onBoarding, setOnBoarding] = useState(false);

    const imageIndex = wrap(0, images.length, page);

    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };

    const onBoardingStart = () => {
        setOnBoarding(true);
    }

    return (
        <main >
            <AnimatePresence initial={false} custom={direction} mode="wait">
                {!onBoarding ?
                    <motion.div
                        key="welcome"
                        exit={{ opacity: 0, scale: 1.1 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-screen h-screen flex flex-col items-center justify-center gap-12">
                        <Image src={'/logo_vertical.png'} alt="Logo" width={200} height={266} />
                        <motion.button
                            className="bg-white text-[#69860C] 
                                    font-bold text-[20px] 
                                    px-28 py-3
                                    rounded-full
                                    hover:bg-slate-50"
                            whileTap={{ scale: 0.95 }}
                            onClick={onBoardingStart}
                        >
                            Start
                        </motion.button>
                    </motion.div>
                    : null}
                {onBoarding ?
                    <motion.div
                        key="onboarding"
                        exit={{ opacity: 0, scale: 1.1 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-screen h-screen flex flex-col items-center justify-between"
                    >
                        <Image src={'/logo_horizontal.png'} alt="Logo" width={180} height={50} quality={100}
                            className="mt-5" />
                        <div className="flex flex-col items-center gap-8">
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.div
                                    className="flex flex-col items-center justify-center gap-8 p-10"
                                    key={page}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = swipePower(offset.x, velocity.x);
                                        if (swipe < -swipeConfidenceThreshold) {
                                            paginate(1);
                                        } else if (swipe > swipeConfidenceThreshold) {
                                            paginate(-1);
                                        }
                                    }}>
                                    <Image src={images[imageIndex]} alt="Onboarding" width={150} height={150} />
                                    <p className="text-white text-center text-lg font-bold h-[100px]">{descriptions[imageIndex]}</p>
                                </motion.div>
                            </AnimatePresence>
                            <div className="flex gap-6 items-center justify-center">
                                {images.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-[10px] h-[10px] ${index == imageIndex ? "bg-white" : "bg-[#E1E1E1]"} rounded-full`}
                                        animate={{ duration: 0.5 }} />
                                ))}
                            </div>
                        </div>
                        {imageIndex == images.length - 1 ? (
                            <div className="flex w-full items-center justify-center h-">
                                <motion.button
                                    className="bg-white text-[#69860C] 
                                    font-bold text-[20px] 
                                    px-28 py-3 mb-32
                                    rounded-full
                                    hover:bg-slate-50 z-10"
                                    whileTap={{ scale: 0.95 }}
                                    onClick={exitWelcome}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    Continue
                                </motion.button>
                            </div>
                        ) : <div className="h-[182px]" />}
                    </motion.div>
                    : null}
            </AnimatePresence>
        </main >
    )
}
