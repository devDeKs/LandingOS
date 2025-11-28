import { cn } from "../../lib/utils";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

function DisplayCard({
    className,
    icon = <Sparkles className="w-4 h-4 text-blue-300" />,
    title = "Featured",
    description = "Discover amazing content",
    date = "Just now",
    iconClassName = "text-blue-500",
    titleClassName = "text-blue-500",
    index = 0,
    isHovered = false,
}) {
    // Calculate rotation based on index and hover state
    const getRotation = () => {
        if (!isHovered) return 0;
        if (index === 0) return -5;
        if (index === 1) return 0;
        if (index === 2) return 5;
        return 0;
    };

    const getTranslateY = () => {
        if (!isHovered) return 0;
        return index * -8; // Spread cards vertically when hovered
    };

    return (
        <motion.div
            animate={{
                rotate: getRotation(),
                y: getTranslateY(),
                scale: isHovered ? 1.02 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 1.2, // Heavy feel
            }}
            className={cn(
                "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 bg-white/80 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-white after:to-transparent after:content-[''] hover:border-blue-500/20 hover:bg-white [&>*]:flex [&>*]:items-center [&>*]:gap-2 shadow-xl cursor-pointer",
                className
            )}
        >
            <div>
                <span className="relative inline-block rounded-full bg-blue-100 p-1">
                    {icon}
                </span>
                <p className={cn("text-lg font-medium", titleClassName)}>{title}</p>
            </div>
            <p className="whitespace-nowrap text-lg text-slate-700">{description}</p>
            <p className="text-slate-400 text-sm">{date}</p>
        </motion.div>
    );
}

export default function DisplayCards({ cards }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700 py-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {cards?.map((cardProps, index) => (
                <DisplayCard
                    key={index}
                    {...cardProps}
                    index={index}
                    isHovered={isHovered}
                />
            ))}
        </div>
    );
}
