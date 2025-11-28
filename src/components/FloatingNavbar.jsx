import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../lib/utils';
import { LayoutGrid, Cpu } from 'lucide-react';

const FloatingNavbar = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navItems = [
        { id: 'work', label: 'Work', icon: LayoutGrid },
        { id: 'intelligence', label: 'Intelligence', icon: Cpu },
    ];

    // Track scroll position
    const { scrollY } = useScroll();

    // Create transforms for fade out and blur
    const headerOpacity = useTransform(scrollY, [0, 150], [1, 0]);
    const headerBlur = useTransform(scrollY, [0, 150], [0, 10]);
    const headerY = useTransform(scrollY, [0, 150], [0, -20]);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
                opacity: headerOpacity,
                filter: useTransform(headerBlur, (blur) => `blur(${blur}px)`),
                y: headerY,
            }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
        >
            <nav className={cn(
                "flex items-center gap-8 px-6 py-2 rounded-full",
                "bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20"
            )}>
                {/* Logo */}
                <div
                    className="flex items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                    onClick={() => scrollToSection('hero')}
                >
                    <img src="/logo.png" alt="LandingOS" className="h-7 w-auto object-contain" />
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="group flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-all"
                            title={item.label}
                        >
                            <item.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                        </button>
                    ))}
                </div>
            </nav>
        </motion.header>
    );
};

export default FloatingNavbar;
