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
    const plans = [
        {
            name: "Dominância de Mercado",
            price: "990",
            yearlyPrice: "8900",
            period: "mês",
            features: [
                "Tudo do plano Autoridade",
                "Gestão de múltiplos domínios",
                "Infraestrutura dedicada",
                "Consultoria de conversão mensal",
                "SLA de 99.9% de uptime"
            ],
            description: "Para empresas que exigem infraestrutura robusta e escala ilimitada.",
            buttonText: "Falar com Vendas",
            href: "#",
            isPopular: false,
        },
        {
            name: "Autoridade High-Ticket",
            price: "470",
            yearlyPrice: "4500",
            period: "mês",
            features: [
                "Landing Page de Alta Conversão",
                "Otimização Neural de Design",
                "Integração com CRM",
                "Suporte prioritário 24/7",
                "Hospedagem Premium inclusa"
            ],
            description: "A escolha ideal para consultores e especialistas que querem parar de deixar dinheiro na mesa.",
            buttonText: "Começar Agora",
            href: "#",
            isPopular: true,
        },
    ];

    const handleToggle = (checked) => {
        setIsMonthly(!checked);
    };

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Fundo Translúcido Suave */}
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl border-y border-white/5"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-white font-manrope">
                        Invista na sua Autoridade
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Escolha a velocidade que você quer escalar.
                    </p>
                </div>

                <div className="flex justify-center mb-16 items-center gap-4">
                    <span className={cn("text-sm font-medium transition-colors", isMonthly ? "text-white" : "text-slate-500")}>
                        Mensal
                    </span>
                    <Switch
                        checked={!isMonthly}
                        onCheckedChange={handleToggle}
                    />
                    <span className={cn("text-sm font-medium transition-colors", !isMonthly ? "text-white" : "text-slate-500")}>
                        Anual <span className="text-purple-400 ml-1">(Economize 20%)</span>
                    </span>
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
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                                        Mais Popular
                                    </span>
                                </div>
                            )}

                            <div className="flex-1 flex flex-col">
                                <p className={cn("text-lg font-semibold", plan.isPopular ? "text-purple-300" : "text-slate-400")}>
                                    {plan.name}
                                </p>

                                <div className="mt-6 flex items-baseline gap-x-2">
                                    <span className="text-5xl font-bold tracking-tight text-white">
                                        R$ {isMonthly ? plan.price : plan.yearlyPrice}
                                    </span>
                                    <span className="text-sm font-semibold leading-6 tracking-wide text-slate-400">
                                        / {isMonthly ? 'mês' : 'ano'}
                                    </span>
                                </div>

                                <p className="text-xs leading-5 text-slate-500 mt-2">
                                    {isMonthly ? "faturado mensalmente" : "faturado anualmente"}
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
                                    <p className="mt-4 text-xs text-center text-slate-500">
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
