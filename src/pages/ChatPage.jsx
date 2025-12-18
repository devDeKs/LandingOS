import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Crown, TrendingUp, Rocket, Sparkles, Zap, Car, Globe, Server, Check,
    ArrowUpRight, X, Users, Briefcase, Target, Palette, Clock, Shield,
    DollarSign, Star, Building, User, Heart, Award, Lightbulb
} from 'lucide-react';
import { StarsBackground } from '../components/StarsBackground';
import FloatingNavbar from '../components/FloatingNavbar';

// ===============================
// Quiz Configuration - 10 Vertices System
// ===============================
// Each answer has points that contribute to the final recommendation
// This creates a sophisticated segmentation system

const QUIZ_STEPS = [
    {
        id: 'intro',
        type: 'intro'
    },
    {
        id: 'ticket_size',
        question: "Qual o valor médio dos seus contratos?",
        subtitle: "Isso me ajuda a calibrar a sofisticação do seu posicionamento.",
        options: [
            { id: 'starter', label: 'Até R$ 5.000', icon: Sparkles, description: 'Começando a escalar', points: { essential: 3, authority: 0 } },
            { id: 'growing', label: 'R$ 5.000 - 15.000', icon: TrendingUp, description: 'Em crescimento', points: { essential: 2, authority: 1 } },
            { id: 'high', label: 'R$ 15.000 - 50.000', icon: Crown, description: 'High-ticket consolidado', points: { essential: 0, authority: 3 } },
            { id: 'premium', label: 'Acima de R$ 50.000', icon: Award, description: 'Ultra premium', points: { essential: 0, authority: 4 } }
        ]
    },
    {
        id: 'profession',
        question: "Qual área melhor descreve sua atuação?",
        subtitle: "Cada nicho tem nuances visuais específicas para transmitir autoridade.",
        options: [
            { id: 'consultant', label: 'Consultoria / Mentoria', icon: Lightbulb, description: 'Conhecimento aplicado', points: { essential: 1, authority: 2 } },
            { id: 'health', label: 'Saúde / Bem-estar', icon: Heart, description: 'Medicina, estética, terapias', points: { essential: 1, authority: 2 } },
            { id: 'legal', label: 'Advocacia / Contabilidade', icon: Briefcase, description: 'Serviços especializados', points: { essential: 2, authority: 1 } },
            { id: 'creative', label: 'Arquitetura / Design', icon: Palette, description: 'Projetos criativos', points: { essential: 1, authority: 2 } },
            { id: 'tech', label: 'Tecnologia / SaaS', icon: Zap, description: 'Soluções digitais', points: { essential: 2, authority: 1 } },
            { id: 'real_estate', label: 'Imobiliário / Investimentos', icon: Building, description: 'Mercado de alto valor', points: { essential: 0, authority: 3 } }
        ]
    },
    {
        id: 'objective',
        question: "O que você mais precisa agora?",
        subtitle: "Entender sua prioridade me permite focar no que realmente importa.",
        options: [
            { id: 'authority', label: 'Parecer tão grande quanto eu sou', icon: Crown, description: 'Posicionamento de mercado', points: { essential: 0, authority: 3, needsAuthority: true } },
            { id: 'leads', label: 'Gerar mais leads qualificados', icon: Target, description: 'Conversão e aquisição', points: { essential: 2, authority: 1, needsConversion: true } },
            { id: 'rebrand', label: 'Renovar minha imagem digital', icon: Sparkles, description: 'Atualização necessária', points: { essential: 1, authority: 2 } },
            { id: 'launch', label: 'Lançar um novo produto/serviço', icon: Rocket, description: 'Ir ao mercado rapidamente', points: { essential: 2, authority: 1, needsSpeed: true } }
        ]
    },
    {
        id: 'current_site',
        question: "Como está seu site atual?",
        subtitle: "Saber de onde partimos me ajuda a calcular o salto de autoridade.",
        options: [
            { id: 'none', label: 'Não tenho site', icon: Globe, description: 'Começando do zero', points: { essential: 2, authority: 1, noSite: true } },
            { id: 'basic', label: 'Tenho, mas parece amador', icon: X, description: 'Prejudica minha imagem', points: { essential: 1, authority: 2, hasOldSite: true } },
            { id: 'outdated', label: 'Funcional, mas desatualizado', icon: Clock, description: 'Precisa de modernização', points: { essential: 2, authority: 1 } },
            { id: 'decent', label: 'Razoável, mas não me diferencia', icon: Users, description: 'Falta personalidade', points: { essential: 1, authority: 2 } }
        ]
    },
    {
        id: 'urgency',
        question: "Qual sua urgência para ter o site no ar?",
        subtitle: "A velocidade é um fator crítico para alguns projetos.",
        options: [
            { id: 'asap', label: 'Preciso para ontem!', icon: Zap, description: 'Máxima urgência', points: { essential: 1, authority: 2, urgent: true } },
            { id: 'week', label: 'Nos próximos 7 dias', icon: Clock, description: 'Prazo apertado', points: { essential: 1, authority: 2 } },
            { id: 'month', label: 'Dentro de 30 dias', icon: Target, description: 'Prazo confortável', points: { essential: 2, authority: 1 } },
            { id: 'planning', label: 'Estou apenas planejando', icon: Lightbulb, description: 'Pesquisa inicial', points: { essential: 3, authority: 0 } }
        ]
    },
    {
        id: 'team',
        question: "Qual o tamanho da sua operação?",
        subtitle: "Isso me ajuda a dimensionar a complexidade da infraestrutura.",
        options: [
            { id: 'solo', label: 'Sou o negócio (solo)', icon: User, description: 'Operação individual', points: { essential: 3, authority: 0 } },
            { id: 'small', label: 'Equipe pequena (2-5)', icon: Users, description: 'Time enxuto', points: { essential: 2, authority: 1 } },
            { id: 'medium', label: 'Empresa estruturada (6-20)', icon: Building, description: 'Operação consolidada', points: { essential: 0, authority: 3 } },
            { id: 'large', label: 'Grande operação (20+)', icon: Award, description: 'Escala significativa', points: { essential: 0, authority: 4 } }
        ]
    },
    {
        id: 'design_style',
        question: "Que sensação seu site deve transmitir?",
        subtitle: "O design certo fala diretamente com seu cliente ideal.",
        options: [
            { id: 'minimalist', label: 'Minimalista & Clean', icon: Sparkles, description: 'Menos é mais', style: 'minimalist' },
            { id: 'bold', label: 'Impactante & Bold', icon: Zap, description: 'Presença marcante', style: 'bold' },
            { id: 'elegant', label: 'Elegante & Sofisticado', icon: Crown, description: 'Luxo discreto', style: 'elegant' },
            { id: 'modern', label: 'Moderno & Tecnológico', icon: Rocket, description: 'Inovação visual', style: 'modern' }
        ]
    },
    {
        id: 'support_need',
        question: "Como você prefere trabalhar conosco?",
        subtitle: "Cada estilo de parceria tem vantagens diferentes.",
        options: [
            { id: 'hands_off', label: 'Façam tudo pra mim', icon: Shield, description: 'Done-for-you completo', points: { essential: 0, authority: 3, needsSupport: true } },
            { id: 'collaborative', label: 'Quero participar das decisões', icon: Users, description: 'Processo colaborativo', points: { essential: 1, authority: 2 } },
            { id: 'guided', label: 'Me guiem, eu aprovo', icon: Target, description: 'Orientação + autonomia', points: { essential: 2, authority: 1 } }
        ]
    },
    {
        id: 'analysis',
        type: 'analysis'
    },
    {
        id: 'proposal',
        type: 'proposal'
    }
];

