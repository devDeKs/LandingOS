import React, { useState } from 'react';
import Modal from './Modal';
import { BarChart3, FolderKanban, Clock, CheckCircle2, TrendingUp, Plus, ArrowUpRight, Zap, Target, Bell } from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';

export default function DashboardHome() {
    const { isDarkMode } = useTheme();
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
            <div className={`md:col-span-2 lg:col-span-2 p-8 flex flex-col justify-between relative overflow-hidden group rounded-[32px] border shadow-2xl transition-all duration-300
                ${isDarkMode
                    ? 'bg-white/10 backdrop-blur-3xl border-white/10 hover:bg-white/15'
                    : 'bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-slate-200/50 hover:bg-white/80'
                }
            `}>
                <div className="relative z-10">
                    <h1 className={`text-5xl font-extrabold mb-2 font-outfit tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Bem-vindo, João!
                    </h1>
                    <p className={`text-lg max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Você tem <span className={`font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>4 projetos ativos</span> hoje.
                        Sua produtividade aumentou 12% esta semana.
                    </p>
                </div>
                <div className="relative z-10 mt-6 flex gap-4">
                    <button onClick={() => setIsProjectModalOpen(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Novo Projeto
                    </button>
                    <button className={`btn-secondary backdrop-blur-md border hover:bg-white/10 ${isDarkMode ? 'border-white/10 text-white' : 'border-slate-200 text-slate-700 hover:text-slate-900'}`}>
                        Ver Relatórios
                    </button>
                </div>

                {/* Abstract Background Decor */}
                <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-purple-500 opacity-20 blur-[80px] rounded-full group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute right-10 bottom-10 mix-blend-overlay">
                    <Target className={`w-32 h-32 opacity-10 rotate-12 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                </div>
            </div>

            {/* Stats Card: Projects */}
            <div className={`p-6 flex flex-col justify-between group rounded-[32px] backdrop-blur-3xl border shadow-xl transition-all duration-300 hover:scale-[1.02]
                 ${isDarkMode
                    ? 'bg-white/10 border-white/10 hover:bg-white/15'
                    : 'bg-white/60 border-slate-200/50 shadow-slate-200/50 hover:bg-white/80'
                }
            `}>
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.4)] border
                        ${isDarkMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/20' : 'bg-purple-100/50 text-purple-600 border-purple-200/50'}
                    `}>
                        <FolderKanban className="w-6 h-6" />
                    </div>
                    <span className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border
                        ${isDarkMode ? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/20' : 'text-emerald-600 bg-emerald-100/50 border-emerald-200/50'}
                    `}>
                        +12% <ArrowUpRight className="w-3 h-3 ml-1" />
                    </span>
                </div>
                <div>
                    <h3 className={`text-6xl text-number-thin mt-4 mb-1 track-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>12</h3>
                    <p className={`font-medium text-sm uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Projetos Totais</p>
                </div>
            </div>

            {/* Stats Card: Pending */}
            <div className={`p-6 flex flex-col justify-between group rounded-[32px] backdrop-blur-3xl border shadow-xl transition-all duration-300 hover:scale-[1.02]
                 ${isDarkMode
                    ? 'bg-white/10 border-white/10 hover:bg-white/15'
                    : 'bg-white/60 border-slate-200/50 shadow-slate-200/50 hover:bg-white/80'
                }
            `}>
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.4)] border
                        ${isDarkMode ? 'bg-orange-500/20 text-orange-300 border-orange-500/20' : 'bg-orange-100/50 text-orange-600 border-orange-200/50'}
                    `}>
                        <Clock className="w-6 h-6" />
                    </div>
                    <span className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border
                        ${isDarkMode ? 'text-orange-300 bg-orange-500/20 border-orange-500/20' : 'text-orange-600 bg-orange-100/50 border-orange-200/50'}
                    `}>
                        3 Pendentes
                    </span>
                </div>
                <div>
                    <h3 className={`text-6xl text-number-thin mt-4 mb-1 track-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>7</h3>
                    <p className={`font-medium text-sm uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Aguardando Avaliação</p>
                </div>
            </div>

            {/* Dark Card: Tasks (1x2) */}
            <div className={`lg:col-span-1 lg:row-span-2 p-6 rounded-[32px] flex flex-col backdrop-blur-3xl border shadow-2xl relative overflow-hidden
                ${isDarkMode
                    ? 'bg-gradient-to-br from-[#1f1235] to-[#0f0728] border-white/10'
                    : 'bg-white border-slate-200 shadow-slate-200/50'
                }
            `}>
                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 w-full h-full blur-3xl pointer-events-none ${isDarkMode ? 'bg-purple-500/5' : 'bg-purple-500/5'}`}></div>

                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className={`text-xl font-bold font-outfit ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tarefas Urgentes</h3>
                    <span className={`text-xs px-3 py-1 rounded-full backdrop-blur-md border
                        ${isDarkMode ? 'bg-white/10 text-white/80 border-white/5' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        2/8
                    </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar relative z-10">
                    {[
                        { title: 'Revisar Hero Section', time: 'Hoje, 14:00', done: true },
                        { title: 'Aprovar Paleta de Cores', time: 'Hoje, 16:30', done: false },
                        { title: 'Meeting com Cliente', time: 'Amanhã, 10:00', done: false },
                        { title: 'Upload Assets Finais', time: '19 Set, 09:00', done: false },
                        { title: 'Atualizar Briefing', time: '20 Set, 15:00', done: false }
                    ].map((task, i) => (
                        <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors group cursor-pointer backdrop-blur-sm
                            ${isDarkMode
                                ? 'bg-white/5 border-white/5 hover:bg-white/10'
                                : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                            }
                        `}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${task.done
                                ? 'bg-green-500 border-green-500'
                                : isDarkMode ? 'border-white/20 group-hover:border-purple-400' : 'border-slate-300 group-hover:border-purple-500'
                                }`}>
                                {task.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-medium truncate ${task.done
                                    ? isDarkMode ? 'text-white/40 line-through' : 'text-slate-400 line-through'
                                    : isDarkMode ? 'text-white' : 'text-slate-900'
                                    }`}>
                                    {task.title}
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>{task.time}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className={`w-full mt-4 py-3 rounded-2xl font-medium transition-all text-sm backdrop-blur-md border relative z-10
                    ${isDarkMode
                        ? 'bg-white/10 hover:bg-white/20 text-white border-white/5'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }
                `}>
                    Ver todas as tarefas
                </button>
            </div>

            {/* Focus Tracker (1x1) */}
            <div className={`p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group rounded-[32px] backdrop-blur-3xl border shadow-xl transition-all duration-300 hover:scale-[1.02]
                ${isDarkMode
                    ? 'bg-white/10 border-white/10 hover:bg-white/15'
                    : 'bg-white/60 border-slate-200/50 shadow-slate-200/50 hover:bg-white/80'
                }
            `}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className={`w-36 h-36 rounded-full border-[6px] border-t-purple-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(168,85,247,0.2)]
                        ${isDarkMode ? 'border-white/5' : 'border-slate-100'}
                    `}>
                        <div>
                            <span className={`text-4xl text-number-thin block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>02:35</span>
                            <span className={`text-xs uppercase tracking-wider font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Foco</span>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                            <div className="w-3 h-3 bg-current rounded-sm"></div>
                        </button>
                        <button className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all
                            ${isDarkMode
                                ? 'bg-white/10 border-white/10 hover:bg-purple-500 hover:text-white text-white'
                                : 'bg-slate-100 border-slate-200 hover:bg-purple-500 hover:text-white text-slate-700'
                            }
                        `}>
                            <Zap className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications / Activity (2x1) */}
            <div className={`md:col-span-2 p-6 flex flex-col rounded-[32px] backdrop-blur-3xl border shadow-xl
                ${isDarkMode
                    ? 'bg-white/10 border-white/10'
                    : 'bg-white/60 border-slate-200/50 shadow-slate-200/50'
                }
            `}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold font-outfit ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notificações</h3>
                    <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
                        <Bell className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    </button>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                    {[
                        { title: 'Novo comentário em "Landing Dr. Marcus"', time: 'Há 10 min', type: 'comment' },
                        { title: 'Projeto "Escritório JM" Aprovado', time: 'Há 2 horas', type: 'success' },
                        { title: 'Prazo próximo: Studio Design', time: 'Amanhã', type: 'warning' }
                    ].map((notif, i) => (
                        <div key={i} className={`p-4 flex items-center gap-4 hover:translate-x-1 transition-transform cursor-default rounded-2xl border
                             ${isDarkMode
                                ? 'bg-white/5 border-white/5 hover:bg-white/10'
                                : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                            }
                        `}>
                            <div className={`w-2 h-2 rounded-full ${notif.type === 'success' ? 'bg-green-500' :
                                notif.type === 'warning' ? 'bg-orange-500' : 'bg-purple-500 relative'
                                }`}>
                                {notif.type !== 'success' && notif.type !== 'warning' && <div className="absolute inset-0 bg-purple-500 animate-ping rounded-full opacity-50"></div>}
                            </div>
                            <p className={`text-sm font-medium flex-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                {notif.title}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-md border
                                ${isDarkMode
                                    ? 'bg-white/5 text-slate-400 border-white/5'
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                }
                            `}>
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
