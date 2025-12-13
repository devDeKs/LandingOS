import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, TrendingUp } from 'lucide-react';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export function FeaturesSection() {
    const features = [
        {
            icon: <Crown className="w-7 h-7" strokeWidth={1.5} />,
            title: "Pareça Tão Grande Quanto Você É",
            description: (
                <>
                    Para consultores, advogados e especialistas que <strong>não podem se dar ao luxo de parecer pequenos</strong>. Seu site precisa <strong>validar sua autoridade</strong> antes mesmo da primeira reunião.
                </>
            ),
        },
        {
            icon: <Zap className="w-7 h-7" strokeWidth={1.5} />,
            title: "72 Horas. Não 3 Meses.",
            description: (
                <>
                    Enquanto agências tradicionais te deixam esperando, você recebe um <strong>dashboard colaborativo</strong> onde aprova cada etapa <strong>em tempo real</strong>. <strong>Sem reuniões infinitas</strong>. Sem "estamos trabalhando nisso".
                </>
            ),
        },
        {
            icon: <TrendingUp className="w-7 h-7" strokeWidth={1.5} />,
            title: "Pare de Perder Contratos Por Causa do Seu Site",
            description: (
                <>
                    Se você fecha tickets de <strong>R$ 8 mil ou mais</strong>, perder <strong>UM contrato</strong> por causa de um site amador já custou mais do que investir na sua autoridade digital. <strong>Recupere seu posicionamento agora</strong>.
                </>
            ),
            featured: true,
        },
    ];

    return (
        <section className="relative py-20 px-4 md:px-6 overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-4 flex flex-col items-center gap-2 tracking-tight bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <span>Por Que Profissionais High-Ticket</span>
                        <span className="flex items-baseline gap-3">
                            Escolhem o{" "}
                            <span
                                className="font-extrabold tracking-tight bg-clip-text text-transparent pb-1"
                                style={{
                                    background: 'linear-gradient(180deg, hsla(0, 0%, 89%, 1) 15%, hsla(277, 36%, 79%, 1) 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                LandingOS
                            </span>
                        </span>
                    </h2>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

const FeatureCard = ({
    icon,
    title,
    description,
    index,
    featured,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "relative group rounded-3xl p-8 overflow-hidden border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-500",
                "hover:border-purple-500/20 hover:bg-white/[0.07]",
                "flex flex-col gap-4",
                featured && "md:col-span-2"
            )}
        >
            {/* Soft Purple Hover Gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Icon - Minimalist */}
            <div className="relative z-10 inline-flex items-center justify-center text-white/70 w-fit">
                {icon}
            </div>

            {/* Content */}
            <div className="relative z-10">
                <h3 className="text-2xl font-normal text-white mb-3 group-hover:text-purple-100 transition-colors duration-300 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300" style={{ fontFamily: "'Rounded', 'Nunito', sans-serif" }}>
                    {description}
                </p>
            </div>

            {/* Decorative Corner Glow - Very Soft */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full group-hover:bg-purple-500/10 transition-colors duration-700" />
        </motion.div>
    );
};

export default FeaturesSection;