// Analysis animation texts
const ANALYSIS_TEXTS = [
    "Analisando perfil de autoridade...",
    "Mapeando posicionamento ideal...",
    "Calibrando elementos visuais...",
    "Calculando ROI estimado...",
    "Encontrando a melhor estratégia..."
];

// ===============================
// Recommendation Logic Engine
// ===============================
const calculateRecommendation = (answers) => {
    let essentialPoints = 0;
    let authorityPoints = 0;
    const flags = {};

    // Sum up points from all answers
    Object.values(answers).forEach(answer => {
        if (answer.points) {
            essentialPoints += answer.points.essential || 0;
            authorityPoints += answer.points.authority || 0;
        }
        // Collect flags
        Object.keys(answer).forEach(key => {
            if (key !== 'points' && key !== 'id' && key !== 'label' && answer[key] === true) {
                flags[key] = true;
            }
        });
    });

    // Determine recommendation
    const isAuthority = authorityPoints > essentialPoints;
    const difference = Math.abs(authorityPoints - essentialPoints);
    const confidence = difference > 5 ? 'high' : difference > 2 ? 'medium' : 'low';

    // Generate personalized insights based on answers
    const insights = generateInsights(answers, flags, isAuthority);

    return {
        plan: isAuthority ? 'authority' : 'essential',
        essentialPoints,
        authorityPoints,
        confidence,
        flags,
        insights
    };
};

