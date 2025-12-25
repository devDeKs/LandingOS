import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    FolderKanban, Search, RefreshCw, Loader2, CheckCircle2,
    XCircle, TrendingUp, User, Mail, Eye, ChevronDown, ChevronRight,
    Calendar, Briefcase, Users, Clock, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// Project Block Component - Shows a project with its metrics and cards
const ProjectBlock = ({ project, index, onViewCards }) => {
    const [expanded, setExpanded] = useState(false);

    const approvalRate = project.total_cards > 0 && (project.approved_count + project.rejected_count) > 0
        ? Math.round((project.approved_count / (project.approved_count + project.rejected_count)) * 100)
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="group"
        >
            {/* Main Project Card */}
            <motion.div
                whileHover={{ y: -2 }}
                className="relative"
            >
                {/* Neon glow on hover */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/30 group-hover:via-fuchsia-500/30 group-hover:to-violet-500/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-violet-500/30 transition-all duration-300">

                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                                <FolderKanban className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{project.project_name}</h3>
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4" />
                                        {project.clients_count} {project.clients_count === 1 ? 'cliente' : 'clientes'}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Briefcase className="w-4 h-4" />
                                        {project.total_cards} {project.total_cards === 1 ? 'card' : 'cards'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                        >
                            <motion.div
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="w-5 h-5" />
                            </motion.div>
                        </button>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {/* Total Cards */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-violet-500/20 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                    <Briefcase className="w-4 h-4 text-violet-400" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white">{project.total_cards}</p>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">Total Cards</p>
                        </div>

                        {/* Approved */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-emerald-400">{project.approved_count}</p>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">Aprovados</p>
                        </div>

                        {/* Rejected */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-red-500/20 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                    <XCircle className="w-4 h-4 text-red-400" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-red-400">{project.rejected_count}</p>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">Recusados</p>
                        </div>

                        {/* Approval Rate */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-fuchsia-500/20 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-fuchsia-400" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                {approvalRate !== null ? `${approvalRate}%` : '-'}
                            </p>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">Taxa Aprovação</p>
                        </div>
                    </div>

                    {/* Pending indicator */}
                    {project.pending_count > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{project.pending_count} cards aguardando aprovação</span>
                        </div>
                    )}

                    {/* Clients List Preview */}
                    {project.clients && project.clients.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Clientes do Projeto</p>
                            <div className="flex flex-wrap gap-2">
                                {project.clients.slice(0, 5).map((client, i) => (
                                    <div
                                        key={client.id || i}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-[10px] font-bold">
                                            {client.full_name?.[0]?.toUpperCase() || 'C'}
                                        </div>
                                        <span className="text-xs text-slate-300">{client.full_name || client.email}</span>
                                    </div>
                                ))}
                                {project.clients.length > 5 && (
                                    <span className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-slate-500">
                                        +{project.clients.length - 5} mais
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Expanded Cards List */}
            <AnimatePresence>
                {expanded && project.cards && project.cards.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 pl-8 space-y-3">
                            {project.cards.map((card, cardIndex) => (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: cardIndex * 0.05 }}
                                    className={`p-4 rounded-xl backdrop-blur-sm border transition-all
                                        ${card.status === 'archived' && card.rejected_at
                                            ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/30'
                                            : card.status === 'active' && card.client_accepted_at
                                                ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30'
                                                : 'bg-white/5 border-white/10 hover:border-violet-500/30'
                                        }`
                                    }
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Card Image */}
                                        {card.image_url ? (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={card.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-6 h-6 text-slate-600" />
                                            </div>
                                        )}

                                        {/* Card Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-semibold text-white truncate">{card.name}</h4>
                                                {card.status === 'active' && card.client_accepted_at && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400">
                                                        Aprovado
                                                    </span>
                                                )}
                                                {card.status === 'archived' && card.rejected_at && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400">
                                                        Recusado
                                                    </span>
                                                )}
                                                {card.status === 'pending_approval' && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400">
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
                                                <p className="text-xs text-red-400 mt-1 truncate">
                                                    Motivo: {card.rejection_reason}
                                                </p>
                                            )}
                                        </div>

                                        {/* View Button */}
                                        <button
                                            onClick={() => onViewCards?.(card)}
                                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Main Component
export default function AdminProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewCard, setViewCard] = useState(null);
    const [globalMetrics, setGlobalMetrics] = useState(null);

    // Fetch projects grouped by project_name
    const fetchProjects = async () => {
        setLoading(true);
        try {
            // Step 1: Get all unique project_names from profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, full_name, email, project_name, created_at')
                .not('project_name', 'is', null)
                .order('created_at', { ascending: false });

            if (profilesError) {
                console.warn('Error fetching profiles:', profilesError);
                setProjects([]);
                return;
            }

            // Step 2: Get all cards with client info
            const { data: cards, error: cardsError } = await supabase
                .from('projects')
                .select(`
                    *,
                    client:client_id (id, full_name, email, project_name)
                `)
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (cardsError) {
                console.warn('Error fetching cards:', cardsError);
            }

            // Step 3: Group by project_name
            const projectsMap = {};

            // Add all clients to their projects
            (profiles || []).forEach(profile => {
                const projectName = profile.project_name;
                if (!projectName) return;

                if (!projectsMap[projectName]) {
                    projectsMap[projectName] = {
                        project_name: projectName,
                        clients: [],
                        cards: [],
                        total_cards: 0,
                        approved_count: 0,
                        rejected_count: 0,
                        pending_count: 0
                    };
                }

                projectsMap[projectName].clients.push(profile);
            });

            // Add cards to their projects based on client's project_name
            (cards || []).forEach(card => {
                const clientProjectName = card.client?.project_name;
                if (!clientProjectName || !projectsMap[clientProjectName]) return;

                projectsMap[clientProjectName].cards.push(card);
                projectsMap[clientProjectName].total_cards++;

                if (card.status === 'active' && card.client_accepted_at) {
                    projectsMap[clientProjectName].approved_count++;
                } else if (card.status === 'archived' && card.rejected_at) {
                    projectsMap[clientProjectName].rejected_count++;
                } else if (card.status === 'pending_approval') {
                    projectsMap[clientProjectName].pending_count++;
                }
            });

            // Convert to array and add clients count
            const projectsArray = Object.values(projectsMap).map(project => ({
                ...project,
                clients_count: project.clients.length
            }));

            // Sort by total_cards desc
            projectsArray.sort((a, b) => b.total_cards - a.total_cards);

            setProjects(projectsArray);

            // Calculate global metrics
            const totalCards = (cards || []).length;
            const approved = (cards || []).filter(c => c.status === 'active' && c.client_accepted_at).length;
            const rejected = (cards || []).filter(c => c.status === 'archived' && c.rejected_at).length;
            const pending = (cards || []).filter(c => c.status === 'pending_approval').length;

            setGlobalMetrics({
                total_projects: projectsArray.length,
                total_cards: totalCards,
                approved,
                rejected,
                pending,
                rate: (approved + rejected) > 0 ? Math.round((approved / (approved + rejected)) * 100) : null
            });

        } catch (err) {
            console.error('Error fetching projects:', err);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Filter projects
    const filteredProjects = projects.filter(p =>
        p.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clients?.some(c => c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="dashboard-page loaded">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <FolderKanban className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Projetos</h1>
                            <p className="text-slate-400 text-sm">
                                {projects.length} projetos cadastrados
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={fetchProjects}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all text-slate-400 hover:text-white"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
            </div>

            {/* Global Metrics */}
            {globalMetrics && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
                >
                    <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                        <p className="text-3xl font-bold text-white mb-1">{globalMetrics.total_projects}</p>
                        <p className="text-xs uppercase tracking-wider text-slate-500">Projetos</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                        <p className="text-3xl font-bold text-violet-400 mb-1">{globalMetrics.total_cards}</p>
                        <p className="text-xs uppercase tracking-wider text-slate-500">Total Cards</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                        <p className="text-3xl font-bold text-emerald-400 mb-1">{globalMetrics.approved}</p>
                        <p className="text-xs uppercase tracking-wider text-slate-500">Aprovados</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                        <p className="text-3xl font-bold text-red-400 mb-1">{globalMetrics.rejected}</p>
                        <p className="text-xs uppercase tracking-wider text-slate-500">Recusados</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                        <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">
                            {globalMetrics.rate !== null ? `${globalMetrics.rate}%` : '-'}
                        </p>
                        <p className="text-xs uppercase tracking-wider text-slate-500">Taxa Global</p>
                    </div>
                </motion.div>
            )}

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
            >
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar projetos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                </div>
            </motion.div>

            {/* Projects List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
                </div>
            ) : filteredProjects.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                    <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
                        <FolderKanban className="w-8 h-8 text-violet-400" />
                    </div>
                    <p className="text-white font-medium mb-2">Nenhum projeto encontrado</p>
                    <p className="text-sm text-slate-500">Projetos são criados quando clientes fazem cadastro</p>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {filteredProjects.map((project, index) => (
                        <ProjectBlock
                            key={project.project_name}
                            project={project}
                            index={index}
                            onViewCards={setViewCard}
                        />
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
                        {viewCard.image_url && (
                            <div className="w-full h-48">
                                <img src={viewCard.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="p-6">
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
