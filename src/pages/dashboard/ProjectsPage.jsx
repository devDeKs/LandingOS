import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, AlertCircle, Clock, Image as ImageIcon, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

// Status configuration
const statusConfig = {
    pending_approval: {
        label: 'Aguardando Aprovação',
        color: '#8b5cf6',
        bg: 'bg-violet-500/10',
        text: 'text-violet-400',
        icon: Clock
    },
    active: {
        label: 'Aprovado',
        color: '#10b981',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        icon: CheckCircle2
    },
    archived: {
        label: 'Finalizado',
        color: '#3b82f6',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        icon: Archive
    },
    draft: {
        label: 'Rascunho',
        color: '#64748b',
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        icon: Clock
    }
};

// Project Card Component
function ProjectCard({ card, onApprove, onReject, isProcessing }) {
    const { isDarkMode } = useTheme();
    const status = statusConfig[card.status] || statusConfig.pending_approval;
    const StatusIcon = status.icon;
    const isPending = card.status === 'pending_approval';

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            layout
            layoutId={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`relative group rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden
                ${isDarkMode
                    ? 'bg-white/5 border-white/5 hover:bg-white/10'
                    : 'bg-white/60 border-slate-200 shadow-sm hover:shadow-md'
                }
            `}
        >
            {/* Card Image (if exists) */}
            {card.image_url && (
                <div className="w-full h-40 overflow-hidden">
                    <img
                        src={card.image_url}
                        alt={card.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="p-5">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                    </span>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {formatDate(card.created_at)}
                    </span>
                </div>

                {/* Title */}
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    {card.name}
                </h3>

                {/* Description */}
                {card.description && (
                    <p className={`text-sm mb-4 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {card.description}
                    </p>
                )}

                {/* Category Badge */}
                {card.category && (
                    <div className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide mb-4
                        ${isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}
                    `}>
                        {card.category}
                    </div>
                )}

                {/* Action Buttons - Only for pending_approval */}
                {isPending && (
                    <div className={`flex gap-3 pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                        {/* Reject Button */}
                        <button
                            onClick={() => onReject(card.id)}
                            disabled={isProcessing}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all
                                ${isDarkMode
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40'
                                    : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            <XCircle className="w-4 h-4" />
                            Recusar
                        </button>

                        {/* Approve Button */}
                        <button
                            onClick={() => onApprove(card.id)}
                            disabled={isProcessing}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all
                                bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25
                                hover:shadow-emerald-500/40 hover:scale-[1.02]
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                            `}
                        >
                            {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}
                            Aprovar
                        </button>
                    </div>
                )}

                {/* Approved/Rejected info */}
                {card.status === 'active' && card.client_accepted_at && (
                    <div className={`pt-3 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                        <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aprovado em {formatDate(card.client_accepted_at)}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Kanban Column Component
function KanbanColumn({ title, color, cards, onApprove, onReject, isProcessing }) {
    const { isDarkMode } = useTheme();

    return (
        <div className="flex flex-col h-full min-w-[320px] lg:min-w-[350px]">
            {/* Column Header */}
            <div className="flex items-center gap-3 mb-6 px-1">
                <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                />
                <h3 className={`text-sm font-semibold tracking-wide uppercase ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {title}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border
                    ${isDarkMode ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-slate-200 text-slate-600 border-slate-300'}
                `}>
                    {cards.length}
                </span>
            </div>

            {/* Cards Container - NO drag/drop */}
            <div className={`flex-1 rounded-2xl border p-4 flex flex-col gap-4 overflow-y-auto
                ${isDarkMode
                    ? 'bg-white/[0.02] border-white/[0.02]'
                    : 'bg-slate-100/50 border-slate-200/50'
                }
            `}>
                <AnimatePresence mode="popLayout">
                    {cards.map((card) => (
                        <ProjectCard
                            key={card.id}
                            card={card}
                            onApprove={onApprove}
                            onReject={onReject}
                            isProcessing={isProcessing}
                        />
                    ))}
                </AnimatePresence>

                {cards.length === 0 && (
                    <div className={`h-32 border border-dashed rounded-xl flex flex-col items-center justify-center gap-2
                        ${isDarkMode ? 'border-white/10 bg-white/[0.01] text-slate-500' : 'border-slate-300 bg-slate-50/50 text-slate-400'}
                    `}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <ImageIcon className="w-4 h-4 opacity-50" />
                        </div>
                        <span className="text-xs">Nenhum projeto</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Reject Modal Component
function RejectModal({ isOpen, onClose, onConfirm, isProcessing }) {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        onConfirm(reason);
        setReason('');
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-6 rounded-2xl bg-[#1a1a2e] border border-white/10"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Recusar Projeto</h3>
                </div>

                <p className="text-slate-400 text-sm mb-4">
                    Por favor, informe o motivo da recusa (opcional):
                </p>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ex: Precisa de ajustes no design..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 resize-none mb-6"
                />

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Confirmar Recusa'
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Main ProjectsPage Component
export default function ProjectsPage() {
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [projectToReject, setProjectToReject] = useState(null);

    // Fetch Projects for current client
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('client_id', user?.id)
                .is('deleted_at', null)
                .in('status', ['pending_approval', 'active', 'archived'])
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchProjects();

            // Subscribe to realtime changes
            const channel = supabase
                .channel('client_projects')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'projects',
                    filter: `client_id=eq.${user.id}`
                }, () => {
                    fetchProjects();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user?.id]);

    // Approve Project
    const handleApprove = async (projectId) => {
        setProcessing(true);
        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    status: 'active',
                    client_accepted_at: new Date().toISOString()
                })
                .eq('id', projectId)
                .eq('client_id', user?.id);

            if (error) throw error;
            fetchProjects();
        } catch (error) {
            console.error('Error approving project:', error);
            alert('Erro ao aprovar projeto: ' + error.message);
        } finally {
            setProcessing(false);
        }
    };

    // Open Reject Modal
    const handleRejectClick = (projectId) => {
        setProjectToReject(projectId);
        setRejectModalOpen(true);
    };

    // Confirm Reject
    const handleRejectConfirm = async (reason) => {
        if (!projectToReject) return;

        setProcessing(true);
        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    status: 'archived',
                    rejected_at: new Date().toISOString(),
                    rejection_reason: reason || null
                })
                .eq('id', projectToReject)
                .eq('client_id', user?.id);

            if (error) throw error;

            setRejectModalOpen(false);
            setProjectToReject(null);
            fetchProjects();
        } catch (error) {
            console.error('Error rejecting project:', error);
            alert('Erro ao recusar projeto: ' + error.message);
        } finally {
            setProcessing(false);
        }
    };

    // Group projects by status
    const columns = {
        pending: {
            title: 'Aguardando Aprovação',
            color: '#8b5cf6',
            cards: projects.filter(p => p.status === 'pending_approval')
        },
        approved: {
            title: 'Aprovados',
            color: '#10b981',
            cards: projects.filter(p => p.status === 'active')
        },
        finished: {
            title: 'Finalizados',
            color: '#3b82f6',
            cards: projects.filter(p => p.status === 'archived')
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Page Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1
                        className="text-2xl md:text-3xl font-normal mb-2 tracking-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <span className="bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">Seus Projetos</span>
                    </h1>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Aprove ou recuse os projetos criados para você
                    </p>
                </div>
            </header>

            {/* Kanban Board - NO DRAG */}
            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 h-full min-h-[500px]">
                    {Object.entries(columns).map(([key, column]) => (
                        <KanbanColumn
                            key={key}
                            title={column.title}
                            color={column.color}
                            cards={column.cards}
                            onApprove={handleApprove}
                            onReject={handleRejectClick}
                            isProcessing={processing}
                        />
                    ))}
                </div>
            </div>

            {/* Reject Modal */}
            <AnimatePresence>
                {rejectModalOpen && (
                    <RejectModal
                        isOpen={rejectModalOpen}
                        onClose={() => {
                            setRejectModalOpen(false);
                            setProjectToReject(null);
                        }}
                        onConfirm={handleRejectConfirm}
                        isProcessing={processing}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
