import React from 'react';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

const TestimonialCard = ({ name, role, text, avatar }) => {
    return (
        <div className="relative flex h-full w-[280px] sm:w-[350px] shrink-0 flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-md transition-all hover:bg-white/10">
            <div className="mb-4 flex items-center gap-3 sm:gap-4">
                <img
                    src={avatar}
                    alt={name}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 object-cover"
                />
                <div>
                    <h3 className="text-sm font-semibold text-white">{name}</h3>
                    <p className="text-xs text-white/50">{role}</p>
                </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70">"{text}"</p>
        </div>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Dr. Roberto Mendes",
            role: "Cirurgião Plástico",
            text: "O LandingOS não só mudou meu site, mudou minha clínica. A qualidade dos leads que chegam hoje é incomparável.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto&backgroundColor=b6e3f4"
        },
        {
            name: "Mariana Costa",
            role: "CEO, FinGroup",
            text: "Profissionalismo extremo. A sensação de 'sistema operacional' passa uma autoridade que nenhum outro site nos deu.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana&backgroundColor=c0aede"
        },
        {
            name: "Clínica Bem Estar",
            role: "Dermatologia",
            text: "O design clean e a inteligência por trás da página nos colocaram em outro patamar na região.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Clinica&backgroundColor=ffd5dc"
        },
        {
            name: "Pedro Alves",
            role: "Fundador, TechStart",
            text: "A velocidade de implementação e o resultado final superaram todas as expectativas. Recomendo fortemente.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro&backgroundColor=ffdfbf"
        },
        {
            name: "Ana Silva",
            role: "Marketing Digital",
            text: "Nunca vi uma taxa de conversão tão alta em um site institucional. O design realmente vende.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana&backgroundColor=c0aede"
        },
        {
            name: "Carlos Ferreira",
            role: "Diretor Comercial",
            text: "Investimento que se pagou em menos de 2 meses. A qualificação dos leads melhorou drasticamente.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos&backgroundColor=b6e3f4"
        }
    ];

    // Duplicate testimonials to create seamless infinite loop
    const duplicatedTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="py-8 sm:py-12 md:py-16 px-0 relative overflow-hidden w-full">
            <div className="mx-auto flex w-full flex-col items-center gap-6 sm:gap-8 md:gap-12 text-center">
                <div className="flex flex-col items-center gap-3 sm:gap-4 px-4 max-w-7xl">
                    <h2 className="max-w-[720px] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white tracking-tighter" style={{ fontFamily: "'Barlow', sans-serif" }}>
                        Quem já domina o mercado
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-[600px] font-medium text-white/60">
                        Histórias de quem parou de perder contratos por causa de um site ruim.
                    </p>
                </div>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <div className="group flex overflow-hidden p-2 [--gap:0.75rem] sm:[--gap:1rem] [gap:var(--gap)] flex-row [--duration:45s] w-full">
                        {/* First set - continuous animation */}
                        <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
                            {duplicatedTestimonials.map((testimonial, i) => (
                                <TestimonialCard
                                    key={`set1-${i}`}
                                    {...testimonial}
                                />
                            ))}
                        </div>
                        {/* Second set - for seamless loop */}
                        <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
                            {duplicatedTestimonials.map((testimonial, i) => (
                                <TestimonialCard
                                    key={`set2-${i}`}
                                    {...testimonial}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Gradient overlays - visible on all screen sizes */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 sm:w-1/3 bg-gradient-to-r from-[#030014] to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 sm:w-1/3 bg-gradient-to-l from-[#030014] to-transparent" />
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
