import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

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
        }
    ];

    return (
        <section className="py-24 px-4 relative">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Veja o que quem já experimentou tem a dizer
                    </h2>
                    <p className="text-lg text-white/60 max-w-3xl mx-auto">
                        Os resultados podem variar de pessoa para pessoa, por isso deixamos aqui o depoimento de alguns de nossos melhores clientes.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:bg-white/10 transition-all duration-300 flex flex-col backdrop-blur-md"
                        >
                            {/* Quote Icon */}
                            <div className="mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Quote className="w-5 h-5 text-blue-400" />
                                </div>
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-white/70 italic text-base leading-relaxed mb-8 flex-grow">
                                "{testimonial.text}"
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full bg-white/10"
                                />
                                <div>
                                    <p className="font-bold text-white text-sm">{testimonial.name}</p>
                                    <p className="text-white/50 text-xs">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
