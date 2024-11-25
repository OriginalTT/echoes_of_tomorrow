import React from 'react';
import { motion } from 'framer-motion';

const Choice = React.memo(({ option, index, handleSelection, selectedAnswer }) => {
    const isDisabled = selectedAnswer !== null;
    const isSelected = selectedAnswer === index;

    return (
        <motion.label
            htmlFor={`option_${index}`}
            whileTap={{ scale: 0.95 }}
            className={`bg-[#FBFFEE] px-10 rounded-2xl w-full h-32 flex items-center cursor-pointer
                ${!isDisabled ? 'hover:bg-[#f0f0f0]' : 'opacity-50 cursor-not-allowed'}`}
        >
            <input
                type="radio"
                id={`option_${index}`}
                name="selected_option"
                value={index}
                onChange={(e) => handleSelection(e)}
                disabled={isDisabled}
                checked={isSelected}
                className="appearance-none"
            />
            <span className='text-[#5C5A32] font-semibold'>{option.label}</span>
        </motion.label>
    );
});

export default Choice;
