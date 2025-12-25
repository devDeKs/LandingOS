import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Users, Search, Plus, Eye, MoreHorizontal, Mail, Phone,
    Calendar, FolderKanban, Loader2, RefreshCw, UserPlus, X, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export default function AdminClientsPage() {
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [saving, setSaving] = useState(false);

    // New client form
    const [newClient, setNewClient] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        project_name: '' // The project this client belongs to
    });

    // Fetch all clients with their project info
    const fetchClients = async () => {
        setLoading(true);
        try {
            // Fetch profiles with their first project
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select(`
                    *,
                    projects:projects!client_id (id, name)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Could not fetch profiles:', error.message);
                setClients([]);
            } else {
                // Map profiles to client format
                const mappedClients = (profiles || []).map(p => ({
                    id: p.id,
                    email: p.email || 'N/A',
                    full_name: p.full_name || 'Sem nome',
                    phone: p.phone || '',
                    created_at: p.created_at,
                    project_name: p.project_name || p.projects?.[0]?.name || null,
                    projects_count: p.projects?.length || 0,
                    status: 'active'
                }));

                setClients(mappedClients);
            }
        } catch (err) {
            console.error('Error fetching clients:', err);
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch unique project names for dropdown
    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('project_name')
                .not('project_name', 'is', null);

            if (!error && data) {
                // Get unique project names
                const uniqueProjects = [...new Set(data.map(p => p.project_name).filter(Boolean))];
                setProjects(uniqueProjects);
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
        }
    };

    useEffect(() => {
        fetchClients();
        fetchProjects();
    }, []);

    // Filter clients by search
    const filteredClients = clients.filter(client =>
        client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.project_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Create new client
    const handleCreateClient = async () => {
        if (!newClient.email || !newClient.full_name || !newClient.password || !newClient.project_name) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setSaving(true);
        try {
            // Create user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: newClient.email,
                password: newClient.password,
                options: {
                    data: {
                        full_name: newClient.full_name,
                        phone: newClient.phone,
                        project_name: newClient.project_name
                    }
                }
            });

            if (authError) throw authError;

            // Update profile with project_name
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        full_name: newClient.full_name,
                        phone: newClient.phone,
                        project_name: newClient.project_name
                    })
                    .eq('id', authData.user.id);

                if (profileError) {
                    console.warn('Could not update profile:', profileError.message);
                }
            }

            alert('Cliente criado com sucesso! Um email de confirmação foi enviado.');
            setShowAddModal(false);
            setNewClient({ full_name: '', email: '', phone: '', password: '', project_name: '' });
            fetchClients();
        } catch (err) {
            console.error('Error creating client:', err);
            alert('Erro ao criar cliente: ' + err.message);
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
                        CRM Clientes
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400"
                    >
                        {clients.length} clientes cadastrados
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3"
                >
                    <button
                        onClick={fetchClients}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
                    >
                        <UserPlus className="w-4 h-4" />
                        Novo Cliente
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
                        placeholder="Buscar por nome, email ou projeto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                </div>
            </motion.div>

            {/* Clients Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 overflow-hidden"
            >
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Users className="w-12 h-12 text-slate-600 mb-4" />
                        <p className="text-slate-400 mb-2">Nenhum cliente encontrado</p>
                        <p className="text-sm text-slate-500">Cadastre um novo cliente para começar</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                                    <th className="px-6 py-4 font-medium">Cliente</th>
                                    <th className="px-6 py-4 font-medium">Projeto</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Telefone</th>
                                    <th className="px-6 py-4 font-medium">Cadastro</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.map((client, index) => (
                                    <motion.tr
                                        key={client.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.03 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Neon Avatar */}
                                                <div className="relative">
                                                    <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-sm opacity-50"></div>
                                                    <div className="relative w-10 h-10 rounded-full bg-[#1a1a2e] flex items-center justify-center text-violet-400 text-sm font-bold border-2 border-violet-500/50">
                                                        {client.full_name?.[0]?.toUpperCase() || 'C'}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-white font-medium">{client.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {client.project_name ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                                    <Briefcase className="w-3 h-3" />
                                                    {client.project_name}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <Mail className="w-4 h-4" />
                                                {client.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <Phone className="w-4 h-4" />
                                                {client.phone || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(client.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                                                ${client.status === 'active'
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-amber-500/10 text-amber-400'}`}
                                            >
                                                {client.status === 'active' ? 'Ativo' : 'Pendente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Add Client Modal */}
            {showAddModal && createPortal(
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md max-h-[85vh] flex flex-col bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Novo Cliente</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Project Name (First field - most important) */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Nome do Projeto *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        list="projects-list"
                                        value={newClient.project_name}
                                        onChange={(e) => setNewClient({ ...newClient, project_name: e.target.value })}
                                        placeholder="Ex: Landing Page Odontologia"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                                    />
                                    <datalist id="projects-list">
                                        {projects.map((project, i) => (
                                            <option key={i} value={project} />
                                        ))}
                                    </datalist>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Digite um novo nome ou selecione um existente
                                </p>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    value={newClient.full_name}
                                    onChange={(e) => setNewClient({ ...newClient, full_name: e.target.value })}
                                    placeholder="Nome do cliente"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={newClient.email}
                                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                    placeholder="cliente@email.com"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    value={newClient.phone}
                                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                    placeholder="+55 (11) 99999-9999"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Senha Inicial *
                                </label>
                                <input
                                    type="password"
                                    value={newClient.password}
                                    onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateClient}
                                disabled={saving || !newClient.email || !newClient.full_name || !newClient.password || !newClient.project_name}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Criando...
                                    </>
                                ) : (
                                    'Criar Cliente'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>,
                document.body
            )}
        </div>
    );
}
