import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles } from 'lucide-react';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F]">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Show friendly "not logged in" page
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F] text-white relative overflow-hidden">
                {/* Animated Background Lights */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] animate-pulse"></div>

                    {/* Floating Light Orbs */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                    <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '0.5s', animationDuration: '4s' }}></div>
                    <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '1s', animationDuration: '3.5s' }}></div>
                    <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}></div>
                    <div className="absolute bottom-1/3 right-1/2 w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '2s', animationDuration: '4.5s' }}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center max-w-md px-6">
                    {/* Landi Mascot - Ghost/Face Icon */}
                    <div className="mb-8 relative inline-block">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-2xl">
                            {/* Simple Ghost Face */}
                            <div className="relative">
                                <div className="text-6xl">👻</div>
                                {/* Sparkle Effect */}
                                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-400 animate-pulse" />
                            </div>
                        </div>
                        {/* Glow Ring */}
                        <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-purple-500/20 blur-xl animate-pulse"></div>
                    </div>

                    {/* Funny Text */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                        Eita! Cadê você?
                    </h1>
                    <p className="text-slate-400 mb-2 text-lg">
                        Parece que você tentou entrar na festa VIP sem convite... 🎫
                    </p>
                    <p className="text-slate-500 mb-8 text-sm">
                        Faça login para acessar seu dashboard e continuar criando coisas incríveis!
                    </p>

                    {/* Login Button */}
                    <Link
                        to="/login"
                        state={{ from: location }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105"
                    >
                        <LogIn className="w-5 h-5" />
                        Fazer Login
                    </Link>

                    {/* Secondary Link */}
                    <p className="mt-6 text-sm text-slate-500">
                        Não tem conta?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 underline transition-colors">
                            Criar uma agora
                        </Link>
                    </p>
                </div>

                {/* Bottom Decoration */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-600 text-xs">
                    <div className="w-1 h-1 bg-slate-600 rounded-full animate-pulse"></div>
                    <span>LandingOS</span>
                    <div className="w-1 h-1 bg-slate-600 rounded-full animate-pulse"></div>
                </div>
            </div>
        );
    }

    return children;
}
