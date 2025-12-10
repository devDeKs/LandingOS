import React, { useState, useEffect, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { StarsBackground } from '../components/StarsBackground';
import FloatingNavbar from '../components/FloatingNavbar';

const ChatPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userInput = location.state?.userInput || '';
    const [editedInput, setEditedInput] = useState(userInput || '');

    // Update editedInput when userInput changes
    useEffect(() => {
        setEditedInput(userInput || '');
    }, [userInput]);

    // Remove white background glow from body
    useEffect(() => {
        const originalBg = document.body.style.background;
        const originalHtmlBg = document.documentElement.style.background;
        document.body.style.background = '#0a0a0f';
        document.documentElement.style.background = '#0a0a0f';

        return () => {
            document.body.style.background = originalBg;
            document.documentElement.style.background = originalHtmlBg;
        };
    }, []);

    const handleSubmit = () => {
        // Handle submit logic here
        console.log('Submitted:', editedInput);
        // You can add your submit logic here
    };

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <StarsBackground
            className="min-h-screen fixed inset-0"
            starColor="#a855f7"
            speed={60}
            factor={0.03}
        >
            <div className="min-h-screen relative overflow-hidden">
                {/* Navbar */}
                <FloatingNavbar isMinimal={true} />

                {/* Ambient Glows */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Modal */}
                <div className="min-h-screen flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl"
                    >
                        <div className="relative bg-[#0f0f15]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>

                            <div className="relative p-8 md:p-12 z-10">
                                {/* Avatar */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-lg shadow-purple-500/30 ring-2 ring-purple-500/20">
                                            {/* Simple face SVG */}
                                            <svg
                                                width="48"
                                                height="48"
                                                viewBox="0 0 48 48"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="md:w-14 md:h-14"
                                            >
                                                {/* Eyes */}
                                                <circle cx="16" cy="18" r="2.5" fill="#0A0A0B" />
                                                <circle cx="32" cy="18" r="2.5" fill="#0A0A0B" />
                                                {/* Nose */}
                                                <path
                                                    d="M24 22 Q22 24 20 24"
                                                    stroke="#0A0A0B"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    fill="none"
                                                />
                                                {/* Mouth - slightly off-center, thoughtful */}
                                                <path
                                                    d="M20 28 Q24 30 28 28"
                                                    stroke="#0A0A0B"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    fill="none"
                                                />
                                            </svg>
                                        </div>
                                        {/* Purple glow around avatar */}
                                        <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-2xl -z-10"></div>
                                        <div className="absolute inset-0 rounded-full bg-purple-400/15 blur-xl -z-10"></div>
                                    </div>
                                </div>

                                {/* Title */}
                                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4" style={{ fontFamily: "'Work Sans', sans-serif" }}>
                                    Olá, eu sou o Landi
                                </h2>

                                {/* Description */}
                                <p className="text-base md:text-lg text-white/80 text-center leading-relaxed mb-8 max-w-xl mx-auto" style={{ fontFamily: "'Work Sans', sans-serif" }}>
                                    Eu vou te guiar na criação do seu site a partir de agora. Antes de iniciarmos você gostaria de fazer alguma alteração no seu pedido?
                                </p>

                                {/* User Input Block */}
                                {userInput && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mt-8 space-y-4"
                                    >
                                        <div className="relative">
                                            <textarea
                                                value={editedInput}
                                                onChange={(e) => setEditedInput(e.target.value)}
                                                className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white/90 text-base font-light focus:outline-none focus:border-white/20 resize-none min-h-[120px] leading-relaxed relative z-10"
                                                style={{ fontFamily: "'Work Sans', sans-serif" }}
                                                placeholder="Descreva sua ideia..."
                                            />
                                        </div>
                                        <button
                                            onClick={handleSubmit}
                                            className="group w-fit h-8 px-4 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/60 hover:text-white font-medium transition-all duration-300 hover:bg-gradient-to-br hover:from-[#000005] hover:via-[#140040] hover:to-[#4000BF] hover:border-[#4000BF]/50 hover:shadow-[0_0_20px_rgba(64,0,191,0.4)] active:bg-gradient-to-br active:from-[#000005] active:via-[#140040] active:to-[#4000BF] active:border-[#4000BF]/50 active:shadow-[0_0_20px_rgba(64,0,191,0.4)] flex items-center justify-center gap-2 ml-auto"
                                            style={{ fontFamily: "'Work Sans', sans-serif" }}
                                        >
                                            <span className="text-sm">Iniciar</span>
                                            <ArrowUpRight size={16} strokeWidth={2} />
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div >
                </div >
            </div >
        </StarsBackground>
    );
};

export default ChatPage;

