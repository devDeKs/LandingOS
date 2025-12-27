import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
    Users, FolderKanban, DollarSign, TrendingUp,
    ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
    AlertCircle, Plus, Eye, MoreHorizontal, RefreshCw,
    Briefcase, FileSpreadsheet, X, Loader2, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// Portal Modal Component
const PortalModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg bg-[#0f0f17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default function AdminHome() {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    // Real data states
    const [stats, setStats] = useState({
        totalClients: 0,
        totalProjects: 0,
        approvalRate: 0,
        pendingCards: 0,
        approvedCards: 0,
        rejectedCards: 0,
        clientsThisMonth: 0,
        cardsThisMonth: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [recentClients, setRecentClients] = useState([]);

    // Modal states
    const [showNewClientModal, setShowNewClientModal] = useState(false);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [newClientForm, setNewClientForm] = useState({ full_name: '', email: '', phone: '', project_name: '' });
    const [newProjectForm, setNewProjectForm] = useState({ name: '', description: '', category: '', client_id: '' });
    const [clients, setClients] = useState([]);
    const [savingClient, setSavingClient] = useState(false);
    const [savingProject, setSavingProject] = useState(false);

    // Fetch all dashboard data
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Get current month boundaries
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

            // Fetch profiles (clients)
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, full_name, email, phone, project_name, created_at, role:roles(name)')
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (profilesError) throw profilesError;

            // Filter out admins to get only clients
            const allClients = (profiles || []).filter(p =>
                !p.role || (p.role.name !== 'admin' && p.role.name !== 'super_admin')
            );

            // Clients this month
            const clientsThisMonth = allClients.filter(c =>
                c.created_at >= monthStart && c.created_at <= monthEnd
            ).length;

            // Fetch cards/projects
            const { data: cards, error: cardsError } = await supabase
                .from('projects')
                .select('id, name, status, created_at, updated_at, client_id, category')
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (cardsError) throw cardsError;

            // Calculate stats
            const approvedCards = (cards || []).filter(c => c.status === 'active').length;
            const pendingCards = (cards || []).filter(c => c.status === 'pending_approval').length;
            const rejectedCards = (cards || []).filter(c => c.status === 'archived').length;
            const totalCards = cards?.length || 0;
            const approvalRate = totalCards > 0 ? Math.round((approvedCards / totalCards) * 100) : 0;
            const cardsThisMonth = (cards || []).filter(c =>
                c.created_at >= monthStart && c.created_at <= monthEnd
            ).length;

            // Count unique projects
            const uniqueProjects = [...new Set(allClients.map(c => c.project_name).filter(Boolean))];

            setStats({
                totalClients: allClients.length,
                totalProjects: uniqueProjects.length,
                approvalRate,
                pendingCards,
                approvedCards,
                rejectedCards,
                clientsThisMonth,
                cardsThisMonth
            });

            // Set recent clients (last 5)
            setRecentClients(allClients.slice(0, 5).map(c => ({
                id: c.id,
                name: c.full_name || 'Sem nome',
                email: c.email,
                project: c.project_name || 'Sem projeto',
                projects: (cards || []).filter(card => card.client_id === c.id).length,
                status: c.created_at >= monthStart ? 'new' : 'active'
            })));

            // Build recent activity from real data
            const activityItems = [];

            // Recent cards
            (cards || []).slice(0, 3).forEach(card => {
                const client = allClients.find(c => c.id === card.client_id);
                if (card.status === 'active') {
                    activityItems.push({
                        id: `card-${card.id}`,
                        type: 'approval',
                        message: `Card "${card.name}" aprovado`,
                        client: client?.full_name || 'Cliente',
                        time: formatTimeAgo(card.updated_at),
                        icon: CheckCircle2,
                        color: 'text-green-400',
                        bg: 'bg-green-500/10'
                    });
                } else if (card.status === 'pending_approval') {
                    activityItems.push({
                        id: `card-${card.id}`,
                        type: 'pending',
                        message: `Card "${card.name}" aguardando aprovação`,
                        client: client?.full_name || 'Cliente',
                        time: formatTimeAgo(card.created_at),
                        icon: Clock,
                        color: 'text-amber-400',
                        bg: 'bg-amber-500/10'
                    });
                }
            });

            // Recent clients
            allClients.slice(0, 2).forEach(client => {
                activityItems.push({
                    id: `client-${client.id}`,
                    type: 'client',
                    message: `Novo cliente cadastrado`,
                    client: client.full_name || 'Cliente',
                    time: formatTimeAgo(client.created_at),
                    icon: Users,
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/10'
                });
            });

            // Sort by date and take top 5
            setRecentActivity(activityItems.slice(0, 5));

            // Fetch all clients for dropdowns
            setClients(allClients);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
            setIsLoaded(true);
        }
    };

    // Format time ago
    const formatTimeAgo = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `Há ${diffMins} min`;
        if (diffHours < 24) return `Há ${diffHours}h`;
        if (diffDays < 7) return `Há ${diffDays}d`;
        return date.toLocaleDateString('pt-BR');
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Create new client
    const handleCreateClient = async () => {
        if (!newClientForm.full_name || !newClientForm.email) {
            alert('Preencha nome e email');
            return;
        }
        setSavingClient(true);
        try {
            // Create auth user first (if needed) or just profile
            const { data, error } = await supabase
                .from('profiles')
                .insert([{
                    full_name: newClientForm.full_name,
                    email: newClientForm.email,
                    phone: newClientForm.phone || null,
                    project_name: newClientForm.project_name || null
                }])
                .select()
                .single();

            if (error) throw error;

            setShowNewClientModal(false);
            setNewClientForm({ full_name: '', email: '', phone: '', project_name: '' });
            fetchDashboardData();
            alert('Cliente criado com sucesso!');
        } catch (err) {
            console.error('Error creating client:', err);
            alert('Erro ao criar cliente: ' + err.message);
        } finally {
            setSavingClient(false);
        }
    };

    // Create new project/card
    const handleCreateProject = async () => {
        if (!newProjectForm.name || !newProjectForm.client_id) {
            alert('Preencha nome e selecione um cliente');
            return;
        }
        setSavingProject(true);
        try {
            const { error } = await supabase
                .from('projects')
                .insert([{
                    name: newProjectForm.name,
                    description: newProjectForm.description || null,
                    category: newProjectForm.category || 'general',
                    client_id: newProjectForm.client_id,
                    status: 'draft'
                }]);

            if (error) throw error;

            setShowNewProjectModal(false);
            setNewProjectForm({ name: '', description: '', category: '', client_id: '' });
            fetchDashboardData();
            alert('Projeto criado com sucesso!');
        } catch (err) {
            console.error('Error creating project:', err);
            alert('Erro ao criar projeto: ' + err.message);
        } finally {
            setSavingProject(false);
        }
    };

    // Stats cards config
    const statsCards = [
        {
            label: 'Total de Clientes',
            value: stats.totalClients,
            change: stats.clientsThisMonth > 0 ? `+${stats.clientsThisMonth} este mês` : 'Este mês',
            positive: stats.clientsThisMonth > 0,
            icon: Users,
            color: 'from-violet-500 to-purple-600'
        },
        {
            label: 'Projetos Ativos',
            value: stats.totalProjects,
            change: `${stats.cardsThisMonth} cards este mês`,
            positive: stats.cardsThisMonth > 0,
            icon: FolderKanban,
            color: 'from-fuchsia-500 to-pink-600'
        },
        {
            label: 'Receita Mensal',
            value: 'R$ --',
            change: 'Conectar Stripe',
            positive: true,
            icon: DollarSign,
            color: 'from-emerald-500 to-teal-600'
        },
        {
            label: 'Taxa de Aprovação',
            value: `${stats.approvalRate}%`,
            change: `${stats.approvedCards}/${stats.approvedCards + stats.rejectedCards} aprovados`,
            positive: stats.approvalRate >= 70,
            icon: TrendingUp,
            color: 'from-amber-500 to-orange-600'
        },
    ];

    return (
        <div className={`dashboard-page ${isLoaded ? 'loaded' : ''}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-violet-400" />
                        </div>
                        <h1 className="text-3xl font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Painel Administrativo</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400"
                    >
                        Visão geral de todos os clientes e projetos
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white disabled:opacity-50"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.1] transition-all group"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg opacity-80`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stat.value}
                        </p>
                        <p className="text-sm text-slate-400 mb-3">{stat.label}</p>
                        <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            <span>{stat.change}</span>
                        </div>
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                    </motion.div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-1 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Atividade Recente</h2>
                        <span className="text-xs text-slate-500">{recentActivity.length} itens</span>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                            </div>
                        ) : recentActivity.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Nenhuma atividade recente</p>
                            </div>
                        ) : (
                            recentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
                                >
                                    <div className={`p-2 rounded-lg ${activity.bg}`}>
                                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{activity.message}</p>
                                        <p className="text-xs text-slate-500">{activity.client}</p>
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Recent Clients */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Clientes Recentes</h2>
                        <button
                            onClick={() => setShowNewClientModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#0A0A0B] text-sm font-medium hover:bg-slate-100 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Novo Cliente
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                                    <th className="pb-4 font-medium">Cliente</th>
                                    <th className="pb-4 font-medium">Email</th>
                                    <th className="pb-4 font-medium">Projeto</th>
                                    <th className="pb-4 font-medium">Cards</th>
                                    <th className="pb-4 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-violet-400 mx-auto" />
                                        </td>
                                    </tr>
                                ) : recentClients.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500">
                                            Nenhum cliente cadastrado
                                        </td>
                                    </tr>
                                ) : (
                                    recentClients.map((client, index) => (
                                        <motion.tr
                                            key={client.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + index * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600/70 to-fuchsia-600/70 flex items-center justify-center text-white text-sm font-bold">
                                                        {client.name[0]}
                                                    </div>
                                                    <span className="text-sm text-white font-medium">{client.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-sm text-slate-400">{client.email}</td>
                                            <td className="py-4 text-sm text-slate-400">{client.project}</td>
                                            <td className="py-4 text-sm text-white">{client.projects}</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate('/admin/clientes')}
                                                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
            >
                <h3 className="text-lg font-bold text-white mb-4">Ações Rápidas</h3>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setShowNewClientModal(true)}
                        className="px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-sm text-white transition-colors border border-white/[0.06] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Cliente
                    </button>
                    <button
                        onClick={() => setShowNewProjectModal(true)}
                        className="px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-sm text-white transition-colors border border-white/[0.06] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Projeto
                    </button>
                    <button
                        onClick={() => navigate('/admin/configuracoes')}
                        className="px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-sm text-white transition-colors border border-white/[0.06] flex items-center gap-2"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Gerar Relatório
                    </button>
                </div>
            </motion.div>

            {/* New Client Modal */}
            <PortalModal isOpen={showNewClientModal} onClose={() => setShowNewClientModal(false)}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Novo Cliente</h2>
                                <p className="text-slate-400 text-sm">Cadastrar novo cliente</p>
                            </div>
                        </div>
                        <button onClick={() => setShowNewClientModal(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Nome Completo *</label>
                            <input
                                type="text"
                                value={newClientForm.full_name}
                                onChange={(e) => setNewClientForm({ ...newClientForm, full_name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                                placeholder="João da Silva"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Email *</label>
                            <input
                                type="email"
                                value={newClientForm.email}
                                onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                                placeholder="joao@empresa.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Telefone</label>
                            <input
                                type="tel"
                                value={newClientForm.phone}
                                onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Projeto</label>
                            <input
                                type="text"
                                value={newClientForm.project_name}
                                onChange={(e) => setNewClientForm({ ...newClientForm, project_name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                                placeholder="Nome do projeto"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setShowNewClientModal(false)}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreateClient}
                            disabled={savingClient || !newClientForm.full_name || !newClientForm.email}
                            className="flex-1 py-3 rounded-xl bg-white text-[#0A0A0B] font-medium hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {savingClient ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            {savingClient ? 'Salvando...' : 'Criar Cliente'}
                        </button>
                    </div>
                </div>
            </PortalModal>

            {/* New Project Modal */}
            <PortalModal isOpen={showNewProjectModal} onClose={() => setShowNewProjectModal(false)}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                <FolderKanban className="w-5 h-5 text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Novo Projeto</h2>
                                <p className="text-slate-400 text-sm">Criar novo card/projeto</p>
                            </div>
                        </div>
                        <button onClick={() => setShowNewProjectModal(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Cliente *</label>
                            <select
                                value={newProjectForm.client_id}
                                onChange={(e) => setNewProjectForm({ ...newProjectForm, client_id: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50"
                            >
                                <option value="">Selecione um cliente</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id} className="bg-[#0f0f17]">{c.full_name} - {c.email}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Nome do Projeto *</label>
                            <input
                                type="text"
                                value={newProjectForm.name}
                                onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                                placeholder="Nome do projeto"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Descrição</label>
                            <textarea
                                value={newProjectForm.description}
                                onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 resize-none"
                                rows={3}
                                placeholder="Breve descrição do projeto"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Categoria</label>
                            <select
                                value={newProjectForm.category}
                                onChange={(e) => setNewProjectForm({ ...newProjectForm, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50"
                            >
                                <option value="" className="bg-[#0f0f17]">Selecione uma categoria</option>
                                <option value="landing" className="bg-[#0f0f17]">Landing Page</option>
                                <option value="website" className="bg-[#0f0f17]">Website</option>
                                <option value="ecommerce" className="bg-[#0f0f17]">E-commerce</option>
                                <option value="app" className="bg-[#0f0f17]">Aplicativo</option>
                                <option value="other" className="bg-[#0f0f17]">Outro</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setShowNewProjectModal(false)}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreateProject}
                            disabled={savingProject || !newProjectForm.name || !newProjectForm.client_id}
                            className="flex-1 py-3 rounded-xl bg-white text-[#0A0A0B] font-medium hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {savingProject ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            {savingProject ? 'Salvando...' : 'Criar Projeto'}
                        </button>
                    </div>
                </div>
            </PortalModal>
        </div>
    );
}
