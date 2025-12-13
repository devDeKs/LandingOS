import React from 'react';
import { SparklesCore } from './SparklesCore';

const Footer = () => {
    return (
        <footer className="z-10 mt-24 relative pb-20">
            <style>
                {`
                .footer-button {
                  cursor: pointer;
                  position: relative;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                  transition: all 0.25s ease;
                  background: radial-gradient(65.28% 65.28% at 50% 100%,
                      rgba(34, 211, 238, 0.8) 0%,
                      rgba(34, 211, 238, 0) 100%),
                    linear-gradient(0deg, #2563eb, #2563eb);
                  border-radius: 0.75rem;
                  border: none;
                  outline: none;
                  padding: 12px 18px;
                  min-height: 48px;
                  min-width: 102px;
                }
              
                .footer-button::before,
                .footer-button::after {
                  content: "";
                  position: absolute;
                  transition: all 0.5s ease-in-out;
                  z-index: 0;
                }
              
                .footer-button::before {
                  inset: 1px;
                  background: linear-gradient(177.95deg,
                      rgba(255, 255, 255, 0.19) 0%,
                      rgba(255, 255, 255, 0) 100%);
                  border-radius: calc(0.75rem - 1px);
                }
              
                .footer-button::after {
                  inset: 2px;
                  background: radial-gradient(65.28% 65.28% at 50% 100%,
                      rgba(34, 211, 238, 0.8) 0%,
                      rgba(34, 211, 238, 0) 100%),
                    linear-gradient(0deg, #2563eb, #2563eb);
                  border-radius: calc(0.75rem - 2px);
                }
              
                .footer-button:active {
                  transform: scale(0.95);
                }
              
                .points_wrapper {
                  overflow: hidden;
                  width: 100%;
                  height: 100%;
                  pointer-events: none;
                  position: absolute;
                  z-index: 1;
                }
              
                .points_wrapper .point {
                  bottom: -10px;
                  position: absolute;
                  animation: floating-points infinite ease-in-out;
                  pointer-events: none;
                  width: 2px;
                  height: 2px;
                  background-color: #fff;
                  border-radius: 9999px;
                }
              
                @keyframes floating-points {
                  0% {
                    transform: translateY(0);
                  }
              
                  85% {
                    opacity: 0;
                  }
              
                  100% {
                    transform: translateY(-55px);
                    opacity: 0;
                  }
                }
              
                .points_wrapper .point:nth-child(1) {
                  left: 10%;
                  opacity: 1;
                  animation-duration: 2.35s;
                  animation-delay: 0.2s;
                }
              
                .points_wrapper .point:nth-child(2) {
                  left: 30%;
                  opacity: 0.7;
                  animation-duration: 2.5s;
                  animation-delay: 0.5s;
                }
              
                .points_wrapper .point:nth-child(3) {
                  left: 25%;
                  opacity: 0.8;
                  animation-duration: 2.2s;
                  animation-delay: 0.1s;
                }
              
                .points_wrapper .point:nth-child(4) {
                  left: 44%;
                  opacity: 0.6;
                  animation-duration: 2.05s;
                }
              
                .points_wrapper .point:nth-child(5) {
                  left: 50%;
                  opacity: 1;
                  animation-duration: 1.9s;
                }
              
                .points_wrapper .point:nth-child(6) {
                  left: 75%;
                  opacity: 0.5;
                  animation-duration: 1.5s;
                  animation-delay: 1.5s;
                }
              
                .points_wrapper .point:nth-child(7) {
                  left: 88%;
                  opacity: 0.9;
                  animation-duration: 2.2s;
                  animation-delay: 0.2s;
                }
              
                .points_wrapper .point:nth-child(8) {
                  left: 58%;
                  opacity: 0.8;
                  animation-duration: 2.25s;
                  animation-delay: 0.2s;
                }
              
                .points_wrapper .point:nth-child(9) {
                  left: 98%;
                  opacity: 0.6;
                  animation-duration: 2.6s;
                  animation-delay: 0.1s;
                }
              
                .points_wrapper .point:nth-child(10) {
                  left: 65%;
                  opacity: 1;
                  animation-duration: 2.5s;
                  animation-delay: 0.2s;
                }
              
                .footer-button-inner {
                  z-index: 2;
                  gap: 6px;
                  position: relative;
                  width: 100%;
                  color: white;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 16px;
                  font-weight: 500;
                  line-height: 1.5;
                  transition: color 0.2s ease-in-out;
                }
              
                .footer-button-inner svg.icon {
                  width: 18px;
                  height: 18px;
                  transition: transform 0.3s ease;
                  stroke: white;
                  fill: none;
                }
              
                .footer-button:hover svg.icon {
                  transform: translateX(2px);
                }
              
                .footer-button:hover svg.icon path {
                  animation: dash 0.8s linear forwards;
                }
              
                @keyframes dash {
                  0% {
                    stroke-dasharray: 0, 20;
                    stroke-dashoffset: 0;
                  }
              
                  50% {
                    stroke-dasharray: 10, 10;
                    stroke-dashoffset: -5;
                  }
              
                  100% {
                    stroke-dasharray: 20, 0;
                    stroke-dashoffset: -10;
                  }
                }
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
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-tight max-w-4xl bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Pare de Perder Contratos Por Causa do Seu Site
                    </h2>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl">
                        Sua marca merece uma presença digital que não limite seu faturamento.
                    </p>

                    {/* New Button with Floating Particles */}
                    <div className="mt-4">
                        <button type="button" className="footer-button">
                            <div className="points_wrapper">
                                <i className="point"></i>
                                <i className="point"></i>
                                <i className="point"></i>
                                <i className="point"></i>
                                <i className="point"></i>
                                <i className="point"></i>
                                <i className="point"></i>
                                <i className="point"></i>
                                <i className="point"></i>
                                <i className="point"></i>
                            </div>

                            <span className="footer-button-inner">
                                Ativar Autoridade Digital
                                <svg
                                    className="icon"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                >
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </span>
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
