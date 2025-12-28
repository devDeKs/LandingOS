
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, X, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

// --- SUB-COMPONENTS ---

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 focus-within:border-purple-500/50 focus-within:bg-purple-500/10 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
        {children}
    </div>
);

const TestimonialCard = ({ testimonial, delay }) => (
    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-700 ${delay} flex items-start gap-3 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-5 w-64 shadow-2xl`}>
        <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
        <div className="text-sm leading-snug">
            <p className="flex items-center gap-1 font-medium text-white">{testimonial.name}</p>
            <p className="text-slate-400">{testimonial.handle}</p>
            <p className="mt-1 text-slate-300">{testimonial.text}</p>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export default function AuthPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [projectName, setProjectName] = useState('');

    // Forgot password states
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState(null);

    const testimonials = [
        {
            avatarSrc: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
            name: 'Carlos M.',
            handle: '@carlosm_dev',
            text: 'A melhor plataforma para gerenciar meus projetos de landing page.'
        },
        {
            avatarSrc: 'https://i.pravatar.cc/150?u=a042581f4e29026708c',
            name: 'Ana Silva',
            handle: '@anasilva',
            text: 'Interface incrível e fácil de usar. Recomendo!'
        }
    ];

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate('/dashboard');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/dashboard`,
                        data: { full_name: fullName, phone: phone, project_name: projectName }
                    }
                });
                if (error) throw error;
                setError({ type: 'success', message: 'Verifique seu email para confirmar o cadastro!' });
            }
        } catch (err) {
            setError({ type: 'error', message: err.message === 'Invalid login credentials' ? 'Credenciais inválidas.' : err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            setResetSuccess(true);
        } catch (err) {
            setResetError(err.message);
        } finally {
            setResetLoading(false);
        }
    };

    const closeForgotPassword = () => {
        setShowForgotPassword(false);
        setResetEmail('');
        setResetSuccess(false);
        setResetError(null);
    };



    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans w-full bg-[#0B0B0F] text-white selection:bg-purple-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            {/* Left column: sign-in form */}
            <section className="flex-1 flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-6">
                        <h1
                            className="text-4xl md:text-5xl leading-[1.12] tracking-tight font-normal animate-in fade-in slide-in-from-bottom-2 duration-500"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            {isLogin ? (
                                <>
                                    <span className="text-purple-glow">Bem-vindo</span>{' '}
                                    <span className="bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">de volta</span>
                                </>
                            ) : (
                                <span className="bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">Crie sua conta</span>
                            )}
                        </h1>
                        <p className="text-slate-400 text-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 -mt-4">
                            {isLogin ? 'Acesse sua conta e continue gerenciando seus projetos.' : 'Comece a criar landing pages incríveis hoje.'}
                        </p>

                        {error && (
                            <div className={`p-4 rounded-2xl text-sm border animate-in fade-in duration-300 ${error.type === 'success'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                {error.message}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSignIn}>
                            {/* Name field - only for registration */}
                            {!isLogin && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Nome Completo</label>
                                    <GlassInputWrapper>
                                        <input
                                            name="fullName"
                                            type="text"
                                            required={!isLogin}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Seu nome completo"
                                            className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder-slate-500"
                                        />
                                    </GlassInputWrapper>
                                </div>
                            )}

                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Email</label>
                                <GlassInputWrapper>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder-slate-500"
                                    />
                                </GlassInputWrapper>
                            </div>

                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Senha</label>
                                <GlassInputWrapper>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder-slate-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </GlassInputWrapper>
                            </div>

                            {/* Phone field - only for registration */}
                            {!isLogin && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-350">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Telefone</label>
                                    <GlassInputWrapper>
                                        <div className="flex items-center">
                                            <span className="pl-4 pr-2 text-slate-400 text-sm font-medium">+55</span>
                                            <input
                                                name="phone"
                                                type="tel"
                                                inputMode="numeric"
                                                value={phone}
                                                onChange={(e) => {
                                                    // Only allow numbers and format as (DD) 99999-9999
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    let formatted = value;
                                                    if (value.length >= 2) {
                                                        formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}`;
                                                        if (value.length > 7) {
                                                            formatted += `-${value.slice(7, 11)}`;
                                                        }
                                                    }
                                                    setPhone(formatted);
                                                }}
                                                maxLength={16}
                                                placeholder="(DD) 99999-9999"
                                                className="flex-1 bg-transparent text-sm p-4 pl-0 rounded-2xl focus:outline-none text-white placeholder-slate-500"
                                            />
                                        </div>
                                    </GlassInputWrapper>
                                </div>
                            )}

                            {/* Project Name field - only for registration */}
                            {!isLogin && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Nome do Projeto</label>
                                    <GlassInputWrapper>
                                        <input
                                            name="projectName"
                                            type="text"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            placeholder="Ex: Landing Page Odontologia"
                                            className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder-slate-500"
                                        />
                                    </GlassInputWrapper>
                                    <p className="text-xs text-slate-500 mt-1.5 pl-1">Informe o nome do seu projeto para identificação</p>
                                </div>
                            )}

                            {isLogin && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400 flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name="rememberMe" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500/20" />
                                        <span className="text-slate-400 group-hover:text-white transition-colors">Manter conectado</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                                    >
                                        Esqueceu a senha?
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500 w-full rounded-2xl bg-white py-4 font-bold text-black hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {isLogin ? 'Entrar' : 'Criar Conta'}
                            </button>
                        </form>



                        <p className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-800 text-center text-sm text-slate-400">
                            {isLogin ? 'Novo por aqui? ' : 'Já tem uma conta? '}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                                className="text-purple-400 hover:text-purple-300 transition-colors font-medium hover:underline"
                            >
                                {isLogin ? 'Criar conta' : 'Fazer login'}
                            </button>
                        </p>
                    </div>
                </div>
            </section>

            {/* Right column: hero image + testimonials */}
            <section className="hidden lg:block flex-1 relative p-4">
                <div
                    className="absolute inset-4 rounded-3xl bg-cover bg-center overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2864&auto=format&fit=crop')` }}
                >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-transparent"></div>



                    {/* Branding - Logo */}
                    <div className="absolute top-8 left-8 animate-in fade-in duration-1000 delay-500">
                        <img src="/logo.png" alt="LandingOS" className="h-10 w-auto" />
                    </div>
                </div>
            </section>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={closeForgotPassword}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-8 rounded-3xl bg-[#12121a] backdrop-blur-xl border border-white/10 shadow-2xl">
                            {/* Close button */}
                            <button
                                onClick={closeForgotPassword}
                                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {!resetSuccess ? (
                                <>
                                    {/* Header */}
                                    <div className="text-center mb-6">
                                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                                            <Mail className="w-7 h-7 text-purple-400" />
                                        </div>
                                        <h2
                                            className="text-2xl font-normal mb-2"
                                            style={{ fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            <span className="text-purple-glow">Recuperar</span>{' '}
                                            <span className="bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">senha</span>
                                        </h2>
                                        <p className="text-slate-400 text-sm">
                                            Digite seu email e enviaremos um link para redefinir sua senha.
                                        </p>
                                    </div>

                                    {/* Error Message */}
                                    {resetError && (
                                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                            {resetError}
                                        </div>
                                    )}

                                    {/* Form */}
                                    <form onSubmit={handleForgotPassword} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                                Email
                                            </label>
                                            <GlassInputWrapper>
                                                <input
                                                    type="email"
                                                    value={resetEmail}
                                                    onChange={(e) => setResetEmail(e.target.value)}
                                                    placeholder="seu@email.com"
                                                    required
                                                    autoFocus
                                                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder-slate-500"
                                                />
                                            </GlassInputWrapper>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={resetLoading || !resetEmail}
                                            className="w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {resetLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                'Enviar link de recuperação'
                                            )}
                                        </button>
                                    </form>

                                    {/* Back to login */}
                                    <button
                                        onClick={closeForgotPassword}
                                        className="w-full mt-4 py-3 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Voltar ao login
                                    </button>
                                </>
                            ) : (
                                /* Success State */
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <h2
                                        className="text-2xl font-normal mb-2"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                    >
                                        <span className="bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                                            Email enviado!
                                        </span>
                                    </h2>
                                    <p className="text-slate-400 text-sm mb-6">
                                        Verifique sua caixa de entrada em <span className="text-white font-medium">{resetEmail}</span> e clique no link para redefinir sua senha.
                                    </p>
                                    <button
                                        onClick={closeForgotPassword}
                                        className="w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-all shadow-lg"
                                    >
                                        Voltar ao login
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
