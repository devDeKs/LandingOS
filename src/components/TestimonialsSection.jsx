import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ name, role, text, avatar, location, rating }) => {
    // Calculate full and half stars
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
        <div className="flex-shrink-0 w-[320px] sm:w-[360px] h-[200px] flex flex-col rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.07] hover:border-purple-500/20 hover:-translate-y-1">
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

            {/* Testimonial text - limited to 2 lines */}
            <p className="flex-1 text-sm leading-relaxed text-white/70 line-clamp-2 mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {text}
            </p>

            {/* Stars - rating based fill */}
            <div className="flex items-center gap-1.5">
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
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo&backgroundColor=b6e3f4",
            rating: 5.0
        },
        {
            name: "Mariana Costa",
            role: "Consultora de TI",
            location: "Rio de Janeiro, RJ",
            text: "Cliente me achou no Google e foi embora em 5 segundos. Agora o site fecha reunião antes mesmo de eu falar.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana&backgroundColor=c0aede",
            rating: 4.5
        },
        {
            name: "Fernando Alves",
            role: "Arquiteto Comercial",
            location: "Curitiba, PR",
            text: "Projetos de R$ 150k, site de R$ 500. A matemática não fechava. Agora mando o link sem aquele aperto no peito.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fernando&backgroundColor=ffdfbf",
            rating: 5.0
        },
    ];

    const testimonialsRow2 = [
        {
            name: "Paula Ribeiro",
            role: "Coach Executiva",
            location: "Belo Horizonte, MG",
            text: "Cobro R$ 12k/mês, mas meu site parecia blog de 2010. Dashboard em 72h. Três leads qualificados na primeira semana.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paula&backgroundColor=ffd5dc",
            rating: 4.5
        },
        {
            name: "Thiago Campos",
            role: "Contador Consultivo",
            location: "Porto Alegre, RS",
            text: "Empresas grandes me ignoravam por parecer freelancer. Agora atendo só quem fecha acima de R$ 20k. Filtro mudou.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thiago&backgroundColor=b6e3f4",
            rating: 5.0
        },
        {
            name: "Camila Duarte",
            role: "Estrategista Digital",
            location: "Florianópolis, SC",
            text: "Vendo performance, mas meu site não convertia nem 1%. A ironia custava R$ 30k/mês. Resolvido em 72 horas.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camila&backgroundColor=c0aede",
            rating: 4.5
        },
    ];

    return (
        <section className="py-16 sm:py-20 md:py-24 px-0 relative overflow-hidden w-full">
            <div className="mx-auto flex w-full flex-col items-center gap-12 sm:gap-16 md:gap-20 text-center">
                {/* Header */}
                <div className="flex flex-col items-center gap-4 px-4 max-w-4xl">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight tracking-tight bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Quem já domina o mercado
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl max-w-[700px] font-medium text-white/50" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        Histórias reais de quem transformou presença digital em vantagem competitiva.
                    </p>
                </div>

                {/* Testimonials Rows */}
                <div className="w-full space-y-5 relative">
                    {/* Row 1 - Moving Left */}
                    <div className="marquee-container">
                        <div className="marquee-track marquee-left">
                            {[...testimonialsRow1, ...testimonialsRow1, ...testimonialsRow1, ...testimonialsRow1].map((testimonial, i) => (
                                <TestimonialCard key={`row1-${i}`} {...testimonial} />
                            ))}
                        </div>
                    </div>

                    {/* Row 2 - Moving Right (Reverse) */}
                    <div className="marquee-container">
                        <div className="marquee-track marquee-right">
                            {[...testimonialsRow2, ...testimonialsRow2, ...testimonialsRow2, ...testimonialsRow2].map((testimonial, i) => (
                                <TestimonialCard key={`row2-${i}`} {...testimonial} />
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