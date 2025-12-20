import React, { useState } from 'react';
import Modal from './Modal';
import { BarChart3, FolderKanban, Clock, CheckCircle2, TrendingUp, Plus, ArrowUpRight, Zap, Target, Bell } from 'lucide-react';

export default function DashboardHome() {
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateProject = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsProjectModalOpen(false);
            // Here you would add the project to the global state
        }, 1500);
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

            {/* Welcome Card - Large (2x1) */}
            <div className="md:col-span-2 lg:col-span-2 dashboard-card p-8 flex flex-col justify-between relative overflow-hidden group">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-2 font-outfit" style={{ color: 'var(--dash-text-primary)' }}>
                        Bem-vindo, João!
                    </h1>
                    <p className="text-[var(--dash-text-muted)] text-lg max-w-md">
                        Você tem <span className="text-[var(--dash-accent)] font-bold">4 projetos ativos</span> hoje.
                        Sua produtividade aumentou 12% esta semana.
                    </p>
                </div>
                <div className="relative z-10 mt-6 flex gap-4">
                    <button onClick={() => setIsProjectModalOpen(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Novo Projeto
                    </button>
                    <button className="btn-secondary backdrop-blur-md">
                        Ver Relatórios
                    </button>
                </div>

                {/* Abstract Background Decor */}
                <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-[var(--dash-accent)] opacity-20 blur-[80px] rounded-full group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute right-10 bottom-10 mix-blend-overlay">
                    <Target className="w-32 h-32 text-[var(--dash-text-muted)] opacity-10 rotate-12" />
                </div>
            </div>

            {/* Stats Card: Projects */}
            <div className="dashboard-card p-6 flex flex-col justify-between group hover:border-[var(--dash-accent)] transition-all">
                <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 backdrop-blur-sm">
                        <FolderKanban className="w-6 h-6" />
                    </div>
                    <span className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        +12% <ArrowUpRight className="w-3 h-3 ml-1" />
                    </span>
                </div>
                <div>
                    <h3 className="text-6xl text-number-thin mt-4 mb-1" style={{ color: 'var(--dash-text-primary)' }}>12</h3>
                    <p className="text-[var(--dash-text-muted)] font-medium text-sm uppercase tracking-wide">Projetos Totais</p>
                </div>
            </div>

            {/* Stats Card: Pending */}
            <div className="dashboard-card p-6 flex flex-col justify-between group hover:border-orange-500/50 transition-all">
                <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 backdrop-blur-sm">
                        <Clock className="w-6 h-6" />
                    </div>
                    <span className="flex items-center text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        3 Pendentes
                    </span>
                </div>
                <div>
                    <h3 className="text-6xl text-number-thin mt-4 mb-1" style={{ color: 'var(--dash-text-primary)' }}>7</h3>
                    <p className="text-[var(--dash-text-muted)] font-medium text-sm uppercase tracking-wide">Aguardando Avaliação</p>
                </div>
            </div>

            {/* Dark Card: Tasks (1x2) */}
            <div className="lg:col-span-1 lg:row-span-2 dashboard-card-dark p-6 rounded-[32px] flex flex-col backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white font-outfit">Tarefas Urgentes</h3>
                    <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">2/8</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                    {[
                        { title: 'Revisar Hero Section', time: 'Hoje, 14:00', done: true },
                        { title: 'Aprovar Paleta de Cores', time: 'Hoje, 16:30', done: false },
                        { title: 'Meeting com Cliente', time: 'Amanhã, 10:00', done: false },
                        { title: 'Upload Assets Finais', time: '19 Set, 09:00', done: false },
                        { title: 'Atualizar Briefing', time: '20 Set, 15:00', done: false }
                    ].map((task, i) => (
                        <div key={i} className="inner-card flex items-center gap-4 p-4 hover:bg-white/10 transition-colors group cursor-pointer">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${task.done ? 'bg-green-500 border-green-500' : 'border-white/20 group-hover:border-purple-400'}`}>
                                {task.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-medium truncate ${task.done ? 'text-white/40 line-through' : 'text-white'}`}>
                                    {task.title}
                                </p>
                                <p className="text-xs text-white/40">{task.time}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all text-sm backdrop-blur-md">
                    Ver todas as tarefas
                </button>
            </div>

            {/* Focus Tracker (1x1) */}
            <div className="dashboard-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--dash-accent-bg)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="w-36 h-36 rounded-full border-[6px] border-[var(--dash-bg-primary)] border-t-[var(--dash-accent)] flex items-center justify-center mb-4 shadow-lg shadow-[var(--dash-accent-bg)]">
                        <div>
                            <span className="text-3xl text-number-thin block" style={{ color: 'var(--dash-text-primary)' }}>02:35</span>
                            <span className="text-xs text-[var(--dash-text-muted)] uppercase tracking-wider font-bold">Foco</span>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button className="w-12 h-12 rounded-full bg-[var(--dash-text-primary)] text-[var(--dash-bg-secondary)] flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                            <div className="w-3 h-3 bg-current rounded-sm"></div>
                        </button>
                        <button className="w-12 h-12 rounded-full inner-card flex items-center justify-center hover:bg-[var(--dash-accent)] hover:text-white transition-all text-[var(--dash-text-primary)]">
                            <Zap className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications / Activity (2x1) */}
            <div className="md:col-span-2 dashboard-card p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-outfit" style={{ color: 'var(--dash-text-primary)' }}>Notificações</h3>
                    <button className="p-2 rounded-full hover:bg-[var(--dash-bg-primary)] transition-colors">
                        <Bell className="w-5 h-5 text-[var(--dash-text-muted)]" />
                    </button>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                    {[
                        { title: 'Novo comentário em "Landing Dr. Marcus"', time: 'Há 10 min', type: 'comment' },
                        { title: 'Projeto "Escritório JM" Aprovado', time: 'Há 2 horas', type: 'success' },
                        { title: 'Prazo próximo: Studio Design', time: 'Amanhã', type: 'warning' }
                    ].map((notif, i) => (
                        <div key={i} className="inner-card p-4 flex items-center gap-4 hover:translate-x-1 transition-transform cursor-default">
                            <div className={`w-2 h-2 rounded-full ${notif.type === 'success' ? 'bg-green-500' :
                                notif.type === 'warning' ? 'bg-orange-500' : 'bg-purple-500'
                                }`} />
                            <p className="text-sm font-medium flex-1" style={{ color: 'var(--dash-text-primary)' }}>
                                {notif.title}
                            </p>
                            <span className="text-xs px-2 py-1 rounded-md bg-[var(--dash-bg-primary)]" style={{ color: 'var(--dash-text-muted)' }}>
                                {notif.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Project Modal */}
            <Modal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                title="Novo Projeto"
            >
                <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Nome do Projeto</label>
                        <input
                            type="text"
                            placeholder="Ex: Redesign Website"
                            className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[var(--dash-accent)] transition-colors"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Cliente</label>
                            <input
                                type="text"
                                placeholder="Nome do cliente"
                                className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[var(--dash-accent)] transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Prazo</label>
                            <input
                                type="date"
                                className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[var(--dash-accent)] transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Categoria</label>
                        <select className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[var(--dash-accent)] transition-colors appearance-none">
                            <option value="web">Web Design</option>
                            <option value="app">App Development</option>
                            <option value="brand">Branding</option>
                            <option value="marketing">Marketing</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Descrição</label>
                        <textarea
                            rows="3"
                            placeholder="Breve descrição do escopo..."
                            className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[var(--dash-accent)] transition-colors resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsProjectModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--dash-text-secondary)] hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4" />
                                    Criar Projeto
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
