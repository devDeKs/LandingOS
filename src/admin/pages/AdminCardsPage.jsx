import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Briefcase, Search, Plus, Eye, User, Calendar,
    Loader2, RefreshCw, CheckCircle2, Clock, AlertCircle,
    Upload, X, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const statusConfig = {
    draft: { label: 'Rascunho', color: 'text-slate-400', bg: 'bg-slate-500/10', icon: Clock },
    pending_approval: { label: 'Pendente', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertCircle },
    active: { label: 'Aprovado', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
    archived: { label: 'Recusado', color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
};

// Portal Modal Component - Renders at document.body level
const PortalModal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && isOpen && onClose();
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative w-full ${maxWidth} max-h-[85vh] flex flex-col bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </motion.div>
        </motion.div>,
        document.body
    );
};

// Searchable Client Dropdown Component
const ClientSearchDropdown = ({ clients, selectedId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const filteredClients = clients.filter(c =>
        c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.project_name?.toLowerCase().includes(search.toLowerCase())
    );

    const selectedClient = clients.find(c => c.id === selectedId);
    const getDisplayName = (c) => c.project_name ? `${c.full_name || c.email} - ${c.project_name}` : (c.full_name || c.email);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-left flex items-center justify-between"
            >
                <span className={selectedClient ? 'text-white' : 'text-slate-500'}>
                    {selectedClient ? getDisplayName(selectedClient) : 'Selecione um cliente'}
                </span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-[100] w-full mt-2 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-xl overflow-hidden"
                    >
                        <div className="p-2 border-b border-white/5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar cliente..."
                                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 text-sm text-white placeholder-slate-500 focus:outline-none"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            {filteredClients.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-slate-500 text-center">Nenhum cliente</p>
                            ) : (
                                filteredClients.map(client => (
                                    <button
                                        key={client.id}
                                        type="button"
                                        onClick={() => { onSelect(client.id); setIsOpen(false); setSearch(''); }}
                                        className={`w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 ${client.id === selectedId ? 'bg-violet-500/10' : ''}`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold">
                                            {client.full_name?.[0]?.toUpperCase() || 'C'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate">
                                                {client.full_name || 'Sem nome'}
                                                {client.project_name && <span className="text-violet-400"> - {client.project_name}</span>}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">{client.email}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function AdminCardsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', category: 'Geral', image_url: '', client_id: '', status: 'pending_approval' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [viewProject, setViewProject] = useState(null);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('projects')
                .select('*, client:client_id (id, full_name, email, project_name)')
                .is('deleted_at', null)
                .order('created_at', { ascending: false });
            setProjects(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const { data } = await supabase.from('profiles').select('id, full_name, email, project_name').order('full_name');
            setClients(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchProjects(); fetchClients(); }, []);

    const filteredProjects = projects.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return alert('Selecione uma imagem');
        if (file.size > 5 * 1024 * 1024) return alert('Máximo 5MB');
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result);
        reader.readAsDataURL(file);
    };

    const uploadImage = async () => {
        if (!imageFile) return null;
        setUploading(true);
        try {
            const ext = imageFile.name.split('.').pop();
            const path = `projects/${Date.now()}.${ext}`;
            const { error } = await supabase.storage.from('media').upload(path, imageFile);
            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
            return publicUrl;
        } catch (err) {
            alert('Erro no upload: ' + err.message);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleCreateProject = async () => {
        if (!newProject.name || !newProject.client_id) return alert('Preencha nome e cliente');
        setSaving(true);
        try {
            let imageUrl = newProject.image_url;
            if (imageFile) imageUrl = await uploadImage();
            const { error } = await supabase.from('projects').insert({
                name: newProject.name,
                description: newProject.description,
                category: newProject.category,
                image_url: imageUrl,
                client_id: newProject.client_id,
                owner_id: user?.id,
                created_by: user?.id,
                status: newProject.status
            });
            if (error) throw error;
            setShowNewModal(false);
            setNewProject({ name: '', description: '', category: 'Geral', image_url: '', client_id: '', status: 'pending_approval' });
            setImageFile(null);
            setImagePreview(null);
            fetchProjects();
        } catch (err) {
            alert('Erro: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Cards</h1>
                        <p className="text-slate-400 text-sm">{projects.length} cards</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { fetchProjects(); fetchClients(); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => setShowNewModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-sm font-medium shadow-lg shadow-violet-500/25">
                        <Plus className="w-4 h-4" /> Novo Card
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-violet-400 animate-spin" /></div>
            ) : filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center py-20 rounded-2xl bg-white/5 border border-white/5">
                    <Briefcase className="w-12 h-12 text-slate-600 mb-4" />
                    <p className="text-slate-400">Nenhum card encontrado</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => {
                        const status = statusConfig[project.status] || statusConfig.draft;
                        const StatusIcon = status.icon;
                        const isRejected = project.status === 'archived' && project.rejected_at;

                        return (
                            <motion.div
                                key={project.id}
                                whileHover={{ y: -4 }}
                                className={`group relative p-5 rounded-2xl backdrop-blur-sm border transition-all
                                    ${isRejected ? 'bg-red-500/5 border-red-500/10' : 'bg-white/5 border-white/5 hover:border-violet-500/30'}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                        <StatusIcon className="w-3 h-3" /> {status.label}
                                    </span>
                                    <button onClick={() => setViewProject(project)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>

                                {project.image_url && (
                                    <div className="w-full h-24 rounded-lg overflow-hidden mb-3">
                                        <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold">
                                        {project.client?.full_name?.[0]?.toUpperCase() || 'C'}
                                    </div>
                                    <div>
                                        <p className="text-sm text-white">{project.client?.full_name || 'Sem cliente'}</p>
                                        <p className="text-xs text-slate-500">{project.client?.project_name || ''}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-3 border-t border-white/5">
                                    <Calendar className="w-3.5 h-3.5" /> {formatDate(project.created_at)}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* New Card Modal */}
            <PortalModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Novo Card">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Título *</label>
                        <input
                            type="text"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            placeholder="Ex: Homepage v2"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                        <textarea
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            placeholder="Descreva..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Imagem</label>
                        {imagePreview ? (
                            <div className="relative w-full h-32 rounded-xl overflow-hidden">
                                <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                                <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-white/10 hover:border-violet-500/50 cursor-pointer bg-white/5">
                                <Upload className="w-6 h-6 text-slate-500 mb-1" />
                                <span className="text-sm text-slate-500">Upload (max 5MB)</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                            </label>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
                        <select
                            value={newProject.category}
                            onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        >
                            <option value="Geral" className="bg-[#1a1a2e]">Geral</option>
                            <option value="Landing Page" className="bg-[#1a1a2e]">Landing Page</option>
                            <option value="E-commerce" className="bg-[#1a1a2e]">E-commerce</option>
                            <option value="Dashboard" className="bg-[#1a1a2e]">Dashboard</option>
                            <option value="Mobile App" className="bg-[#1a1a2e]">Mobile App</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Cliente *</label>
                        <ClientSearchDropdown clients={clients} selectedId={newProject.client_id} onSelect={(id) => setNewProject({ ...newProject, client_id: id })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                        <select
                            value={newProject.status}
                            onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        >
                            <option value="draft" className="bg-[#1a1a2e]">Rascunho</option>
                            <option value="pending_approval" className="bg-[#1a1a2e]">Enviar para Aprovação</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/5">
                        <button onClick={() => setShowNewModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium">
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreateProject}
                            disabled={saving || uploading || !newProject.name || !newProject.client_id}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {(saving || uploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                            {uploading ? 'Enviando...' : saving ? 'Criando...' : 'Criar Card'}
                        </button>
                    </div>
                </div>
            </PortalModal>

            {/* View Modal */}
            <PortalModal isOpen={!!viewProject} onClose={() => setViewProject(null)} title={viewProject?.name || ''}>
                {viewProject && (
                    <div className="space-y-4">
                        {viewProject.image_url && (
                            <div className="w-full h-40 rounded-xl overflow-hidden">
                                <img src={viewProject.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {(() => {
                            const status = statusConfig[viewProject.status] || statusConfig.draft;
                            const StatusIcon = status.icon;
                            return (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                                    <StatusIcon className="w-4 h-4" /> {status.label}
                                </span>
                            );
                        })()}

                        {viewProject.description && <p className="text-sm text-slate-300">{viewProject.description}</p>}

                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-xs text-slate-500 uppercase mb-2">Cliente</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold">
                                    {viewProject.client?.full_name?.[0]?.toUpperCase() || 'C'}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{viewProject.client?.full_name || 'Sem cliente'}</p>
                                    <p className="text-sm text-slate-500">{viewProject.client?.email}</p>
                                </div>
                            </div>
                        </div>

                        {viewProject.rejection_reason && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                <p className="text-sm text-red-400 font-medium mb-1">Motivo da Recusa</p>
                                <p className="text-sm text-slate-300">{viewProject.rejection_reason}</p>
                            </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Criado em {formatDate(viewProject.created_at)}</span>
                        </div>

                        <button onClick={() => setViewProject(null)} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium">
                            Fechar
                        </button>
                    </div>
                )}
            </PortalModal>
        </div>
    );
}
