import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '../lib/utils';

const PricingSection = ({ onOpenChat }) => {
    const features = [
        { name: 'Design Exclusivo', basic: true, pro: true },
        { name: 'Copywriting Persuasivo', basic: true, pro: true },
        { name: 'Otimização Mobile', basic: true, pro: true },
        { name: 'Animações Premium', basic: false, pro: true },
        { name: 'Scraper de Leads (IA)', basic: false, pro: true },
        { name: 'Dashboard de ROI', basic: false, pro: true },
    ];

    return (
        <section id="plans" className="py-32 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-metallic">Escolha sua Potência.</h2>
                    <p className="text-titanium text-lg">Investimento único. Retorno recorrente.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Plan */}
                    <div className="glass-panel rounded-3xl p-8 flex flex-col relative hover:bg-white/[0.07] transition-colors">
                        <h3 className="text-2xl font-bold mb-2">Landing Page</h3>
                        <p className="text-titanium text-sm mb-8">O essencial para se posicionar.</p>
                        <div className="text-4xl font-bold mb-8">R$ 2.500</div>

                        <div className="space-y-4 mb-8 flex-1">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    {feature.basic ? (
                                        <Check className="w-5 h-5 text-white" />
                                    ) : (
                                        <X className="w-5 h-5 text-white/20" />
                                    )}
                                    <span className={cn("text-sm", feature.basic ? "text-white" : "text-white/40")}>
                                        {feature.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={onOpenChat}
                            className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold"
                        >
                            Selecionar Padrão
                        </button>
                    </div>

                    {/* Pro Plan - LandingOS One */}
                    <div className="glass-panel rounded-3xl p-8 flex flex-col relative border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors shadow-[0_0_50px_rgba(99,102,241,0.1)]">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-lg">
                            Recomendado
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-2xl font-bold">LandingOS One</h3>
                            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text font-bold text-xs border border-indigo-500/30 px-2 py-0.5 rounded">ECOSYSTEM</span>
                        </div>
                        <p className="text-titanium text-sm mb-8">Design + Inteligência de Dados.</p>
                        <div className="text-4xl font-bold mb-8">R$ 4.000</div>

                        <div className="space-y-4 mb-8 flex-1">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    {feature.pro ? (
                                        <Check className="w-5 h-5 text-indigo-400" />
                                    ) : (
                                        <X className="w-5 h-5 text-white/20" />
                                    )}
                                    <span className={cn("text-sm", feature.pro ? "text-white" : "text-white/40")}>
                                        {feature.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={onOpenChat}
                            className="w-full py-4 rounded-xl bg-white text-black hover:bg-gray-100 transition-colors font-bold shadow-lg"
                        >
                            Começar Agora
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
