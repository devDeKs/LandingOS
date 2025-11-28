import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot } from 'lucide-react';

const ChatModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({ name: '', niche: '', goal: '' });

    const questions = [
        "Olá! Sou o LandingOS Architect. Qual é o seu nome?",
        "Prazer! Qual é o nicho do seu negócio?",
        "Qual é o principal objetivo com o novo sistema?"
    ];

    const handleNext = (e) => {
        e.preventDefault();
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setStep(3); // Success state
        }
    };

    const handleChange = (e) => {
        const fields = ['name', 'niche', 'goal'];
        setFormData({ ...formData, [fields[step]]: e.target.value });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal - Light Window Style */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="fixed inset-0 m-auto z-[70] w-full max-w-lg h-fit p-4"
                    >
                        <div className="glass-window w-full">
                            {/* Window Title Bar */}
                            <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400 cursor-pointer hover:bg-red-500" onClick={onClose} />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <span className="text-xs font-semibold text-slate-500 tracking-wide">LandingOS Architect</span>
                                <div className="w-10" /> {/* Spacer for centering */}
                            </div>

                            <div className="p-8 min-h-[350px] flex flex-col justify-center relative bg-white">
                                {step < 3 ? (
                                    <form onSubmit={handleNext} className="space-y-6">
                                        <motion.div
                                            key={step}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 shadow-sm">
                                                <Bot className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2 text-slate-900">Architect AI</h3>
                                            <p className="text-xl text-slate-600 leading-relaxed font-medium">
                                                {questions[step]}
                                            </p>
                                        </motion.div>

                                        <div className="relative">
                                            <input
                                                type="text"
                                                autoFocus
                                                value={step === 0 ? formData.name : step === 1 ? formData.niche : formData.goal}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-b-2 border-slate-200 py-3 text-lg focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-300 text-slate-900"
                                                placeholder="Digite sua resposta..."
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                <Send className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex gap-1 mt-8">
                                            {[0, 1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-blue-600' : 'bg-slate-100'}`}
                                                />
                                            ))}
                                        </div>
                                    </form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center"
                                    >
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-green-200">
                                            <Bot className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 text-slate-900">Dados Processados!</h3>
                                        <p className="text-slate-600 mb-8">
                                            O sistema LandingOS analisará seu perfil e nossa equipe entrará em contato em breve.
                                        </p>
                                        <button
                                            onClick={onClose}
                                            className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg"
                                        >
                                            Voltar ao Sistema
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatModal;
