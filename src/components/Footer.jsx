import React from 'react';
import { Send, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="z-10 mt-20 relative pb-10" data-element-locator="html > body:nth-of-type(1) > footer:nth-of-type(1)">
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12">
                <div className="relative overflow-hidden ring-1 ring-white/5 bg-[#0A0A0B]/80 rounded-3xl backdrop-blur-xl shadow-2xl shadow-purple-900/10">
                    {/* Ambient Glows */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="relative px-8 py-10 sm:px-12 sm:py-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                            {/* Left Side: Brand & Description */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                                <a href="#" className="inline-flex items-center justify-center md:justify-start group">
                                    <span className="bg-center text-xl font-semibold tracking-tighter w-[140px] h-[35px] bg-[url(https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/8cc3fd60-0bf0-41ad-a08b-be684f266e22_1600w.png)] bg-cover opacity-90 grayscale group-hover:grayscale-0 transition-all duration-500"></span>
                                </a>
                                <p className="text-base text-slate-400 leading-relaxed max-w-sm">
                                    Sua marca merece estar no topo. Não deixe sua presença digital limitar seu faturamento.
                                </p>
                                <div className="flex items-center gap-4">
                                    <a href="#"
                                        className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-purple-500/10 hover:ring-purple-500/50 transition-all duration-300">
                                        <Instagram className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                    </a>
                                    <a href="#"
                                        className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-purple-500/10 hover:ring-purple-500/50 transition-all duration-300">
                                        <Twitter className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                    </a>
                                    <a href="#"
                                        className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-purple-500/10 hover:ring-purple-500/50 transition-all duration-300">
                                        <Linkedin className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                    </a>
                                </div>
                            </div>

                            {/* Right Side: Newsletter */}
                            <div className="flex flex-col items-center md:items-end space-y-6 w-full">
                                <div className="w-full max-w-sm bg-white/5 rounded-2xl p-6 ring-1 ring-white/10 backdrop-blur-sm">
                                    <h3 className="text-lg font-semibold text-white mb-2">Fique por dentro</h3>
                                    <p className="text-sm text-slate-400 mb-4">Receba insights de mercado.</p>

                                    <form className="flex flex-col gap-3">
                                        <div className="relative">
                                            <input
                                                id="footer-email"
                                                type="email"
                                                required
                                                placeholder="seu@email.com"
                                                className="w-full rounded-xl bg-[#030014]/50 text-white placeholder-slate-600 px-4 py-3 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            style={{
                                                background: "linear-gradient(to right, #ec4899, #8b5cf6, #4338ca)"
                                            }}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl text-white px-4 py-3 text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:-translate-y-0.5"
                                        >
                                            <span>Inscrever-se</span>
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>

                        </div>

                        {/* Bottom Bar */}
                        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                            <p className="text-sm text-slate-500">
                                © {new Date().getFullYear()} LandingOS. Todos os direitos reservados.
                            </p>
                            <div className="flex items-center gap-6 text-sm text-slate-500">
                                <a href="#" className="hover:text-purple-400 transition-colors">Termos</a>
                                <a href="#" className="hover:text-purple-400 transition-colors">Privacidade</a>
                                <a href="#" className="hover:text-purple-400 transition-colors">Contato</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
