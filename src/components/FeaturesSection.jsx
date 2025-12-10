import React from 'react';
import {
    Crown,
    Rocket,
    TrendingUp,
    Brain,
} from 'lucide-react';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export function FeaturesSection() {
    const features = [
        {
            title: "Feito para Líderes",
            description:
                "Para profissionais High-Ticket e empresas que não podem se dar ao luxo de parecer amadores.",
            icon: <Crown />,
        },
        {
            title: "Infraestrutura Pronta",
            description:
                "Não perca tempo com servidores ou design. Nós entregamos sua autoridade digital pronta para escalar.",
            icon: <Rocket />,
        },
        {
            title: "Investimento em Autoridade",
            description:
                "Cada contrato perdido por presença digital inferior pode custar 8x mais que investir na sua autoridade. Recupere seu posicionamento de mercado agora.",
            icon: <TrendingUp />,
            featured: true,
        },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 py-10 max-w-5xl mx-auto">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
    featured,
}) => {
    return (
        <div
            className={cn(
                "flex flex-col py-10 relative group/feature border-white/10",
                // Mobile borders
                index !== 2 && "border-b md:border-b-0",

                // Desktop Grid Borders
                index === 0 && "md:border-r md:border-b",
                index === 1 && "md:border-b",

                // Featured Card Styling
                featured && "md:col-span-2 md:items-center md:text-center"
            )}
        >
            <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />

            {featured && (
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-30 pointer-events-none" />
            )}


            <div className="mb-4 relative z-10 px-10 text-purple-400 transition-colors duration-300">
                {icon}
            </div>

            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                {!featured && (
                    <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-white/20 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                )}
                <span className={cn(
                    "transition duration-200 inline-block text-white",
                    !featured && "group-hover/feature:translate-x-2"
                )}>
                    {title}
                </span>
            </div>

            <p className={cn(
                "text-sm max-w-xs relative z-10 px-10",
                featured ? "text-white/80 max-w-lg" : "text-white/70"
            )}>
                {description}
            </p>
        </div>
    );
};

export default FeaturesSection;
