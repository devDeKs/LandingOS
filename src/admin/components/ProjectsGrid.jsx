import React, { useState, useEffect } from 'react';
import {
    Briefcase, Search, Plus, RefreshCw, Loader2, CheckCircle2,
    XCircle, TrendingUp, User, Mail, Eye, MoreHorizontal, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// Metric Card Component
const MetricCard = ({ label, value, icon: Icon, color, glowColor }) => (
    <div className={`relative p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden group`}>
        {/* Glow Effect */}
        <div className={`absolute inset-0 ${glowColor} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}></div>

        <div className="relative flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
            </div>
        </div>
    </div>
);

// Project Card Component
const ProjectCard = ({ project, index, onView }) => {
    const approvedCount = project.is_approved ? 1 : 0;
    const rejectedCount = project.is_rejected ? 1 : 0;
    const approvalRate = approvedCount + rejectedCount > 0
        ? Math.round((approvedCount / (approvedCount + rejectedCount)) * 100)
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.25, 0.1, 0.25, 1]
            }}
            whileHover={{
                y: -4,
                transition: { duration: 0.2 }
            }}
            className="group relative"
        >
            {/* Neon Glow Border on Hover */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/50 group-hover:via-fuchsia-500/50 group-hover:to-violet-500/50 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

            {/* Card Container */}
            <div className="relative p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-violet-500/30 group-hover:bg-white/[0.07] transition-all duration-300 overflow-hidden">

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Header */}
                <div className="relative flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2 mb-2">
                            {project.is_approved && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Aprovado
                                </span>
                            )}
                            {project.is_rejected && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                    <XCircle className="w-3 h-3" />
                                    Recusado
                                </span>
                            )}
                            {project.is_pending && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <Sparkles className="w-3 h-3" />
                                    Pendente
                                </span>
                            )}
                        </div>

                        {/* Project Name */}
                        <h3 className="text-lg font-semibold text-white truncate mb-1 font-['Inter']">
                            {project.project_name}
                        </h3>

                        {/* Category */}
                        {project.project_category && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                {project.project_category}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => onView?.(project)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>

                {/* Image Preview */}
                {project.project_image && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4 bg-white/5">
                        <img
                            src={project.project_image}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                )}

                {/* Client Info */}
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/25">
                            {project.client_name?.[0]?.toUpperCase() || 'C'}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate flex items-center gap-1.5">
                            <User className="w-3 h-3 text-slate-500" />
                            {project.client_name || 'Cliente'}
                        </p>
                        <p className="text-xs text-slate-500 truncate flex items-center gap-1.5">
                            <Mail className="w-3 h-3" />
                            {project.client_email || '-'}
                        </p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2">
                    <MetricCard
                        label="Aprovado"
                        value={approvedCount}
                        icon={CheckCircle2}
                        color="bg-emerald-500/20"
                        glowColor="bg-emerald-500/20"
                    />
                    <MetricCard
                        label="Recusado"
                        value={rejectedCount}
                        icon={XCircle}
                        color="bg-red-500/20"
                        glowColor="bg-red-500/20"
                    />
                    <MetricCard
                        label="Taxa"
                        value={approvalRate !== null ? `${approvalRate}%` : '-'}
                        icon={TrendingUp}
                        color="bg-violet-500/20"
                        glowColor="bg-violet-500/20"
                    />
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                    <span>
                        Criado em {new Date(project.project_created_at).toLocaleDateString('pt-BR')}
                    </span>
                    {project.client_project_group && (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                            {project.client_project_group}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Main Component
export default function ProjectsGrid() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [metrics, setMetrics] = useState(null);

    // Fetch projects from admin_project_summary view
    const fetchProjects = async () => {
        setLoading(true);
        try {
            // Try to fetch from the view first
            let { data, error } = await supabase
                .from('admin_project_summary')
                .select('*')
                .order('project_created_at', { ascending: false });

            // Fallback to direct query if view doesn't exist
            if (error) {
                console.warn('View not available, using fallback query');
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('projects')
                    .select(`
                        id,
                        name,
                        description,
                        category,
                        image_url,
                        status,
                        created_at,
                        client_accepted_at,
                        rejected_at,
                        rejection_reason,
                        client:client_id (id, full_name, email, project_name)
                    `)
                    .is('deleted_at', null)
                    .order('created_at', { ascending: false });

                if (!fallbackError) {
                    // Transform to match view structure
                    data = (fallbackData || []).map(p => ({
                        project_id: p.id,
                        project_name: p.name,
                        project_description: p.description,
                        project_category: p.category,
                        project_image: p.image_url,
                        project_status: p.status,
                        project_created_at: p.created_at,
                        client_id: p.client?.id,
                        client_name: p.client?.full_name,
                        client_email: p.client?.email,
                        client_project_group: p.client?.project_name,
                        approved_at: p.client_accepted_at,
                        rejected_at: p.rejected_at,
                        rejection_reason: p.rejection_reason,
                        is_approved: p.status === 'active' && p.client_accepted_at,
                        is_rejected: p.status === 'archived' && p.rejected_at,
                        is_pending: p.status === 'pending_approval'
                    }));
                }
            }

            setProjects(data || []);

            // Calculate metrics
            const approved = (data || []).filter(p => p.is_approved).length;
            const rejected = (data || []).filter(p => p.is_rejected).length;
            const pending = (data || []).filter(p => p.is_pending).length;
            const total = approved + rejected;

            setMetrics({
                total: (data || []).length,
                approved,
                rejected,
                pending,
                rate: total > 0 ? Math.round((approved / total) * 100) : null
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
        p.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.project_category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white font-['Inter']">Projetos</h1>
                            <p className="text-slate-400 text-sm">{projects.length} cards criados</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3"
                >
                    <button
                        onClick={fetchProjects}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all text-slate-400 hover:text-white"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
                        <Plus className="w-5 h-5" />
                        Novo Card
                    </button>
                </motion.div>
            </div>

            {/* Global Metrics */}
            {metrics && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <div className="relative p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group hover:border-violet-500/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <p className="text-3xl font-bold text-white mb-1">{metrics.total}</p>
                            <p className="text-xs uppercase tracking-wider text-slate-500">Total de Cards</p>
                        </div>
                    </div>
                    <div className="relative p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <p className="text-3xl font-bold text-emerald-400 mb-1">{metrics.approved}</p>
                            <p className="text-xs uppercase tracking-wider text-slate-500">Aprovados</p>
                        </div>
                    </div>
                    <div className="relative p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group hover:border-red-500/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <p className="text-3xl font-bold text-red-400 mb-1">{metrics.rejected}</p>
                            <p className="text-xs uppercase tracking-wider text-slate-500">Recusados</p>
                        </div>
                    </div>
                    <div className="relative p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group hover:border-violet-500/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">
                                {metrics.rate !== null ? `${metrics.rate}%` : '-'}
                            </p>
                            <p className="text-xs uppercase tracking-wider text-slate-500">Taxa de Aprovação</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar projetos, clientes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                </div>
            </motion.div>

            {/* Projects Grid */}
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
                        <Briefcase className="w-8 h-8 text-violet-400" />
                    </div>
                    <p className="text-white font-medium mb-2">Nenhum projeto encontrado</p>
                    <p className="text-sm text-slate-500">Crie um novo card para começar</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {filteredProjects.map((project, index) => (
                        <ProjectCard
                            key={project.project_id}
                            project={project}
                            index={index}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}
