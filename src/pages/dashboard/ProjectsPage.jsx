import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Paperclip, MessageCircle, Settings2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Modal from '../../components/dashboard/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';

// Categories (Static for now, could be dynamic later)
const projectCategories = [
    { name: 'Design & UX', color: '#ec4899' },
    { name: 'Frontend', color: '#3b82f6' },
    { name: 'Infraestrutura', color: '#64748b' },
    { name: 'Integração', color: '#f59e0b' },
    { name: 'SEO & Marketing', color: '#10b981' },
    { name: 'Conteúdo', color: '#f97316' },
    { name: 'Backend', color: '#6366f1' },
    { name: 'Referência', color: '#8b5cf6' },
];

const getCategory = (name) => projectCategories.find(c => c.name === name) || { name: 'Geral', color: '#94a3b8' };

function ProjectCard({ card, index, onDragStart, columnId }) {
    const { isDarkMode } = useTheme();
    // card.category is just a string in DB, map it
    const category = getCategory(card.category || 'Geral');

    // Formatting date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
    };

    return (
        <motion.div
            layout
            layoutId={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            draggable
            onDragStart={(e) => onDragStart(e, card.id)}
            className={`relative group p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-lg hover:-translate-y-1
                ${isDarkMode
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:shadow-purple-500/10'
                    : 'bg-white/60 border-slate-200 shadow-sm hover:shadow-md hover:bg-white'
                }
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <span
                    className="text-[10px] px-2.5 py-1 rounded-full border font-medium tracking-wide uppercase"
                    style={{
                        borderColor: `${category.color}40`,
                        backgroundColor: `${category.color}15`,
                        color: category.color
                    }}
                >
                    {category.name}
                </span>
                <button className={`transition-colors ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <p className={`text-sm font-medium mb-5 leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {card.name}
                {card.description && <span className="block mt-1 text-xs opacity-70 font-normal">{card.description}</span>}
            </p>

            {/* Footer */}
            <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200/50'}`}>
                <div className="flex -space-x-2">
                    {/* Avatar Placeholder since we don't have full member data in this view yet */}
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-white text-slate-600'}
                   `}>
                        {card.owner_id ? 'AD' : 'CL'}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-medium flex items-center gap-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`}></div>
                        {formatDate(card.updated_at)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function KanbanColumn({ column, Cards, onDragStart, onDragOver, onDrop, columnIndex }) {
    const { isDarkMode } = useTheme();

    return (
        <div className="flex flex-col h-full min-w-[320px] lg:min-w-[350px]">
            {/* Column Header */}
            <div className={`flex items-center justify-between mb-6 px-1`}>
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_10px]`} style={{ backgroundColor: column.color, boxShadow: `0 0 10px ${column.color}` }}></div>
                    <h3 className={`text-sm font-semibold tracking-wide uppercase ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{column.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border
                        ${isDarkMode ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-slate-200 text-slate-600 border-slate-300'}
                    `}>
                        {Cards.length}
                    </span>
                </div>
                {columnIndex === 0 && (
                    <button className={`p-1.5 rounded-lg transition-colors
                        ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-900'}
                    `}>
                        <Plus className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Cards Container */}
            <div
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, column.id)}
                className={`flex-1 rounded-2xl border p-4 flex flex-col gap-4 transition-colors
                    ${isDarkMode
                        ? 'bg-white/[0.02] border-white/[0.02] hover:bg-white/[0.03]'
                        : 'bg-slate-100/50 border-slate-200/50 hover:bg-slate-100'
                    }
                `}
            >
                <AnimatePresence mode="popLayout">
                    {Cards.map((card, index) => (
                        <ProjectCard
                            key={card.id}
                            card={card}
                            index={index}
                            columnId={column.id}
                            onDragStart={onDragStart}
                        />
                    ))}
                </AnimatePresence>

                {Cards.length === 0 && (
                    <div className={`h-32 border border-dashed rounded-xl flex flex-col items-center justify-center gap-2
                        ${isDarkMode ? 'border-white/10 bg-white/[0.01] text-slate-500' : 'border-slate-300 bg-slate-50/50 text-slate-400'}
                    `}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <Plus className="w-4 h-4 opacity-50" />
                        </div>
                        <span className="text-xs">Nenhum item</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProjectsPage() {
    const { isDarkMode } = useTheme();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

    // Form State
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();

        // Subscribe to changes
        const channel = supabase
            .channel('public:projects')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
                fetchProjects(); // Refresh on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Create Project Handler
    const handleCreateProject = async () => {
        if (!newProjectName.trim()) {
            setCreateError('Nome do projeto é obrigatório.');
            return;
        }

        try {
            setCreateLoading(true);
            setCreateError('');

            const { data: { session } } = await supabase.auth.getSession();

            // Call Edge Function
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-project`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    name: newProjectName,
                    description: newProjectDesc,
                    // client_id: null for now, can be added later
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao criar projeto');
            }

            setIsNewProjectModalOpen(false);
            setNewProjectName('');
            setNewProjectDesc('');
            fetchProjects(); // Refresh list immediately
        } catch (error) {
            setCreateError(error.message);
        } finally {
            setCreateLoading(false);
        }
    };

    // Derived State: Group projects by column
    const columns = {
        aguardando: {
            id: 'aguardando',
            title: 'Aguardando Aprovação',
            color: '#8b5cf6',
            cards: projects.filter(p => p.status === 'draft' || p.status === 'pending_approval')
        },
        aprovados: {
            id: 'aprovados',
            title: 'Aprovados (Ativos)',
            color: '#10b981',
            cards: projects.filter(p => p.status === 'active')
        },
        finalizados: {
            id: 'finalizados',
            title: 'Finalizados',
            color: '#3b82f6',
            cards: projects.filter(p => p.status === 'archived')
        }
    };

    const handleDragStart = (e, cardId) => {
        // Implement drag logic if needed, or disable for strict state machine
    };

    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => e.preventDefault(); // Disabled manual drop for now to enforce state machine

    return (
        <div className="h-full flex flex-col">
            {/* Page Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className={`text-3xl font-display font-bold mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Projetos Ativos</h1>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Gerencie o fluxo de aprovação das suas landing pages.</p>
                </div>
                <div className="flex gap-3">
                    <button className={`p-2.5 rounded-xl border transition-colors
                        ${isDarkMode
                            ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                            : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }
                    `}>
                        <Settings2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsNewProjectModalOpen(true)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg
                            ${isDarkMode
                                ? 'bg-white text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
                            }
                        `}
                    >
                        <Plus className="w-5 h-5" />
                        Criar Projeto
                    </button>
                </div>
            </header>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar pb-6">
                <div className="flex gap-6 h-full min-w-max px-1">
                    {Object.values(columns).map((column, index) => (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            Cards={column.cards}
                            columnIndex={index}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        />
                    ))}
                </div>
            </div>

            {/* Create Project Modal */}
            <Modal
                isOpen={isNewProjectModalOpen}
                onClose={() => setIsNewProjectModalOpen(false)}
                title="Novo Projeto"
            >
                <div className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Nome do Projeto
                        </label>
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Ex: Landing Page TechLead"
                            className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all
                                ${isDarkMode
                                    ? 'bg-white/5 border-white/10 focus:border-purple-500 text-white placeholder-slate-500'
                                    : 'bg-white border-slate-200 focus:border-purple-500 text-slate-900'
                                }
                            `}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Descrição
                        </label>
                        <textarea
                            value={newProjectDesc}
                            onChange={(e) => setNewProjectDesc(e.target.value)}
                            rows={3}
                            placeholder="Breve descrição do escopo..."
                            className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all resize-none
                                ${isDarkMode
                                    ? 'bg-white/5 border-white/10 focus:border-purple-500 text-white placeholder-slate-500'
                                    : 'bg-white border-slate-200 focus:border-purple-500 text-slate-900'
                                }
                            `}
                        />
                    </div>

                    {createError && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            {createError}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            onClick={handleCreateProject}
                            disabled={createLoading}
                            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                                ${isDarkMode
                                    ? 'bg-white text-black hover:bg-slate-200'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                }
                                ${createLoading ? 'opacity-70 cursor-wait' : ''}
                            `}
                        >
                            {createLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                'Criar Projeto'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
