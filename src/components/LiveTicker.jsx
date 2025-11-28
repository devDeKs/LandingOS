import React from 'react';
import { motion } from 'framer-motion';

const LiveTicker = () => {
    const stats = [
        "Verified Leads Generated: 14,203",
        "Active Clients: 89",
        "ROI Avg: 340%",
        "Conversion Rate: 32%",
        "Pages Deployed: 127",
        "Industries Served: 12"
    ];

    // Duplicate for seamless loop
    const duplicatedStats = [...stats, ...stats];

    return (
        <div className="fixed top-16 left-0 right-0 z-40 h-8 bg-white/10 backdrop-blur-md border-b border-white/10 overflow-hidden">
            <motion.div
                className="flex items-center h-full gap-8 whitespace-nowrap"
                animate={{
                    x: [0, -50 + '%']
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30,
                        ease: "linear"
                    }
                }}
            >
                {duplicatedStats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        {stat}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default LiveTicker;
