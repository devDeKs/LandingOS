import React, { useState, useEffect } from 'react';
import {
    FolderKanban, Search, Plus, Eye, MoreHorizontal, User, Calendar,
    Loader2, RefreshCw, CheckCircle2, Clock, AlertCircle, Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const statusConfig = {
    draft: { label: 'Rascunho', color: 'text-slate-400', bg: 'bg-slate-500/10', icon: Clock },
    pending_approval: { label: 'Pendente', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertCircle },
    active: { label: 'Ativo', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
    archived: { label: 'Arquivado', color: 'text-slate-500', bg: 'bg-slate-500/10', icon: Archive },
};

export default function AdminProjectsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', client_id: '', status: 'draft' });
    const [saving, setSaving] = useState(false);

    // Fetch all projects with client info
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    client:client_id (id, full_name, email),
                    owner:owner_id (id, full_name)
                `)
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Could not fetch projects:', error.message);
                setProjects([]);
            } else {
                setProjects(data || []);
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch clients for dropdown
    const fetchClients = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, email')
                .order('full_name', { ascending: true });

            if (!error) {
                setClients(data || []);
            }
        } catch (err) {
            console.error('Error fetching clients:', err);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchClients();
    }, []);

    // Filter projects by search
    const filteredProjects = projects.filter(project =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Create new project
    const handleCreateProject = async () => {
        if (!newProject.name || !newProject.client_id) {
            alert('Preencha o nome e selecione um cliente');
            return;
        }

        setSaving(true);
        try {
            const insertData = {
                name: newProject.name,
                client_id: newProject.client_id,
                owner_id: user?.id,
                created_by: user?.id,
                status: newProject.status
            };

            console.log('Creating project with data:', insertData);
            console.log('User ID:', user?.id);

            const { data, error } = await supabase
                .from('projects')
                .insert(insertData)
                .select();

            console.log('Insert result - data:', data, 'error:', error);

            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error('Projeto não foi criado. Verifique as permissões RLS.');
            }

            alert('Projeto criado com sucesso!');
            setShowNewModal(false);
            setNewProject({ name: '', client_id: '', status: 'draft' });
            fetchProjects();
        } catch (err) {
            console.error('Error creating project:', err);
            alert('Erro ao criar projeto: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="dashboard-page loaded">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                        Projetos
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400"
                    >
                        {projects.length} projetos cadastrados
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3"
                >
                    <button
                        onClick={() => { fetchProjects(); fetchClients(); }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowNewModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Projeto
                    </button>
                </motion.div>
            </div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-6"
            >
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                </div>
            </motion.div>

            {/* Projects Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
            >
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-white/5 border border-white/5">
                        <FolderKanban className="w-12 h-12 text-slate-600 mb-4" />
                        <p className="text-slate-400 mb-2">Nenhum projeto encontrado</p>
                        <p className="text-sm text-slate-500">Crie um novo projeto para começar</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProjects.map((project, index) => {
                            const status = statusConfig[project.status] || statusConfig.draft;
                            const StatusIcon = status.icon;

                            return (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.03 }}
                                    className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-violet-500/30 hover:bg-white/10 transition-all group"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {status.label}
                                        </span>
                                        <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-white mb-3">{project.name}</h3>

                                    {/* Client */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold">
                                            {project.client?.full_name?.[0]?.toUpperCase() || 'C'}
                                        </div>
                                        <div>
                                            <p className="text-sm text-white">{project.client?.full_name || 'Sem cliente'}</p>
                                            <p className="text-xs text-slate-500">{project.client?.email || ''}</p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(project.created_at)}
                                        </div>
                                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* New Project Modal */}
            <AnimatePresence>
                {showNewModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowNewModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md p-6 rounded-2xl bg-[#1a1a2e] border border-white/10"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">Novo Projeto</h3>

                            <div className="space-y-4">
                                {/* Project Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Projeto</label>
                                    <input
                                        type="text"
                                        value={newProject.name}
                                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                        placeholder="Landing Page - Empresa X"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                                    />
                                </div>

                                {/* Client Select */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Cliente</label>
                                    <select
                                        value={newProject.client_id}
                                        onChange={(e) => setNewProject({ ...newProject, client_id: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50"
                                    >
                                        <option value="" className="bg-[#1a1a2e]">Selecione um cliente</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id} className="bg-[#1a1a2e]">
                                                {client.full_name || client.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Status Inicial</label>
                                    <select
                                        value={newProject.status}
                                        onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50"
                                    >
                                        <option value="draft" className="bg-[#1a1a2e]">Rascunho</option>
                                        <option value="pending_approval" className="bg-[#1a1a2e]">Pendente Aprovação</option>
                                        <option value="active" className="bg-[#1a1a2e]">Ativo</option>
                                    </select>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowNewModal(false)}
                                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateProject}
                                    disabled={saving || !newProject.name || !newProject.client_id}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Criando...
                                        </>
                                    ) : (
                                        'Criar Projeto'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