const generateInsights = (answers, flags, isAuthority) => {
    const insights = [];

    // Ticket size insights
    if (answers.ticket_size?.id === 'premium' || answers.ticket_size?.id === 'high') {
        insights.push({
            icon: DollarSign,
            title: "Alto Retorno por Conversão",
            text: "Com tickets dessa magnitude, recuperar o investimento com apenas 1 contrato adicional."
        });
    }

    // Authority need
    if (flags.needsAuthority) {
        insights.push({
            icon: Crown,
            title: "Posicionamento de Liderança",
            text: "Seu site precisa validar sua autoridade antes mesmo da primeira reunião."
        });
    }

    // No current site
    if (flags.noSite) {
        insights.push({
            icon: Rocket,
            title: "Do Zero ao Topo",
            text: "Vantagem: construir do zero significa design 100% alinhado com sua nova fase."
        });
    }

    // Has old site hurting image
    if (flags.hasOldSite) {
        insights.push({
            icon: Shield,
            title: "Recuperação de Autoridade",
            text: "Sites amadores afastam clientes premium. A mudança visual terá impacto imediato."
        });
    }

    // Urgency
    if (flags.urgent) {
        insights.push({
            icon: Zap,
            title: "Entrega Acelerada",
            text: "Com nossa infraestrutura pronta, conseguimos entregar em 72 horas ou menos."
        });
    }

    // Needs full support
    if (flags.needsSupport) {
        insights.push({
            icon: Shield,
            title: "Suporte Prioritário",
            text: "O plano Autoridade inclui suporte em até 4 horas úteis e manutenção contínua."
        });
    }

    // Design style
    if (answers.design_style?.style) {
        insights.push({
            icon: Palette,
            title: `Design ${answers.design_style.label}`,
            text: "Aplicaremos essa linguagem visual em toda a experiência do seu site."
        });
    }

    // Team size implications
    if (answers.team?.id === 'medium' || answers.team?.id === 'large') {
        insights.push({
            icon: Building,
            title: "Escala Profissional",
            text: "Para operações do seu porte, recomendamos infraestrutura que suporte crescimento."
        });
    }

    return insights.slice(0, 4); // Max 4 insights
};

// ===============================
// Landi Avatar Component
// ===============================
const LandiAvatar = ({ isThinking = false, size = 'large', mood = 'neutral' }) => {
    const sizeClasses = {
        large: 'w-28 h-28 md:w-36 md:h-36',
        medium: 'w-20 h-20 md:w-28 md:h-28',
        small: 'w-16 h-16 md:w-20 md:h-20'
    };

    // Different mouth shapes for different moods
    const mouthPaths = {
        neutral: "M20 28 Q24 30 28 28",
        thinking: "M20 29 Q24 27 28 29",
        happy: "M18 27 Q24 32 30 27",
        excited: "M19 26 Q24 31 29 26"
    };

    return (
        <div className="relative">
            <motion.div
                animate={isThinking ? {
                    scale: [1, 1.08, 0.95, 1.05, 1],
                    rotate: [0, -3, 3, -2, 0],
                    y: [0, -8, 4, -4, 0]
                } : {}}
                transition={isThinking ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                } : {}}
                className={`${sizeClasses[size]} rounded-full bg-white flex items-center justify-center shadow-lg shadow-purple-500/30 ring-2 ring-purple-500/20`}
            >
                <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-1/2 h-1/2"
                >
                    {/* Eyes */}
                    <motion.circle
                        cx="16"
                        cy="18"
                        r="2.5"
                        fill="#0A0A0B"
                        animate={isThinking ? { cy: [18, 14, 20, 16, 18], r: [2.5, 3, 2, 2.5, 2.5] } : {}}
                        transition={isThinking ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
                    />
                    <motion.circle
                        cx="32"
                        cy="18"
                        r="2.5"
                        fill="#0A0A0B"
                        animate={isThinking ? { cy: [18, 14, 20, 16, 18], r: [2.5, 3, 2, 2.5, 2.5] } : {}}
                        transition={isThinking ? { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 } : {}}
                    />
                    {/* Nose */}
                    <path
                        d="M24 22 Q22 24 20 24"
                        stroke="#0A0A0B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                    {/* Mouth */}
                    <motion.path
                        d={mouthPaths[mood]}
                        stroke="#0A0A0B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                        animate={isThinking ? {
                            d: [mouthPaths.thinking, mouthPaths.neutral, mouthPaths.thinking]
                        } : {}}
                        transition={isThinking ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
                    />
                </svg>
            </motion.div>
            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 rounded-full bg-purple-500/30 blur-3xl -z-10"
                animate={isThinking ? {
                    scale: [1, 1.5, 0.9, 1.3, 1],
                    opacity: [0.3, 0.7, 0.4, 0.6, 0.3]
                } : {}}
                transition={isThinking ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                } : {}}
            />
            <div className="absolute inset-0 rounded-full bg-purple-400/10 blur-xl -z-10" />
        </div>
    );
};

