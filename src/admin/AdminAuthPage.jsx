import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminAuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/admin';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (signInError) throw signInError;

            // Check if user has admin role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select(`
                    id,
                    role_id,
                    roles:role_id (name)
                `)
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                throw new Error('Erro ao verificar permissões.');
            }

            const roleName = profile?.roles?.name;
            if (roleName !== 'admin' && roleName !== 'super_admin') {
                // Sign out if not admin
                await supabase.auth.signOut();
                throw new Error('Esta conta não possui permissões de administrador.');
            }

            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message === 'Invalid login credentials'
                ? 'Credenciais inválidas.'
                : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F] text-white relative overflow-hidden p-4">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/15 rounded-full blur-[150px] animate-pulse"></div>
            </div>

            {/* Back to Home */}
            <a
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Voltar</span>
            </a>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                            {/* Landi Face SVG - White background with dark face */}
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
                                <circle cx="16" cy="18" r="2.5" fill="#0A0A0B" />
                                <circle cx="32" cy="18" r="2.5" fill="#0A0A0B" />
                                <path d="M24 22 Q22 24 20 24" stroke="#0A0A0B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                <path d="M18 27 Q24 32 30 27" stroke="#0A0A0B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            </svg>
                        </div>
                        <h1
                            className="text-3xl leading-[1.12] tracking-tight font-normal mb-1"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            <span className="text-purple-glow">Bem-vindo</span>{' '}
                            <span className="bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">de volta</span>
                        </h1>
                        <p className="text-slate-400 text-sm">Acesso restrito a administradores</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@empresa.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-slate-500 text-sm">
                            Não é administrador?{' '}
                            <a href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
                                Login de Cliente
                            </a>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
