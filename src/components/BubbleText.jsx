import React, { useState } from "react";

export const BubbleText = ({ text, className = "" }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <span
            onMouseLeave={() => setHoveredIndex(null)}
            className={`inline ${className}`}
        >
            {text.split("").map((char, idx) => {
                const distance = hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;

                let classes = "transition-all duration-300 ease-in-out cursor-default";

                switch (distance) {
                    case 0:
                        classes += " font-black text-orange-300";
                        break;
                    case 1:
                        classes += " font-bold text-orange-400";
                        break;
                    case 2:
                        classes += " font-semibold text-orange-400/80";
                        break;
                    default:
                        break;
                }

                return (
                    <span
                        key={idx}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        className={classes}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                );
            })}
        </span>
    );
};

export default BubbleText;
