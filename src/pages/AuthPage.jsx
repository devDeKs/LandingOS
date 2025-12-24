
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
                        data: { full_name: fullName, phone: phone }
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
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                                {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                            </span>
                        </h1>
                        <p className="text-slate-400 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
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
                                        <input
                                            name="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+55 11 99999-9999"
                                            className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder-slate-500"
                                        />
                                    </GlassInputWrapper>
                                </div>
                            )}

                            {isLogin && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400 flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name="rememberMe" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500/20" />
                                        <span className="text-slate-400 group-hover:text-white transition-colors">Manter conectado</span>
                                    </label>
                                    <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
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

                    {/* Testimonials at bottom */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={i} testimonial={t} delay={`delay-${1000 + i * 200}`} />
                        ))}
                    </div>

                    {/* Branding - Logo */}
                    <div className="absolute top-8 left-8 animate-in fade-in duration-1000 delay-500">
                        <img src="/logo.png" alt="LandingOS" className="h-10 w-auto" />
                    </div>
                </div>
            </section>
        </div>
    );
}
