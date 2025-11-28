import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Terminal, CheckCircle2 } from 'lucide-react';

const TechIntegrationSection = ({ onOpenChat }) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <section id="intelligence" className="py-32 px-4 relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-bold leading-tight text-slate-900 tracking-tight">
                                Beleza encontra <br />
                                <span className="text-blue-600">Inteligência.</span>
                            </h2>
                            <p className="text-slate-600 text-lg mt-6 leading-relaxed">
                                Não basta ser bonito. Adicione o motor de busca de leads <strong>LandingOS</strong> ao seu site e transforme visitantes em contratos reais.
                            </p>
                        </motion.div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-slate-900">Ativar Scraping</span>
                            <button
                                onClick={() => setIsActive(!isActive)}
                                className={cn(
                                    "w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out relative shadow-inner",
                                    isActive ? "bg-blue-600" : "bg-slate-200"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300",
                                    isActive ? "translate-x-6" : "translate-x-0"
                                )} />
                            </button>
                        </div>

                        <button
                            onClick={onOpenChat}
                            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            Potencializar com Dados
                            <Terminal className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Interactive Visual - DARK Window Style for Contrast */}
                    <div className="relative h-[500px] w-full glass-window-dark flex flex-col">
                        {/* Window Title Bar */}
                        <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="flex-1 text-center text-xs font-mono text-white/40">
                                landing-os-terminal — zsh
                            </div>
                        </div>

                        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {!isActive ? (
                                    <motion.div
                                        key="visual"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center p-8"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mx-auto mb-6 blur-xl opacity-50 animate-pulse" />
                                        <h3 className="text-2xl font-bold mb-2 text-white">Site Padrão</h3>
                                        <p className="text-slate-400">Bonito, mas passivo.</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="terminal"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full p-6 font-mono text-xs md:text-sm text-green-400 overflow-hidden flex flex-col text-left"
                                    >
                                        <div className="space-y-2 opacity-80">
                                            <p>&gt; Initializing LandingOS Engine...</p>
                                            <p>&gt; Target: Medical Sector [Sao Paulo]</p>
                                            <p className="text-blue-400">&gt; Scanning for high-ticket leads...</p>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <p className="text-white">&gt; Found: Dr. Roberto (Plastic Surgeon)</p>
                                                <p className="text-white">&gt; Found: Clínica Bem Estar (Dermatology)</p>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 1.5 }}
                                                className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded"
                                            >
                                                <div className="flex items-center gap-2 text-green-400 font-bold">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>+15 Leads Qualified</span>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TechIntegrationSection;