// ===============================
// Option Card Component - Premium Framer-style animations
// ===============================
const OptionCard = ({ option, onSelect, index, isCompact = false }) => {
    const Icon = option.icon;

    return (
        <motion.button
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.4,
                delay: 0.15 + index * 0.08,
                ease: [0.23, 1, 0.32, 1] // Framer's custom easing
            }}
            whileHover={{
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option)}
            className={`group relative w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/30 transition-colors duration-200 text-left ${isCompact ? 'p-3' : 'p-4'}`}
        >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />

            <div className="relative flex items-center gap-3">
                <motion.div
                    className={`rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-white/10 group-hover:border-purple-500/30 transition-colors ${isCompact ? 'w-9 h-9' : 'w-11 h-11'}`}
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.2 + index * 0.08,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                    }}
                >
                    <Icon size={isCompact ? 18 : 22} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
                </motion.div>
                <div className="flex-1 min-w-0">
                    <p className={`text-white font-medium ${isCompact ? 'text-base' : 'text-xl'}`} style={{ fontFamily: "'Nunito', sans-serif" }}>
                        {option.label}
                    </p>
                    <p className="text-white/50 text-sm truncate" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        {option.description}
                    </p>
                </div>
                <motion.div
                    className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"
                    initial={{ opacity: 0, x: -5 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <ArrowUpRight size={14} className="text-purple-400" />
                </motion.div>
            </div>
        </motion.button>
    );
};

