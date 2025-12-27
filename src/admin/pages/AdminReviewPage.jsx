import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    AlertTriangle, Search, Eye, RefreshCw, Calendar, User,
    Loader2, XCircle, MessageSquare, Trash2, ArrowUpDown, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export default function AdminReviewPage() {
    const [rejectedProjects, setRejectedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewProject, setViewProject] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Filters
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'

    // Fetch all rejected projects
    const fetchRejectedProjects = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    client:client_id (id, full_name, email)
                `)
                .eq('status', 'archived')
                .not('rejected_at', 'is', null)
                .is('deleted_at', null)
                .order('rejected_at', { ascending: sortOrder === 'asc' });

            if (error) {
                console.warn('Could not fetch rejected projects:', error.message);
                setRejectedProjects([]);
            } else {
                setRejectedProjects(data || []);
            }
        } catch (err) {
            console.error('Error fetching rejected projects:', err);
            setRejectedProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRejectedProjects();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('admin_rejected_projects')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
                fetchRejectedProjects();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sortOrder]);

    // Filter by search and date
    const filteredProjects = rejectedProjects.filter(project => {
        // Search filter
        const matchesSearch =
            project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.rejection_reason?.toLowerCase().includes(searchTerm.toLowerCase());

        // Date filter
        if (dateFilter === 'all') return matchesSearch;

        const rejectedDate = new Date(project.rejected_at);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        const startOfMonth = new Date(startOfToday);
        startOfMonth.setDate(startOfMonth.getDate() - 30);

        switch (dateFilter) {
            case 'today':
                return matchesSearch && rejectedDate >= startOfToday;
            case 'week':
                return matchesSearch && rejectedDate >= startOfWeek;
            case 'month':
                return matchesSearch && rejectedDate >= startOfMonth;
            default:
                return matchesSearch;
        }
    });

    // Delete project (soft delete)
    const handleDelete = async (projectId) => {
        setDeleting(true);
        try {
            const { error } = await supabase
                .from('projects')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', projectId);

            if (error) throw error;

            setDeleteConfirm(null);
            fetchRejectedProjects();
        } catch (err) {
            console.error('Error deleting project:', err);
            alert('Erro ao excluir: ' + err.message);
        } finally {
            setDeleting(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard-page loaded">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <h1 className="text-3xl font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Central de Revisão</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400"
                    >
                        {filteredProjects.length} cards recusados {dateFilter !== 'all' ? `(filtrado de ${rejectedProjects.length})` : ''}
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={fetchRejectedProjects}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
            </div>

            {/* Filters Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap items-center gap-4 mb-6"
            >
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, cliente ou motivo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm text-white focus:outline-none focus:border-red-500/50"
                    >
                        <option value="all" className="bg-[#1a1a2e]">Todas as datas</option>
                        <option value="today" className="bg-[#1a1a2e]">Hoje</option>
                        <option value="week" className="bg-[#1a1a2e]">Últimos 7 dias</option>
                        <option value="month" className="bg-[#1a1a2e]">Últimos 30 dias</option>
                    </select>
                </div>

                {/* Sort Order */}
                <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <ArrowUpDown className="w-4 h-4" />
                    {sortOrder === 'desc' ? 'Mais recentes' : 'Mais antigos'}
                </button>
            </motion.div>

            {/* Rejected Projects List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
            >
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-white/5 border border-white/5">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-emerald-400" />
                        </div>
                        <p className="text-white font-medium mb-2">Nenhum card recusado!</p>
                        <p className="text-sm text-slate-500">Todos os cards foram aprovados pelos clientes</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                                className="p-5 rounded-2xl bg-red-500/5 backdrop-blur-sm border border-red-500/10 hover:border-red-500/30 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Image thumbnail */}
                                    {project.image_url ? (
                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                            <XCircle className="w-8 h-8 text-red-400/50" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                                    <User className="w-3.5 h-3.5" />
                                                    <span>{project.client?.full_name || 'Cliente desconhecido'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                    Recusado
                                                </span>
                                                <button
                                                    onClick={() => setViewProject(project)}
                                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                                    title="Ver detalhes"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(project)}
                                                    className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-slate-400 hover:text-red-400"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Rejection Reason */}
                                        {project.rejection_reason && (
                                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <MessageSquare className="w-3.5 h-3.5 text-red-400" />
                                                    <span className="text-xs font-medium text-red-400">Motivo da recusa</span>
                                                </div>
                                                <p className="text-sm text-slate-300">{project.rejection_reason}</p>
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Recusado em {formatDate(project.rejected_at)}
                                            </span>
                                            {project.category && (
                                                <span className="px-2 py-0.5 rounded-full bg-white/10">
                                                    {project.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {deleteConfirm && createPortal(
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setDeleteConfirm(null)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md p-6 bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <Trash2 className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Excluir Card</h3>
                                <p className="text-sm text-slate-400">Esta ação não pode ser desfeita</p>
                            </div>
                        </div>

                        <p className="text-slate-300 mb-6">
                            Tem certeza que deseja excluir o card <strong className="text-white">"{deleteConfirm.name}"</strong>?
                            Ele será removido permanentemente da central de revisão.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm.id)}
                                disabled={deleting}
                                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {deleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Excluir
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>,
                document.body
            )}

            {/* View Project Modal */}
            {viewProject && createPortal(
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setViewProject(null)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg max-h-[85vh] bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Image */}
                        {viewProject.image_url && (
                            <div className="w-full h-48">
                                <img src={viewProject.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="p-6">
                            {/* Status Badge */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/10 text-red-400">
                                    <XCircle className="w-4 h-4" />
                                    Recusado
                                </span>
                                <span className="text-xs text-slate-500">
                                    {formatDate(viewProject.rejected_at)}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-white mb-3">{viewProject.name}</h2>

                            {/* Category */}
                            {viewProject.category && (
                                <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-400 mb-4">
                                    {viewProject.category}
                                </span>
                            )}

                            {/* Description */}
                            {viewProject.description && (
                                <div className="mb-4">
                                    <p className="text-sm text-slate-300 leading-relaxed">{viewProject.description}</p>
                                </div>
                            )}

                            {/* Client Info */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Cliente</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold">
                                        {viewProject.client?.full_name?.[0]?.toUpperCase() || 'C'}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{viewProject.client?.full_name || 'Sem cliente'}</p>
                                        <p className="text-sm text-slate-500">{viewProject.client?.email || ''}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Rejection Reason */}
                            {viewProject.rejection_reason && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <XCircle className="w-4 h-4 text-red-400" />
                                        <p className="text-sm text-red-400 font-medium">Motivo da Recusa</p>
                                    </div>
                                    <p className="text-sm text-slate-300">{viewProject.rejection_reason}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setViewProject(null)}
                                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                >
                                    Fechar
                                </button>
                                <button
                                    onClick={() => {
                                        setDeleteConfirm(viewProject);
                                        setViewProject(null);
                                    }}
                                    className="py-3 px-6 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>,
                document.body
            )}
        </div>
    );
}
