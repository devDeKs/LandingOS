import React, { useState } from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ name, role, text, avatar, location, rating, tag, expandDirection = 'down' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // Calculate full and half stars
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 150);
        setIsExpanded(!isExpanded);
    };

    return (
        <div
            className={`flex-shrink-0 w-[320px] sm:w-[360px] flex flex-col rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-xl cursor-pointer select-none
                transition-all duration-300 ease-out
                ${isExpanded ? 'h-auto min-h-[220px] bg-white/[0.08] border-purple-500/30 shadow-lg shadow-purple-500/10 z-30' : 'h-[220px]'}
                ${isClicked ? 'scale-[0.97]' : ''}
                hover:bg-white/[0.07] hover:border-purple-500/20
                ${expandDirection === 'up' ? 'origin-bottom' : 'origin-top'}
            `}
            style={{
                marginTop: isExpanded && expandDirection === 'up' ? 'auto' : undefined,
                marginBottom: isExpanded && expandDirection === 'down' ? 'auto' : undefined,
            }}
            onClick={handleClick}
            onMouseEnter={() => {
                if (window.innerWidth >= 768) setIsExpanded(true);
            }}
            onMouseLeave={() => {
                if (window.innerWidth >= 768) setIsExpanded(false);
            }}
        >
            {/* Result Tag */}
            {tag && (
                <div className="mb-3">
                    <span className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
                        {tag}
                    </span>
                </div>
            )}
            {/* Header with avatar */}
            <div className="flex items-start gap-3 mb-4">
                <img
                    src={avatar}
                    alt={name}
                    className="h-11 w-11 rounded-full bg-white/10 object-cover ring-2 ring-purple-500/20 flex-shrink-0"
                />
                <div className="flex flex-col items-start gap-0.5">
                    <h3 className="text-sm font-semibold text-white leading-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>{name}</h3>
                    <p className="text-xs text-white/50 leading-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>{role}</p>
                    <p className="text-[10px] text-purple-300/70 leading-tight mt-0.5" style={{ fontFamily: "'Nunito', sans-serif" }}>{location}</p>
                </div>
            </div>

            {/* Testimonial text - expands on hover/click */}
            <p
                className={`flex-1 text-sm leading-relaxed text-white/70 mb-3 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}
                style={{ fontFamily: "'Nunito', sans-serif" }}
            >
                {text}
            </p>

            {/* Stars - rating based fill */}
            <div className="flex items-center gap-1.5 mt-auto">
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => {
                        const isFilled = i < fullStars;
                        const isHalf = i === fullStars && hasHalfStar;

                        if (isHalf) {
                            return (
                                <div key={i} className="relative" style={{ width: 14, height: 14 }}>
                                    {/* Empty star background */}
                                    <Star size={14} fill="transparent" stroke="#a855f7" strokeOpacity={0.3} className="absolute inset-0" />
                                    {/* Half filled star */}
                                    <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                                        <Star size={14} fill="#a855f7" stroke="#a855f7" />
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Star
                                key={i}
                                size={14}
                                fill={isFilled ? "#a855f7" : "transparent"}
                                stroke="#a855f7"
                                strokeOpacity={isFilled ? 1 : 0.3}
                            />
                        );
                    })}
                </div>
                <span className="text-xs text-white/40">{rating.toFixed(1)}</span>
            </div>
        </div>
    );
};

const TestimonialsSection = () => {
    const testimonialsRow1 = [
        {
            name: "Ricardo Mendes",
            role: "Advogado Empresarial",
            location: "São Paulo, SP",
            text: "Perdi R$ 45k em propostas por vergonha do meu site. 72 horas depois, fechei o maior contrato da carreira.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            rating: 5.0,
            tag: "ROI de 10x"
        },
        {
            name: "Mariana Costa",
            role: "Consultora de TI",
            location: "Rio de Janeiro, RJ",
            text: "Cliente me achou no Google e foi embora em 5 segundos. Agora o site fecha reunião antes mesmo de eu falar.",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
            rating: 4.5,
            tag: "Conversão Imediata"
        },
        {
            name: "Fernando Alves",
            role: "Arquiteto Comercial",
            location: "Curitiba, PR",
            text: "Projetos de R$ 150k, site de R$ 500. A matemática não fechava. Agora mando o link sem aquele aperto no peito.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            rating: 5.0,
            tag: "Posicionamento Premium"
        },
    ];

    const testimonialsRow2 = [
        {
            name: "Paula Ribeiro",
            role: "Coach Executiva",
            location: "Belo Horizonte, MG",
            text: "Cobro R$ 12k/mês, mas meu site parecia blog de 2010. Dashboard em 72h. Três leads qualificados na primeira semana.",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
            rating: 4.5,
            tag: "Lançamento de 6 Dígitos"
        },
        {
            name: "Thiago Campos",
            role: "Contador Consultivo",
            location: "Porto Alegre, RS",
            text: "Empresas grandes me ignoravam por parecer freelancer. Agora atendo só quem fecha acima de R$ 20k. Filtro mudou.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            rating: 5.0,
            tag: "Ticket Médio +300%"
        },
        {
            name: "Camila Duarte",
            role: "Estrategista Digital",
            location: "Florianópolis, SC",
            text: "Vendo performance, mas meu site não convertia nem 1%. A ironia custava R$ 30k/mês. Resolvido em 72 horas.",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
            rating: 4.5,
            tag: "Conversão 5x Maior"
        },
    ];

    return (
        <section className="py-16 sm:py-20 md:py-24 px-0 relative overflow-hidden w-full">
            <div className="mx-auto flex w-full flex-col items-center gap-12 sm:gap-16 md:gap-20 text-center">
                {/* Header */}
                <div className="flex flex-col items-center gap-4 px-4 max-w-4xl">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight tracking-tight bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent pb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Onde os <span className="text-purple-glow">líderes de mercado</span> se posicionam.
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl max-w-[700px] font-medium text-white/50" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        Resultados reais de quem transformou presença digital em vantagem competitiva.
                    </p>
                </div>

                {/* Testimonials Rows */}
                <div className="w-full space-y-5 relative">
                    {/* Row 1 - Moving Left (expands UP) */}
                    <div className="marquee-container" style={{ alignItems: 'flex-end' }}>
                        <div className="marquee-track marquee-left" style={{ alignItems: 'flex-end' }}>
                            {[...testimonialsRow1, ...testimonialsRow1, ...testimonialsRow1, ...testimonialsRow1].map((testimonial, i) => (
                                <TestimonialCard key={`row1-${i}`} {...testimonial} expandDirection="up" />
                            ))}
                        </div>
                    </div>

                    {/* Row 2 - Moving Right (expands DOWN) */}
                    <div className="marquee-container" style={{ alignItems: 'flex-start' }}>
                        <div className="marquee-track marquee-right" style={{ alignItems: 'flex-start' }}>
                            {[...testimonialsRow2, ...testimonialsRow2, ...testimonialsRow2, ...testimonialsRow2].map((testimonial, i) => (
                                <TestimonialCard key={`row2-${i}`} {...testimonial} expandDirection="down" />
                            ))}
                        </div>
                    </div>

                    {/* Gradient overlays */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-[#030014] to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-[#030014] to-transparent z-10" />
                </div>
            </div>

            {/* CSS for animations */}
            <style>{`
                .marquee-container {
                    width: 100%;
                    overflow: hidden;
                }
                .marquee-track {
                    display: flex;
                    gap: 1.25rem;
                    width: max-content;
                }
                .marquee-track:hover {
                    animation-play-state: paused !important;
                }
                .marquee-left {
                    animation: scroll-left 80s linear infinite;
                }
                .marquee-right {
                    animation: scroll-right 80s linear infinite;
                }
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scroll-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
            `}</style>
        </section>
    );
};

export default TestimonialsSection;