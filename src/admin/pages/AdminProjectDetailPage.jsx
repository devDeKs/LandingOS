import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
    FolderKanban, ArrowLeft, RefreshCw, Loader2, CheckCircle2,
    XCircle, TrendingUp, User, Calendar, Briefcase, Users, Clock,
    Sparkles, X, Eye, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export default function AdminProjectDetailPage() {
    const { projectName } = useParams();
    const navigate = useNavigate();
    const decodedProjectName = decodeURIComponent(projectName || '');

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cardsFilter, setCardsFilter] = useState('all');
    const [viewCard, setViewCard] = useState(null);

    // Fetch project data
    const fetchProject = async () => {
        setLoading(true);
        try {
            // Get clients for this project
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, full_name, email, project_name, created_at')
                .eq('project_name', decodedProjectName)
                .order('created_at', { ascending: false });

            if (profilesError) {
                console.warn('Error fetching profiles:', profilesError);
                setProject(null);
                return;
            }

            if (!profiles || profiles.length === 0) {
                setProject(null);
                return;
            }

            // Get all cards for clients in this project
            const clientIds = profiles.map(p => p.id);
            const { data: cards, error: cardsError } = await supabase
                .from('projects')
                .select(`
                    *,
                    client:client_id (id, full_name, email, project_name)
                `)
                .in('client_id', clientIds)
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (cardsError) {
                console.warn('Error fetching cards:', cardsError);
            }

            // Calculate metrics
            const allCards = cards || [];
            const approved = allCards.filter(c => c.status === 'active' && c.client_accepted_at).length;
            const rejected = allCards.filter(c => c.status === 'archived' && c.rejected_at).length;
            const pending = allCards.filter(c => c.status === 'pending_approval').length;

            setProject({
                project_name: decodedProjectName,
                clients: profiles,
                clients_count: profiles.length,
                cards: allCards,
                total_cards: allCards.length,
                approved_count: approved,
                rejected_count: rejected,
                pending_count: pending,
                approval_rate: (approved + rejected) > 0 ? Math.round((approved / (approved + rejected)) * 100) : null
            });

        } catch (err) {
            console.error('Error fetching project:', err);
            setProject(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (decodedProjectName) {
            fetchProject();
        }
    }, [decodedProjectName]);

    // Filter cards
    const getFilteredCards = () => {
        if (!project?.cards) return [];
        return project.cards.filter(card => {
            if (cardsFilter === 'all') return true;
            if (cardsFilter === 'approved') return card.status === 'active' && card.client_accepted_at;
            if (cardsFilter === 'rejected') return card.status === 'archived' && card.rejected_at;
            if (cardsFilter === 'pending') return card.status === 'pending_approval';
            return true;
        });
    };

    const filteredCards = getFilteredCards();

    if (loading) {
        return (
            <div className="dashboard-page loaded flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="dashboard-page loaded">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]"
                >
                    <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
                        <FolderKanban className="w-8 h-8 text-violet-400" />
                    </div>
                    <p className="text-white font-medium mb-2">Projeto não encontrado</p>
                    <p className="text-sm text-slate-500 mb-6">O projeto "{decodedProjectName}" não existe ou foi removido</p>
                    <button
                        onClick={() => navigate('/admin/projetos')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#0A0A0B] font-medium hover:bg-slate-100 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para projetos
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="dashboard-page loaded">
            {/* Header with Back Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <button
                            onClick={() => navigate('/admin/projetos')}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                            <FolderKanban className="w-5 h-5 text-violet-400" />
                        </div>
                        <h1 className="text-3xl font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{project.project_name}</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400"
                    >
                        {project.clients_count} {project.clients_count === 1 ? 'cliente' : 'clientes'} • {project.total_cards} {project.total_cards === 1 ? 'card' : 'cards'}
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={fetchProject}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
            </div>

            {/* Project Summary Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative mb-8"
            >
                {/* Subtle glow */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-white/5 via-white/[0.08] to-white/5 rounded-2xl blur-sm opacity-50"></div>

                <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {/* Total Cards */}
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-violet-300" />
                                </div>
                            </div>
                            <p className="text-3xl text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>{project.total_cards}</p>
                            <p className="text-xs uppercase tracking-wider text-slate-500">Total Cards</p>
                        </div>

                        {/* Approved */}
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                                </div>
                            </div>
                            <p className="text-3xl text-emerald-300" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>{project.approved_count}</p>
                            <p className="text-xs uppercase tracking-wider text-slate-500">Aprovados</p>
                        </div>

                        {/* Rejected */}
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                    <XCircle className="w-5 h-5 text-red-300" />
                                </div>
                            </div>
                            <p className="text-3xl text-red-300" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>{project.rejected_count}</p>
                            <p className="text-xs uppercase tracking-wider text-slate-500">Recusados</p>
                        </div>

                        {/* Approval Rate */}
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-fuchsia-300" />
                                </div>
                            </div>
                            <p className="text-3xl text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
                                {project.approval_rate !== null ? `${project.approval_rate}%` : '-'}
                            </p>
                            <p className="text-xs uppercase tracking-wider text-slate-500">Taxa Aprovação</p>
                        </div>
                    </div>

                    {/* Pending indicator */}
                    {project.pending_count > 0 && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-6">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">{project.pending_count} cards aguardando aprovação</span>
                        </div>
                    )}

                    {/* Clients List */}
                    {project.clients && project.clients.length > 0 && (
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Clientes do Projeto
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {project.clients.map((client, i) => (
                                    <div
                                        key={client.id || i}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/20 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20">
                                            {client.full_name?.[0]?.toUpperCase() || 'C'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{client.full_name || 'Sem nome'}</p>
                                            <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {client.email}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Section Divider - Minimalist */}
            <div className="flex items-center gap-4 mb-8 mt-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"></div>
                <span className="text-[11px] text-slate-600 uppercase tracking-widest font-medium flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" />
                    Cards do Projeto
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"></div>
            </div>

            {/* Filter Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-2 mb-6"
            >
                {[
                    { id: 'all', label: 'Todos', count: project.total_cards },
                    { id: 'approved', label: 'Aprovados', count: project.approved_count, color: 'emerald' },
                    { id: 'rejected', label: 'Recusados', count: project.rejected_count, color: 'red' },
                    { id: 'pending', label: 'Pendentes', count: project.pending_count, color: 'amber' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setCardsFilter(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${cardsFilter === tab.id
                            ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                            : 'bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white border border-transparent'
                            }`}
                    >
                        {tab.label}
                        <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${cardsFilter === tab.id
                            ? 'bg-white/10 text-white'
                            : 'bg-white/5 text-slate-500'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </motion.div>

            {/* Cards Grid */}
            {filteredCards.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]"
                >
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Briefcase className="w-7 h-7 text-slate-600" />
                    </div>
                    <p className="text-slate-400 mb-1">Nenhum card encontrado</p>
                    <p className="text-sm text-slate-600">
                        {cardsFilter === 'all' ? 'Este projeto ainda não possui cards' : 'Não há cards nesta categoria'}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCards.map((card, idx) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => setViewCard(card)}
                            className={`group relative cursor-pointer transition-all hover:scale-[1.02]`}
                        >
                            {/* Hover glow */}
                            <div className={`absolute -inset-[1px] rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 ${card.status === 'archived' && card.rejected_at
                                ? 'bg-red-500/20'
                                : card.status === 'active' && card.client_accepted_at
                                    ? 'bg-emerald-500/20'
                                    : 'bg-violet-500/20'
                                }`}></div>

                            <div className={`relative p-4 rounded-2xl backdrop-blur-sm border transition-all ${card.status === 'archived' && card.rejected_at
                                ? 'bg-red-500/5 border-red-500/10 group-hover:border-red-500/30'
                                : card.status === 'active' && card.client_accepted_at
                                    ? 'bg-emerald-500/5 border-emerald-500/10 group-hover:border-emerald-500/30'
                                    : 'bg-white/5 border-white/10 group-hover:border-violet-500/30'
                                }`}>
                                <div className="flex items-start gap-4">
                                    {/* Card Image */}
                                    {card.image_url ? (
                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                                            <img src={card.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="w-8 h-8 text-slate-600" />
                                        </div>
                                    )}

                                    {/* Card Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="text-base font-semibold text-white truncate">{card.name}</h4>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="mb-2">
                                            {card.status === 'active' && card.client_accepted_at && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Aprovado
                                                </span>
                                            )}
                                            {card.status === 'archived' && card.rejected_at && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-500/10 text-red-400">
                                                    <XCircle className="w-3 h-3" />
                                                    Recusado
                                                </span>
                                            )}
                                            {card.status === 'pending_approval' && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400">
                                                    <Clock className="w-3 h-3" />
                                                    Pendente
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-500 flex items-center gap-2">
                                            <User className="w-3 h-3" />
                                            {card.client?.full_name || 'Sem cliente'}
                                            <span className="text-slate-600">•</span>
                                            <Calendar className="w-3 h-3" />
                                            {new Date(card.created_at).toLocaleDateString('pt-BR')}
                                        </p>

                                        {card.rejection_reason && (
                                            <p className="text-xs text-red-400 mt-2 line-clamp-1">
                                                Motivo: {card.rejection_reason}
                                            </p>
                                        )}
                                    </div>

                                    {/* View Icon */}
                                    <div className="flex-shrink-0 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                        <Eye className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* View Card Modal */}
            {viewCard && createPortal(
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setViewCard(null)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg max-h-[85vh] bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setViewCard(null)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {viewCard.image_url && (
                            <div className="w-full h-52">
                                <img src={viewCard.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="p-6 overflow-y-auto" style={{ maxHeight: viewCard.image_url ? 'calc(85vh - 13rem)' : 'calc(85vh - 2rem)' }}>
                            {/* Status */}
                            <div className="flex items-center justify-between mb-4">
                                {viewCard.status === 'active' && viewCard.client_accepted_at && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Aprovado
                                    </span>
                                )}
                                {viewCard.status === 'archived' && viewCard.rejected_at && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/10 text-red-400">
                                        <XCircle className="w-4 h-4" />
                                        Recusado
                                    </span>
                                )}
                                {viewCard.status === 'pending_approval' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-500/10 text-amber-400">
                                        <Sparkles className="w-4 h-4" />
                                        Pendente
                                    </span>
                                )}
                                <span className="text-xs text-slate-500">
                                    {new Date(viewCard.created_at).toLocaleDateString('pt-BR')}
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">{viewCard.name}</h2>

                            {viewCard.category && (
                                <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-400 mb-4">
                                    {viewCard.category}
                                </span>
                            )}

                            {viewCard.description && (
                                <p className="text-sm text-slate-300 leading-relaxed mb-4">{viewCard.description}</p>
                            )}

                            {/* Client */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Cliente</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold">
                                        {viewCard.client?.full_name?.[0]?.toUpperCase() || 'C'}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{viewCard.client?.full_name || 'Sem cliente'}</p>
                                        <p className="text-sm text-slate-500">{viewCard.client?.email || ''}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Rejection Reason */}
                            {viewCard.rejection_reason && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <XCircle className="w-4 h-4 text-red-400" />
                                        <p className="text-sm text-red-400 font-medium">Motivo da Recusa</p>
                                    </div>
                                    <p className="text-sm text-slate-300">{viewCard.rejection_reason}</p>
                                </div>
                            )}

                            <button
                                onClick={() => setViewCard(null)}
                                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>,
                document.body
            )}
        </div>
    );
}
