import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, BarChart3 } from 'lucide-react';
import DisplayCards from './ui/display-cards';

const ShowcaseSection = () => {
    const cards = [
        {
            icon: <Monitor className="w-4 h-4 text-blue-500" />,
            title: "Dr. Silva & Partners",
            description: "Cirurgia Plástica Premium",
            date: "2024",
            titleClassName: "text-blue-600",
            className: "hover:border-blue-400"
        },
        {
            icon: <BarChart3 className="w-4 h-4 text-emerald-500" />,
            title: "Global Partners",
            description: "Consultoria Financeira",
            date: "2024",
            titleClassName: "text-emerald-600",
            className: "hover:border-emerald-400"
        },
        {
            icon: <Smartphone className="w-4 h-4 text-purple-500" />,
            title: "Neon Mobile App",
            description: "Fintech Launch Page",
            date: "2024",
            titleClassName: "text-purple-600",
            className: "hover:border-purple-400"
        }
    ];

    return (
        <section id="work" className="py-16 px-4 relative">
            <div className="max-w-7xl mx-auto mb-16 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 tracking-tight"
                >
                    Selected Work
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 text-xl"
                >
                    Projetos que definem novos padrões.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
            >
                <DisplayCards cards={cards} />
            </motion.div>
        </section>
    );
};

export default ShowcaseSection;
