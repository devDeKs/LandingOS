import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { User, Menu } from 'lucide-react';

const FloatingNavbar = ({ isMinimal = false }) => {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLogoClick = () => {
        if (isMinimal) {
            navigate('/');
        } else {
            scrollToSection('hero');
        }
    };

    // Track scroll position
    const { scrollY } = useScroll();

    // Create transforms for fade out and blur - only if NOT minimal
    const headerOpacity = useTransform(scrollY, [0, 150], [1, isMinimal ? 1 : 0]);
    const headerBlur = useTransform(scrollY, [0, 150], [0, isMinimal ? 0 : 10]);
    const headerY = useTransform(scrollY, [0, 150], [0, isMinimal ? 0 : -20]);

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
            className={cn(
                "fixed top-6 left-1/2 -translate-x-1/2 z-50",
                isMinimal ? "w-fit" : "w-full max-w-3xl px-4"
            )}
        >
            <nav className={cn(
                "w-full rounded-full",
                "bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20"
            )}>
                <div className={cn(
                    "flex h-14 items-center justify-between",
                    isMinimal ? "px-4 gap-12" : "px-6"
                )}>
                    {/* Logo */}
                    <div
                        className="flex items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                        onClick={handleLogoClick}
                    >
                        <img src="/logo.png" alt="LandingOS" className="h-6 w-auto object-contain" />
                    </div>

                    {/* Desktop Links - Hidden if minimal */}
                    {!isMinimal && (
                        <div className="hidden md:flex items-center space-x-8">
                            <button onClick={() => scrollToSection('community')} className="text-base font-medium text-white/70 hover:text-white transition-colors" style={{ fontFamily: "'Work Sans', sans-serif" }}>Comunidade</button>
                            <button onClick={() => scrollToSection('pricing')} className="text-base font-medium text-white/70 hover:text-white transition-colors" style={{ fontFamily: "'Work Sans', sans-serif" }}>Preço</button>
                        </div>
                    )}

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 text-sm font-medium transition-all text-white/80 hover:text-white" style={{ fontFamily: "'Work Sans', sans-serif" }}>
                            <User size={16} className="text-white/60" />
                            Entrar
                        </button>
                        {!isMinimal && (
                            <button className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white transition-all">
                                <Menu size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </motion.header>
    );
};

export default FloatingNavbar;
