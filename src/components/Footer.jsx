import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SparklesCore } from './SparklesCore';

const Footer = () => {
    return (
        <footer className="z-10 mt-24 relative pb-20">
            <style>
                {`
                /* From Uiverse.io by Spacious74 - Adapted for Deep Purple & Animation */
                .button {
                  cursor: pointer;
                  font-size: 1.125rem;
                  border-radius: 16px;
                  border: none;
                  padding: 1.5px; /* Thinner border */
                  background: transparent; /* Transparent to show page background */
                  position: relative;
                  overflow: hidden;
                  transition: transform 0.2s;
                }
                
                .button:hover {
                    transform: scale(1.05);
                    outline: none;
                }
                
                .button:hover .blob1 {
                    animation-duration: 2s;
                    opacity: 1;
                }

                /* Removed static ::after highlight */

                .blob1 {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  width: 300%;
                  height: 300%;
                  transform: translate(-50%, -50%);
                  border-radius: 50%;
                  /* Clean, continuous White Gradient */
                  background: conic-gradient(from 0deg, transparent 0%, transparent 10%, #ffffff 50%, transparent 90%);
                  animation: rotateBorder 4s linear infinite;
                  filter: blur(8px); /* Reduced blur for thinner look */
                }

                @keyframes rotateBorder {
                    0% {
                        transform: translate(-50%, -50%) rotate(0deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(360deg);
                    }
                }

                .inner {
                  padding: 14px 25px;
                  border-radius: 14px;
                  color: #fff;
                  z-index: 3;
                  position: relative;
                  background: linear-gradient(90deg, rgba(14, 165, 233, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%); /* Soft Blue Gradient */
                  backdrop-filter: blur(10px); /* Glass effect */
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                }
                
                /* Removed static .inner::before highlight */
                `}
            </style>

            {/* Sparkles Background - Extended upwards with fade mask */}
            <div className="absolute left-0 bottom-0 w-full h-[150%] pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_40%,black_100%)] opacity-50">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>

            {/* Deep Purple Bottom Light */}
            <div className="absolute bottom-0 left-0 w-full h-[80%] bg-gradient-to-t from-[#2e1065] to-transparent opacity-30 pointer-events-none z-0"></div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
                {/* CTA Content */}
                <div className="flex flex-col items-center text-center space-y-8">
                    {/* Headline */}
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-light text-white tracking-tighter leading-tight max-w-4xl" style={{ fontFamily: "'Barlow', sans-serif" }}>
                        Pare de Perder Contratos Por Causa do Seu Site
                    </h2>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl">
                        Sua marca merece uma presença digital que não limite seu faturamento.
                    </p>

                    {/* New Uiverse Button */}
                    <div className="mt-4">
                        <button className="button group">
                            <div className="blob1"></div>
                            <div className="inner">
                                Ativar Autoridade Digital
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} LandingOS. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                        <a href="#" className="hover:text-purple-400 transition-colors">Termos</a>
                        <a href="#" className="hover:text-purple-400 transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-purple-400 transition-colors">Contato</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
