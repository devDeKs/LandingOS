import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

// Utility for conditional classes
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Simplified Switch Component
const Switch = ({ checked, onCheckedChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030014]",
            checked ? "bg-purple-600" : "bg-slate-700"
        )}
    >
        <span
            className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
                checked ? "translate-x-5" : "translate-x-0"
            )}
        />
    </button>
);

const PricingSection = () => {
    const [isMonthly, setIsMonthly] = useState(true);

    // Plans data adapted for the new layout
    // Plans data with calculated installments
    const plans = [
        {
            name: "Essencial",
            price: "997,00",
            yearlyPrice: "9.570",
            yearlyInstallment: "797,50",
            period: "mês",
            features: [
                "Site profissional completo em 72h",
                "Dashboard de controle intuitivo",
                "Hospedagem premium (sem surpresas)",
                "Atualizações de segurança automáticas"
            ],
            description: "Ideal para quem fecha tickets de R$ 5-15k",
            buttonText: "Começar com Essencial",
            microcopy: "Início em menos de 24h",
            href: "#",
            isPopular: false,
        },
        {
            name: "Autoridade Digital",
            price: "1.497,00",
            yearlyPrice: "14.370",
            yearlyInstallment: "1.197,50",
            period: "mês",
            features: [
                "Tudo do Essencial, mais:",
                "Manutenção contínua (ajustes sob demanda)",
                "Suporte prioritário em 4 horas úteis",
                "Otimizações mensais de conversão"
            ],
            description: "Recomendado para tickets de R$ 15k+",
            buttonText: "Ativar Autoridade Total",
            microcopy: "Vagas limitadas para este mês",
            href: "#",
            isPopular: true,
            badgeText: "A escolha dos especialistas"
        },
    ];

    const handleToggle = (checked) => {
        setIsMonthly(!checked);
    };

    return (
        <section className="py-20 relative">
            {/* Fundo Translúcido Suave */}
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl border-y border-white/5">
                {/* Top border line - ethereal smooth white center, purple sides */}
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.05) 10%, rgba(168,85,247,0.1) 25%, rgba(168,85,247,0.2) 38%, rgba(220,200,255,0.3) 45%, rgba(255,255,255,0.5) 50%, rgba(220,200,255,0.3) 55%, rgba(168,85,247,0.2) 62%, rgba(168,85,247,0.1) 75%, rgba(168,85,247,0.05) 90%, transparent 100%)' }}></div>
                <div className="absolute -top-[1px] left-[45%] right-[45%] h-[4px] bg-white/10 blur-[3px]"></div>
            </div>

            {/* Upward glow effect - more diffuse */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-56 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-fuchsia-500/8 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[300px] h-24 bg-purple-400/12 rounded-full blur-[40px] pointer-events-none"></div>

            {/* Animated floating star dots - bursting from center */}
            <style>{`
                @keyframes burst-up-left-1 {
                    0% { transform: translate(0, 0); opacity: 0.3; }
                    100% { transform: translate(-80px, -40px); opacity: 0; }
                }
                @keyframes burst-up-left-2 {
                    0% { transform: translate(0, 0); opacity: 0.25; }
                    100% { transform: translate(-50px, -60px); opacity: 0; }
                }
                @keyframes burst-up-center {
                    0% { transform: translate(0, 0); opacity: 0.35; }
                    100% { transform: translate(0, -70px); opacity: 0; }
                }
                @keyframes burst-up-right-1 {
                    0% { transform: translate(0, 0); opacity: 0.25; }
                    100% { transform: translate(50px, -60px); opacity: 0; }
                }
                @keyframes burst-up-right-2 {
                    0% { transform: translate(0, 0); opacity: 0.3; }
                    100% { transform: translate(80px, -40px); opacity: 0; }
                }
                @keyframes burst-up-far-left {
                    0% { transform: translate(0, 0); opacity: 0.2; }
                    100% { transform: translate(-120px, -30px); opacity: 0; }
                }
                @keyframes burst-up-far-right {
                    0% { transform: translate(0, 0); opacity: 0.2; }
                    100% { transform: translate(120px, -30px); opacity: 0; }
                }
            `}</style>
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-white rounded-full blur-[0.5px] pointer-events-none" style={{ animation: 'burst-up-left-1 3s ease-out infinite', animationDelay: '0s' }}></div>
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-300 rounded-full blur-[1px] pointer-events-none" style={{ animation: 'burst-up-left-2 4s ease-out infinite', animationDelay: '0.5s' }}></div>
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full pointer-events-none" style={{ animation: 'burst-up-center 3.5s ease-out infinite', animationDelay: '0.2s' }}></div>
            <div className="absolute top-0 left-1/2 w-2.5 h-2.5 bg-fuchsia-300 rounded-full blur-[1px] pointer-events-none" style={{ animation: 'burst-up-right-1 4s ease-out infinite', animationDelay: '1s' }}></div>
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full pointer-events-none" style={{ animation: 'burst-up-right-2 3s ease-out infinite', animationDelay: '1.5s' }}></div>
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-purple-200 rounded-full blur-[0.5px] pointer-events-none" style={{ animation: 'burst-up-far-left 5s ease-out infinite', animationDelay: '0.8s' }}></div>
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full blur-[1px] pointer-events-none" style={{ animation: 'burst-up-far-right 5s ease-out infinite', animationDelay: '2s' }}></div>
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-fuchsia-200 rounded-full pointer-events-none" style={{ animation: 'burst-up-center 4.5s ease-out infinite', animationDelay: '2.5s' }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent pb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Escolha o nível do seu <span className="text-purple-glow">próximo salto</span>.
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        O custo de não ter o site certo é maior do que você imagina.
                    </p>
                </div>

                {/* Modern Toggle */}
                <div className="flex justify-center mb-16">
                    <div className="bg-white/5 p-1 rounded-xl border border-white/10 inline-flex relative">
                        <button
                            onClick={() => setIsMonthly(true)}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 relative z-10",
                                isMonthly ? "text-white" : "text-slate-400 hover:text-white"
                            )}
                        >
                            {isMonthly && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-white/10 rounded-lg shadow-sm"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">Mensal</span>
                        </button>
                        <button
                            onClick={() => setIsMonthly(false)}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 relative z-10",
                                !isMonthly ? "text-white" : "text-slate-400 hover:text-white"
                            )}
                        >
                            {!isMonthly && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-white/10 rounded-lg shadow-sm"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">Anual</span>
                            {/* Floating Badge */}
                            <span className="absolute -top-3 -right-3 bg-[#5b21b6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-purple-400/20">
                                -20% OFF
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{
                                y: 0,
                                opacity: 1,
                                scale: plan.isPopular ? 1.05 : 1
                            }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                                delay: index * 0.1
                            }}
                            className={cn(
                                `rounded-3xl p-8 relative flex flex-col h-full backdrop-blur-xl transition-all duration-300`,
                                plan.isPopular
                                    ? "bg-gradient-to-b from-[#2e1065] to-[#0f0728] border border-purple-500/30 shadow-[0_0_50px_rgba(88,28,135,0.15)] z-10"
                                    : "bg-white/5 border border-white/10 hover:bg-white/[0.07] z-0"
                            )}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6d28d9] to-[#4c1d95] py-1 px-4 rounded-full flex items-center shadow-[0_0_20px_rgba(109,40,217,0.4)] border border-white/10">
                                    <Star className="text-white h-3.5 w-3.5 fill-current mr-1.5" />
                                    <span className="text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                                        {plan.badgeText || "Mais Popular"}
                                    </span>
                                </div>
                            )}

                            <div className="flex-1 flex flex-col">
                                <p className={cn("text-lg font-semibold", plan.isPopular ? "text-purple-300" : "text-slate-400")}>
                                    {plan.name}
                                </p>

                                <div className="mt-6 flex items-baseline gap-x-2">
                                    <span className="text-5xl font-bold tracking-tight text-white">
                                        R$ {isMonthly ? plan.price : plan.yearlyInstallment}
                                    </span>
                                    <span className="text-sm font-semibold leading-6 tracking-wide text-slate-400">
                                        {isMonthly ? '/ mês' : <span className="text-slate-400">x12</span>}
                                    </span>
                                </div>

                                <p className="text-xs leading-5 text-slate-500 mt-2">
                                    {isMonthly ? "faturado mensalmente" : `faturado anualmente (R$ ${plan.yearlyPrice})`}
                                </p>

                                <ul className="mt-8 gap-4 flex flex-col mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className={cn("mt-1 rounded-full p-0.5", plan.isPopular ? "bg-purple-500/20" : "bg-white/10")}>
                                                <Check className={cn("h-3.5 w-3.5", plan.isPopular ? "text-purple-400" : "text-slate-400")} />
                                            </div>
                                            <span className="text-sm text-slate-300 text-left">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto pt-6 border-t border-white/10">
                                    <button
                                        className={cn(
                                            "w-full rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                                            plan.isPopular
                                                ? "bg-white text-purple-900 hover:bg-slate-100 shadow-lg shadow-purple-900/20"
                                                : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                        )}
                                    >
                                        {plan.buttonText}
                                    </button>
                                    {plan.microcopy && (
                                        <p className="mt-3 text-xs text-center text-slate-400 flex items-center justify-center gap-1.5">
                                            <span className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse ${plan.isPopular ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                                            {plan.microcopy}
                                        </p>
                                    )}
                                    <p className="mt-3 text-xs text-center text-slate-500">
                                        {plan.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