// ===============================
// Progress Indicator
// ===============================
const ProgressIndicator = ({ current, total }) => (
    <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
            <motion.div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${i < current
                    ? 'bg-purple-500 w-6'
                    : i === current
                        ? 'bg-purple-400/60 w-4'
                        : 'bg-white/10 w-2'
                    }`}
                initial={false}
                animate={{
                    width: i < current ? 24 : i === current ? 16 : 8,
                    opacity: i <= current ? 1 : 0.5
                }}
            />
        ))}
    </div>
);

// Mini Loader - Between Questions
// ===============================
const MiniLoader = () => (
    <motion.div
        key="mini-loader"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col items-center justify-center py-20"
    >
        {/* Modern spinner container */}
        <div className="relative w-16 h-16">
            {/* Background glow */}
            <motion.div
                className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Outer static ring */}
            <div className="absolute inset-0 rounded-full border border-white/10" />

            {/* Rotating arc */}
            <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <svg className="w-full h-full" viewBox="0 0 64 64">
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="80 100"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
                            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>

            {/* Inner pulsing dot */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="w-2 h-2 rounded-full bg-purple-400" />
            </motion.div>
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5 mt-8">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-purple-400/60 rounded-full"
                    animate={{
                        y: [0, -4, 0],
                        opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.12
                    }}
                />
            ))}
        </div>
    </motion.div>
);

// ===============================
// Analysis Loading Screen
// ===============================
const AnalysisScreen = ({ onComplete }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + 0.8, 100));
        }, 40);

        const textInterval = setInterval(() => {
            setCurrentTextIndex(prev => (prev + 1) % ANALYSIS_TEXTS.length);
        }, 900);

        const completeTimeout = setTimeout(() => {
            onComplete();
        }, 5000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(textInterval);
            clearTimeout(completeTimeout);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
        >
            <LandiAvatar isThinking={true} size="large" mood="thinking" />

            <div className="mt-8 h-6 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentTextIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="text-white/80 text-xl font-medium text-center"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                        {ANALYSIS_TEXTS[currentTextIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>

            <div className="mt-6 w-56 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex gap-1.5 mt-6">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-purple-400/60 rounded-full"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

// ===============================
// Proposal Screen with Insights
// ===============================
const ProposalScreen = ({ recommendation, userInput }) => {
    const isAuthority = recommendation.plan === 'authority';

    const plans = {
        essential: {
            name: "Essencial",
            price: "997",
            description: "Infraestrutura profissional para começar a escalar",
            features: [
                "Site profissional completo em 72h",
                "Dashboard de controle intuitivo",
                "Hospedagem premium inclusa",
                "Atualizações de segurança",
                "Suporte por email"
            ],
            cta: "Começar com Essencial",
            tag: null
        },
        authority: {
            name: "Autoridade Digital",
            price: "1.497",
            description: "Posicionamento premium para dominar seu mercado",
            features: [
                "Tudo do Essencial, mais:",
                "Manutenção contínua sob demanda",
                "Suporte prioritário em 4h úteis",
                "Otimizações mensais de conversão",
                "Relatórios de performance"
            ],
            cta: "Ativar Autoridade Total",
            tag: "Recomendado para você"
        }
    };

    const selectedPlan = plans[recommendation.plan];
    const alternativePlan = isAuthority ? plans.essential : plans.authority;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
        >
            {/* Success Header */}
            <div className="relative mb-4">
                <LandiAvatar size="medium" mood="happy" />
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#0f0f15]"
                >
                    <Check size={14} className="text-white" />
                </motion.div>
            </div>

            <h2 className="text-xl md:text-2xl font-normal text-white text-center mb-1 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Encontrei a estratégia perfeita!
            </h2>
            <p className="text-white/50 text-sm text-center mb-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
                Baseado nas suas respostas, veja o que faz mais sentido para você:
            </p>

            {/* Insights Section */}
            {recommendation.insights.length > 0 && (
                <div className="w-full mb-6 space-y-2">
                    {recommendation.insights.map((insight, index) => {
                        const InsightIcon = insight.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                            >
                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <InsightIcon size={16} className="text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium" style={{ fontFamily: "'Nunito', sans-serif" }}>
                                        {insight.title}
                                    </p>
                                    <p className="text-white/50 text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
                                        {insight.text}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Recommended Plan */}
            <div className="w-full relative bg-gradient-to-b from-[#1a1028] to-[#0d0815] rounded-2xl border border-purple-500/20 p-5 overflow-hidden mb-3">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-purple-500/20 blur-[60px] pointer-events-none" />

                {selectedPlan.tag && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-0.5 rounded-b-lg flex items-center gap-1">
                            <Star size={10} className="text-white fill-white" />
                            <span className="text-white text-[10px] font-semibold tracking-wide">{selectedPlan.tag.toUpperCase()}</span>
                        </div>
                    </div>
                )}

                <div className="relative z-10 pt-2">
                    <div className="flex items-baseline justify-between mb-3">
                        <div>
                            <h3 className="text-lg font-normal text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                {selectedPlan.name}
                            </h3>
                            <p className="text-white/40 text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
                                {selectedPlan.description}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-white/50 text-sm">R$</span>
                                <span className="text-2xl font-bold text-white">{selectedPlan.price}</span>
                            </div>
                            <span className="text-white/40 text-xs">/mês</span>
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        {selectedPlan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <Check size={10} className="text-purple-400" />
                                </div>
                                <span className="text-white/70 text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1e0a3c] via-[#2d1b4e] to-[#1e0a3c] hover:from-[#2a1050] hover:via-[#3d2560] hover:to-[#2a1050] text-white font-semibold text-sm shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transition-all duration-200 border border-purple-500/20 active:scale-95"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                        {selectedPlan.cta}
                    </motion.button>
                </div>
            </div>

            {/* Alternative Option */}
            <button className="text-white/40 text-xs hover:text-white/60 transition-colors active:scale-95" style={{ fontFamily: "'Nunito', sans-serif" }}>
                Ou veja o plano {alternativePlan.name} (R$ {alternativePlan.price}/mês) →
            </button>

            <p className="text-white/20 text-[10px] text-center mt-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
                🔒 Pagamento seguro • Satisfação garantida • Cancele quando quiser
            </p>
        </motion.div>
    );
};

// ===============================
// Main Chat Page Component
// ===============================
const ChatPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userInput = location.state?.userInput || '';
    const [editedInput, setEditedInput] = useState(userInput || '');

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [recommendation, setRecommendation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setEditedInput(userInput || '');
    }, [userInput]);

    const handleStartQuiz = () => {
        if (editedInput.trim()) {
            setAnswers(prev => ({ ...prev, userInput: editedInput.trim() }));
        }
        setIsLoading(true);
        setTimeout(() => {
            setCurrentStep(1);
            setIsLoading(false);
        }, 600);
    };

    const handleOptionSelect = (option) => {
        const step = QUIZ_STEPS[currentStep];
        setAnswers(prev => ({ ...prev, [step.id]: option }));

        // Show loading between questions
        setIsLoading(true);
        setTimeout(() => {
            setCurrentStep(prev => prev + 1);
            setIsLoading(false);
        }, 800);
    };

    const handleAnalysisComplete = () => {
        const result = calculateRecommendation(answers);
        setRecommendation(result);
        setCurrentStep(prev => prev + 1);
    };

    const handleClose = () => {
        navigate('/');
    };

    useEffect(() => {
        document.body.style.background = '#0a0a0f';
        document.documentElement.style.background = '#0a0a0f';
        return () => {
            document.body.style.background = '';
            document.documentElement.style.background = '';
        };
    }, []);

    const currentStepData = QUIZ_STEPS[currentStep];
    const questionSteps = QUIZ_STEPS.filter(s => s.question);
    const currentQuestionIndex = questionSteps.findIndex(s => s.id === currentStepData?.id);
    const totalQuestions = questionSteps.length;
    const hasMoreThan4Options = currentStepData?.options?.length > 4;

    return (
        <StarsBackground
            className="min-h-screen fixed inset-0"
            starColor="#a855f7"
            speed={60}
            factor={0.03}
        >
            <div className="min-h-screen relative overflow-hidden flex flex-col">
                <FloatingNavbar isMinimal={true} />

                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="flex-1 flex items-center justify-center p-4 pt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-xl md:max-w-3xl"
                    >
                        <div className="relative bg-[#0f0f15]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden min-h-[600px] flex flex-col justify-center" style={{ isolation: 'isolate' }}>

                            <button
                                onClick={handleClose}
                                className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all"
                            >
                                <X size={16} />
                            </button>

                            {/* Progress indicator for question steps */}
                            {currentStepData?.question && (
                                <div className="absolute top-3 left-4 z-10">
                                    <ProgressIndicator current={currentQuestionIndex} total={totalQuestions} />
                                </div>
                            )}

                            {/* GPU-accelerated content layer to prevent backdrop-blur repaint */}
                            <div
                                className="p-6 md:p-8 pt-10"
                                style={{
                                    transform: 'translateZ(0)',
                                    willChange: 'contents',
                                    backfaceVisibility: 'hidden'
                                }}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {/* MINI LOADER - Between transitions */}
                                    {isLoading && (
                                        <MiniLoader />
                                    )}

                                    {/* INTRO */}
                                    {!isLoading && currentStepData?.type === 'intro' && (
                                        <motion.div
                                            key="intro"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="flex flex-col items-center"
                                            style={{ willChange: 'opacity' }}
                                        >
                                            <LandiAvatar size="medium" mood="neutral" />

                                            <h2 className="text-3xl md:text-5xl font-normal text-white text-center mt-5 mb-4 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                                Olá, eu sou o Landi
                                            </h2>

                                            <p className="text-white/60 text-lg text-center leading-relaxed mb-8 max-w-md" style={{ fontFamily: "'Nunito', sans-serif" }}>
                                                Em menos de 2 minutos, vou descobrir exatamente o que você precisa para posicionar sua marca no topo.
                                            </p>

                                            <div className="w-full space-y-4">
                                                <textarea
                                                    value={editedInput}
                                                    onChange={(e) => setEditedInput(e.target.value)}
                                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/90 text-sm focus:outline-none focus:border-purple-500/30 resize-none min-h-[80px] leading-relaxed transition-colors"
                                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                                    placeholder="Descreva brevemente seu negócio..."
                                                />

                                                {/* Centered Premium Button */}
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={handleStartQuiz}
                                                        className="group relative inline-flex items-center justify-center h-12 w-[260px] rounded-xl font-semibold text-white text-base leading-none -tracking-[0.02em] transition-all duration-500 hover:-translate-y-0.5"
                                                    >
                                                        {/* Dark gradient background with purple undertone */}
                                                        <span className="absolute -inset-px h-full w-full overflow-hidden rounded-xl" aria-hidden="true">
                                                            {/* Core dark gradient with subtle purple */}
                                                            <span className="absolute inset-0 transition-opacity duration-500" style={{ background: 'linear-gradient(140deg, rgba(15,10,25,1) 0%, rgba(25,20,40,1) 35%, rgba(35,28,55,1) 70%, rgba(18,12,28,1) 100%)' }}></span>

                                                            {/* Subtle ambient glow - always visible */}
                                                            <span className="absolute -top-10 right-0 w-24 h-24 rounded-full bg-purple-500/10 blur-[40px] transition-opacity duration-700"></span>
                                                            <span className="absolute -bottom-10 left-0 w-24 h-24 rounded-full bg-indigo-500/10 blur-[40px] transition-opacity duration-700"></span>

                                                            {/* Soft indirect light on hover - subtle glow that fades in */}
                                                            <span className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-purple-400/0 to-purple-400/0 group-hover:via-purple-400/5 group-hover:to-purple-400/10 transition-all duration-700 ease-out"></span>

                                                            {/* Border */}
                                                            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-purple-400/20 transition-all duration-500"></span>
                                                        </span>

                                                        {/* Content */}
                                                        <span className="relative z-10 flex items-center gap-2 text-base leading-none font-medium -tracking-[0.02em] text-white/90 group-hover:text-white transition-colors duration-300" style={{ fontFamily: "'Nunito', sans-serif" }}>
                                                            Iniciar Diagnóstico
                                                            <motion.span
                                                                animate={{ x: [0, 3, 0] }}
                                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                                className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                                            >
                                                                <ArrowUpRight size={16} />
                                                            </motion.span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-white/30 text-sm mt-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
                                                ⏱️ Apenas 7 perguntas rápidas
                                            </p>
                                        </motion.div>
                                    )}


                                    {/* QUESTIONS - Premium entrance animation */}
                                    {!isLoading && currentStepData?.question && (
                                        <motion.div
                                            key={currentStepData.id}
                                            initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                                            transition={{
                                                duration: 0.4,
                                                ease: [0.23, 1, 0.32, 1] // Framer's premium easing
                                            }}
                                            className="flex flex-col items-center"
                                        >
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.1,
                                                    type: "spring",
                                                    stiffness: 200,
                                                    damping: 20
                                                }}
                                            >
                                                <LandiAvatar size="medium" mood="neutral" />
                                            </motion.div>

                                            <motion.h2
                                                className="text-2xl md:text-4xl font-normal text-white text-center mt-4 mb-2 tracking-tight"
                                                style={{ fontFamily: "'Outfit', sans-serif" }}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
                                            >
                                                {currentStepData.question}
                                            </motion.h2>

                                            <motion.p
                                                className="text-white/40 text-base md:text-lg text-center mb-8"
                                                style={{ fontFamily: "'Nunito', sans-serif" }}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                                            >
                                                {currentStepData.subtitle}
                                            </motion.p>

                                            <div className={`w-full ${hasMoreThan4Options ? 'max-h-[400px] overflow-y-auto pr-1' : ''} grid grid-cols-1 md:grid-cols-2 gap-3`}>
                                                {currentStepData.options.map((option, index) => (
                                                    <OptionCard
                                                        key={option.id}
                                                        option={option}
                                                        onSelect={handleOptionSelect}
                                                        index={index}
                                                        isCompact={hasMoreThan4Options}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ANALYSIS */}
                                    {currentStepData?.type === 'analysis' && (
                                        <AnalysisScreen onComplete={handleAnalysisComplete} />
                                    )}

                                    {/* PROPOSAL */}
                                    {currentStepData?.type === 'proposal' && recommendation && (
                                        <ProposalScreen recommendation={recommendation} userInput={editedInput} />
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </StarsBackground>
    );
};

export default ChatPage;
