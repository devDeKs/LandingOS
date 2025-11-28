import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const PhilosophySection = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    useGSAP(() => {
        if (textRef.current) {
            gsap.fromTo(textRef.current,
                {
                    autoAlpha: 0,
                    y: 20,
                    filter: 'blur(10px)'
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1,
                    ease: 'power3.out',
                    delay: 0.2
                }
            );
        }
    }, { scope: containerRef });

    // Transição menos sensível (usa mais espaço de scroll)
    const textProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

    // Blur mais suave e gradual
    const blur1 = useTransform(textProgress, [0, 0.4, 0.5], [0, 2, 10]);
    const blur2 = useTransform(textProgress, [0.5, 0.6, 1], [10, 2, 0]);

    // Opacidade com transição mais fluida
    const opacity1 = useTransform(textProgress, [0, 0.4, 0.5], [1, 0.5, 0]);
    const opacity2 = useTransform(textProgress, [0.5, 0.6, 1], [0, 0.5, 1]);

    return (
        <section ref={containerRef} className="relative h-[150vh] -mt-[100vh] pointer-events-none">
            <div className="sticky top-0 h-screen flex items-end justify-center px-4 pb-0">
                <div className="relative max-w-4xl w-full min-h-[100px] flex items-center justify-center pointer-events-auto">

                    {/* Primeira frase - morphing out */}
                    <motion.div
                        style={{
                            opacity: opacity1,
                            filter: useTransform(blur1, (v) => `blur(${v}px)`)
                        }}
                        className="text-center absolute inset-0 flex items-center justify-center"
                    >
                        <h2 ref={textRef} className="text-4xl md:text-6xl font-bold text-white/50 leading-tight opacity-0">
                            Websites tradicionais <br />
                            <span className="text-white/30">esperam por clientes.</span>
                        </h2>
                    </motion.div>

                    {/* Segunda frase - morphing in */}
                    <motion.div
                        style={{
                            opacity: opacity2,
                            filter: useTransform(blur2, (v) => `blur(${v}px)`)
                        }}
                        className="text-center absolute inset-0 flex items-center justify-center"
                    >
                        <div>
                            <motion.div
                                style={{ opacity: opacity2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6 backdrop-blur-sm"
                            >
                                <TrendingUp className="w-4 h-4 text-blue-300" />
                                <span className="text-sm font-semibold text-blue-200">Active Intelligence</span>
                            </motion.div>

                            <h2 className="text-5xl md:text-7xl font-bold text-blue-400 leading-tight">
                                O LandingOS <br />
                                <span className="text-white">caça eles para você.</span>
                            </h2>

                            <p className="text-xl text-white/70 mt-6 max-w-2xl mx-auto">
                                Inteligência de dados que transforma visitantes passivos em leads qualificados.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PhilosophySection;
