import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Settings, User, Palette, Bell, Shield, Database,
    Moon, Sun, Save, ChevronRight, Lock, LogOut, Loader2,
    X, Trash2, Download, RefreshCw, Users, FolderKanban,
    Briefcase, HardDrive, Clock, CheckCircle2, FileSpreadsheet,
    Calendar, Filter, TrendingUp, AlertTriangle, FileJson, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useAdminNotifications } from '../../context/AdminNotificationContext';
import { supabase } from '../../lib/supabase';

// Settings sections config
const settingsSections = [
    { id: 'profile', icon: User, label: 'Perfil' },
    { id: 'appearance', icon: Palette, label: 'Aparência' },
    { id: 'notifications', icon: Bell, label: 'Notificações' },
    { id: 'security', icon: Shield, label: 'Segurança' },
    { id: 'system', icon: Database, label: 'Sistema' },
];

// Portal Modal Component
const PortalModal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
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
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative w-full ${maxWidth} bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </motion.div>
        </motion.div>,
        document.body
    );
};

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${enabled ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' : 'bg-white/10'
            }`}
    >
        <motion.div
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
            animate={{ left: enabled ? '28px' : '4px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
    </button>
);

// Settings Item Component
const SettingsItem = ({ icon: Icon, label, description, onClick, danger = false, rightContent }) => (
    <motion.button
        whileHover={{ x: 4 }}
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${danger
            ? 'bg-red-500/5 hover:bg-red-500/10 border border-red-500/10'
            : 'bg-white/5 hover:bg-white/10 border border-white/5'
            }`}
    >
        <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${danger ? 'bg-red-500/10' : 'bg-violet-500/10'
                }`}>
                <Icon className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-violet-400'}`} />
            </div>
            <div className="text-left">
                <p className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-white'}`}>{label}</p>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
        </div>
        {rightContent || <ChevronRight className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-slate-500'}`} />}
    </motion.button>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
);

export default function AdminSettingsPage() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, userName, signOut, refreshUser } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [isMobile, setIsMobile] = useState(false);

    // Stats
    const [stats, setStats] = useState({ projects: 0, clients: 0, admins: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    // Admin Notifications from context
    const { settings: notificationSettings, toggleSetting } = useAdminNotifications();

    // Password modal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [savingPassword, setSavingPassword] = useState(false);

    // Export modal
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportConfig, setExportConfig] = useState({
        dataType: 'clients',
        format: 'json',
        dateFrom: '',
        dateTo: '',
        status: 'all',
        includeDetails: true
    });
    const [exporting, setExporting] = useState(false);

    // Check mobile
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            setLoadingStats(true);
            try {
                const [projectsRes, profilesRes] = await Promise.all([
                    supabase.from('projects').select('id', { count: 'exact', head: true }).is('deleted_at', null),
                    supabase.from('profiles').select('*, role:roles(name)').is('deleted_at', null)
                ]);

                const profiles = profilesRes.data || [];
                const admins = profiles.filter(p => p.role?.name === 'admin' || p.role?.name === 'super_admin');
                const clients = profiles.filter(p => !p.role || (p.role.name !== 'admin' && p.role.name !== 'super_admin'));

                setStats({
                    projects: projectsRes.count || 0,
                    clients: clients.length,
                    admins: admins.length
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    const firstLetter = userName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A';

    const handleChangePassword = async () => {
        if (passwordForm.new !== passwordForm.confirm) {
            alert('As senhas não coincidem');
            return;
        }
        if (passwordForm.new.length < 6) {
            alert('A nova senha deve ter no mínimo 6 caracteres');
            return;
        }

        setSavingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: passwordForm.new });
            if (error) throw error;
            alert('Senha alterada com sucesso!');
            setShowPasswordModal(false);
            setPasswordForm({ current: '', new: '', confirm: '' });
        } catch (err) {
            alert('Erro ao alterar senha: ' + err.message);
        } finally {
            setSavingPassword(false);
        }
    };

    // Export data types configuration
    const exportDataTypes = [
        { id: 'clients', label: 'Lista de Clientes', description: 'Dados completos de todos os clientes', icon: Users },
        { id: 'cards_approved', label: 'Cards Aprovados', description: 'Cards aprovados por período', icon: CheckCircle2 },
        { id: 'cards_rejected', label: 'Cards Recusados', description: 'Cards recusados com motivos', icon: AlertTriangle },
        { id: 'cards_all', label: 'Todos os Cards', description: 'Exportar todos os cards', icon: Briefcase },
        { id: 'projects', label: 'Resumo de Projetos', description: 'Projetos com métricas', icon: FolderKanban },
        { id: 'team', label: 'Equipe Administrativa', description: 'Dados dos administradores', icon: Shield },
        { id: 'analytics', label: 'Relatório Analítico', description: 'Métricas e estatísticas gerais', icon: TrendingUp },
    ];

    // Handle export
    const handleExportData = async () => {
        setExporting(true);
        try {
            let data = {};
            let filename = '';
            const { dataType, dateFrom, dateTo, status, includeDetails, format } = exportConfig;

            // Build date filter
            const buildDateFilter = (query, dateField) => {
                if (dateFrom) query = query.gte(dateField, dateFrom);
                if (dateTo) query = query.lte(dateField, dateTo + 'T23:59:59');
                return query;
            };

            switch (dataType) {
                case 'clients': {
                    let query = supabase
                        .from('profiles')
                        .select('id, full_name, email, phone, project_name, created_at, updated_at')
                        .is('deleted_at', null);

                    query = buildDateFilter(query, 'created_at');

                    const { data: clients, error } = await query.order('created_at', { ascending: false });
                    if (error) throw error;

                    // Get card counts for each client if details enabled
                    if (includeDetails) {
                        const { data: projects } = await supabase
                            .from('projects')
                            .select('client_id, status')
                            .is('deleted_at', null);

                        const clientStats = {};
                        (projects || []).forEach(p => {
                            if (!clientStats[p.client_id]) {
                                clientStats[p.client_id] = { total: 0, approved: 0, pending: 0, rejected: 0 };
                            }
                            clientStats[p.client_id].total++;
                            if (p.status === 'active') clientStats[p.client_id].approved++;
                            else if (p.status === 'pending_approval') clientStats[p.client_id].pending++;
                            else if (p.status === 'archived') clientStats[p.client_id].rejected++;
                        });

                        data = {
                            exportType: 'Clientes',
                            exportedAt: new Date().toISOString(),
                            period: { from: dateFrom || 'início', to: dateTo || 'hoje' },
                            totalClients: clients?.length || 0,
                            clients: clients?.map(c => ({
                                ...c,
                                stats: clientStats[c.id] || { total: 0, approved: 0, pending: 0, rejected: 0 }
                            }))
                        };
                    } else {
                        data = {
                            exportType: 'Clientes',
                            exportedAt: new Date().toISOString(),
                            totalClients: clients?.length || 0,
                            clients
                        };
                    }
                    filename = `clientes-${new Date().toISOString().split('T')[0]}`;
                    break;
                }

                case 'cards_approved': {
                    let query = supabase
                        .from('projects')
                        .select('*, client:client_id(full_name, email, project_name)')
                        .eq('status', 'active')
                        .is('deleted_at', null);

                    if (dateFrom || dateTo) {
                        query = buildDateFilter(query, 'updated_at');
                    }

                    const { data: cards, error } = await query.order('updated_at', { ascending: false });
                    if (error) throw error;

                    data = {
                        exportType: 'Cards Aprovados',
                        exportedAt: new Date().toISOString(),
                        period: { from: dateFrom || 'início', to: dateTo || 'hoje' },
                        totalCards: cards?.length || 0,
                        cards: cards?.map(c => ({
                            id: c.id,
                            name: c.name,
                            description: c.description,
                            category: c.category,
                            client: c.client?.full_name,
                            clientEmail: c.client?.email,
                            project: c.client?.project_name,
                            createdAt: c.created_at,
                            approvedAt: c.updated_at
                        }))
                    };
                    filename = `cards-aprovados-${new Date().toISOString().split('T')[0]}`;
                    break;
                }

                case 'cards_rejected': {
                    let query = supabase
                        .from('projects')
                        .select('*, client:client_id(full_name, email, project_name)')
                        .eq('status', 'archived')
                        .not('rejected_at', 'is', null)
                        .is('deleted_at', null);

                    if (dateFrom || dateTo) {
                        query = buildDateFilter(query, 'rejected_at');
                    }

                    const { data: cards, error } = await query.order('rejected_at', { ascending: false });
                    if (error) throw error;

                    data = {
                        exportType: 'Cards Recusados',
                        exportedAt: new Date().toISOString(),
                        period: { from: dateFrom || 'início', to: dateTo || 'hoje' },
                        totalCards: cards?.length || 0,
                        cards: cards?.map(c => ({
                            id: c.id,
                            name: c.name,
                            description: c.description,
                            category: c.category,
                            client: c.client?.full_name,
                            clientEmail: c.client?.email,
                            project: c.client?.project_name,
                            rejectionReason: c.rejection_reason,
                            createdAt: c.created_at,
                            rejectedAt: c.rejected_at
                        }))
                    };
                    filename = `cards-recusados-${new Date().toISOString().split('T')[0]}`;
                    break;
                }

                case 'cards_all': {
                    let query = supabase
                        .from('projects')
                        .select('*, client:client_id(full_name, email, project_name)')
                        .is('deleted_at', null);

                    if (status !== 'all') {
                        query = query.eq('status', status);
                    }
                    if (dateFrom || dateTo) {
                        query = buildDateFilter(query, 'created_at');
                    }

                    const { data: cards, error } = await query.order('created_at', { ascending: false });
                    if (error) throw error;

                    const statusLabels = { active: 'Aprovado', pending_approval: 'Pendente', draft: 'Rascunho', archived: 'Arquivado' };

                    data = {
                        exportType: 'Todos os Cards',
                        exportedAt: new Date().toISOString(),
                        period: { from: dateFrom || 'início', to: dateTo || 'hoje' },
                        statusFilter: status === 'all' ? 'Todos' : statusLabels[status],
                        totalCards: cards?.length || 0,
                        byStatus: {
                            approved: cards?.filter(c => c.status === 'active').length || 0,
                            pending: cards?.filter(c => c.status === 'pending_approval').length || 0,
                            draft: cards?.filter(c => c.status === 'draft').length || 0,
                            archived: cards?.filter(c => c.status === 'archived').length || 0
                        },
                        cards: cards?.map(c => ({
                            id: c.id,
                            name: c.name,
                            description: c.description,
                            category: c.category,
                            status: statusLabels[c.status] || c.status,
                            client: c.client?.full_name,
                            clientEmail: c.client?.email,
                            project: c.client?.project_name,
                            createdAt: c.created_at,
                            updatedAt: c.updated_at
                        }))
                    };
                    filename = `todos-cards-${new Date().toISOString().split('T')[0]}`;
                    break;
                }

                case 'projects': {
                    const { data: profiles } = await supabase
                        .from('profiles')
                        .select('id, full_name, email, project_name, created_at')
                        .is('deleted_at', null);

                    const { data: cards } = await supabase
                        .from('projects')
                        .select('client_id, status, created_at')
                        .is('deleted_at', null);

                    // Group by project_name
                    const projectMap = {};
                    (profiles || []).forEach(p => {
                        const pName = p.project_name || 'Sem projeto';
                        if (!projectMap[pName]) {
                            projectMap[pName] = { clients: [], cardStats: { total: 0, approved: 0, pending: 0, rejected: 0 } };
                        }
                        projectMap[pName].clients.push(p);
                    });

                    (cards || []).forEach(c => {
                        const client = profiles?.find(p => p.id === c.client_id);
                        const pName = client?.project_name || 'Sem projeto';
                        if (projectMap[pName]) {
                            projectMap[pName].cardStats.total++;
                            if (c.status === 'active') projectMap[pName].cardStats.approved++;
                            else if (c.status === 'pending_approval') projectMap[pName].cardStats.pending++;
                            else if (c.status === 'archived') projectMap[pName].cardStats.rejected++;
                        }
                    });

                    data = {
                        exportType: 'Resumo de Projetos',
                        exportedAt: new Date().toISOString(),
                        totalProjects: Object.keys(projectMap).length,
                        totalClients: profiles?.length || 0,
                        totalCards: cards?.length || 0,
                        projects: Object.entries(projectMap).map(([name, info]) => ({
                            projectName: name,
                            clientsCount: info.clients.length,
                            clients: includeDetails ? info.clients.map(c => ({ name: c.full_name, email: c.email })) : undefined,
                            ...info.cardStats,
                            approvalRate: info.cardStats.total > 0
                                ? ((info.cardStats.approved / info.cardStats.total) * 100).toFixed(1) + '%'
                                : '0%'
                        }))
                    };
                    filename = `projetos-resumo-${new Date().toISOString().split('T')[0]}`;
                    break;
                }

                case 'team': {
                    const { data: admins, error } = await supabase
                        .from('profiles')
                        .select('id, full_name, email, phone, created_at, role:roles(name, description)')
                        .is('deleted_at', null);

                    if (error) throw error;

                    const teamMembers = (admins || []).filter(a =>
                        a.role?.name === 'admin' || a.role?.name === 'super_admin'
                    );

                    data = {
                        exportType: 'Equipe Administrativa',
                        exportedAt: new Date().toISOString(),
                        totalAdmins: teamMembers.length,
                        superAdmins: teamMembers.filter(a => a.role?.name === 'super_admin').length,
                        admins: teamMembers.filter(a => a.role?.name === 'admin').length,
                        team: teamMembers.map(a => ({
                            name: a.full_name,
                            email: a.email,
                            phone: a.phone || '-',
                            role: a.role?.name === 'super_admin' ? 'Super Admin' : 'Admin',
                            since: a.created_at
                        }))
                    };
                    filename = `equipe-${new Date().toISOString().split('T')[0]}`;
                    break;
                }

                case 'analytics': {
                    // Fetch all data for analytics
                    const [profilesRes, cardsRes] = await Promise.all([
                        supabase.from('profiles').select('id, project_name, created_at, role:roles(name)').is('deleted_at', null),
                        supabase.from('projects').select('id, status, created_at, updated_at, rejected_at, client_id').is('deleted_at', null)
                    ]);

                    const profiles = profilesRes.data || [];
                    const cards = cardsRes.data || [];
                    const admins = profiles.filter(p => p.role?.name === 'admin' || p.role?.name === 'super_admin');
                    const clients = profiles.filter(p => !p.role || (p.role.name !== 'admin' && p.role.name !== 'super_admin'));

                    // Calculate monthly stats (last 6 months)
                    const monthlyStats = [];
                    for (let i = 5; i >= 0; i--) {
                        const date = new Date();
                        date.setMonth(date.getMonth() - i);
                        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
                        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString();

                        const monthClients = clients.filter(c => c.created_at >= monthStart && c.created_at <= monthEnd);
                        const monthCards = cards.filter(c => c.created_at >= monthStart && c.created_at <= monthEnd);
                        const monthApproved = cards.filter(c => c.status === 'active' && c.updated_at >= monthStart && c.updated_at <= monthEnd);

                        monthlyStats.push({
                            month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
                            newClients: monthClients.length,
                            newCards: monthCards.length,
                            approvedCards: monthApproved.length
                        });
                    }

                    // Cards by status
                    const cardsByStatus = {
                        approved: cards.filter(c => c.status === 'active').length,
                        pending: cards.filter(c => c.status === 'pending_approval').length,
                        draft: cards.filter(c => c.status === 'draft').length,
                        rejected: cards.filter(c => c.status === 'archived').length
                    };

                    // Unique projects
                    const uniqueProjects = [...new Set(profiles.map(p => p.project_name).filter(Boolean))];

                    data = {
                        exportType: 'Relatório Analítico',
                        exportedAt: new Date().toISOString(),
                        summary: {
                            totalClients: clients.length,
                            totalAdmins: admins.length,
                            totalCards: cards.length,
                            totalProjects: uniqueProjects.length,
                            overallApprovalRate: cards.length > 0
                                ? ((cardsByStatus.approved / cards.length) * 100).toFixed(1) + '%'
                                : '0%'
                        },
                        cardsByStatus,
                        monthlyTrends: monthlyStats,
                        topProjects: uniqueProjects.slice(0, 10).map(pName => ({
                            name: pName,
                            clients: clients.filter(c => c.project_name === pName).length,
                            cards: cards.filter(c => {
                                const client = clients.find(cl => cl.id === c.client_id);
                                return client?.project_name === pName;
                            }).length
                        }))
                    };
                    filename = `relatorio-analitico-${new Date().toISOString().split('T')[0]}`;
                    break;
                }

                default:
                    throw new Error('Tipo de exportação inválido');
            }

            // Export based on format
            let blob;
            if (format === 'csv' && data.clients) {
                // Convert to CSV for clients
                const items = data.clients || data.cards || data.team || data.projects;
                if (items && items.length > 0) {
                    const headers = Object.keys(items[0]).filter(k => typeof items[0][k] !== 'object');
                    const csvContent = [
                        headers.join(','),
                        ...items.map(item => headers.map(h => {
                            const val = item[h];
                            if (val === null || val === undefined) return '';
                            if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
                            return val;
                        }).join(','))
                    ].join('\n');
                    blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
                    filename += '.csv';
                } else {
                    blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    filename += '.json';
                }
            } else {
                blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                filename += '.json';
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            setShowExportModal(false);
            alert('Dados exportados com sucesso!');
        } catch (err) {
            console.error('Export error:', err);
            alert('Erro ao exportar: ' + err.message);
        } finally {
            setExporting(false);
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-bold text-white">Perfil do Administrador</h2>

                        {/* Profile Card */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-5">
                                {/* Neon Avatar */}
                                <div className="relative">
                                    <div className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-md opacity-60"></div>
                                    <div className="relative w-20 h-20 rounded-full bg-[#1a1a2e] flex items-center justify-center text-3xl font-bold text-violet-400 border-2 border-violet-500/50">
                                        {firstLetter}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{userName || 'Administrador'}</h3>
                                    <p className="text-slate-500">{user?.email}</p>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                        <Shield className="w-3 h-3" />
                                        Super Admin
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="space-y-3 p-5 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center justify-between py-2 border-b border-white/5">
                                <span className="text-sm text-slate-500">Email</span>
                                <span className="text-sm text-white">{user?.email}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-white/5">
                                <span className="text-sm text-slate-500">ID</span>
                                <span className="text-xs text-slate-400 font-mono">{user?.id?.slice(0, 8)}...</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-slate-500">Membro desde</span>
                                <span className="text-sm text-white">
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'appearance':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-bold text-white">Aparência</h2>

                        {/* Theme Toggle */}
                        <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                        {isDarkMode ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Tema do Sistema</p>
                                        <p className="text-xs text-slate-500">Modo {isDarkMode ? 'escuro' : 'claro'} ativo</p>
                                    </div>
                                </div>
                                <ToggleSwitch enabled={isDarkMode} onToggle={toggleTheme} />
                            </div>
                        </div>

                        {/* Theme Preview */}
                        <p className="text-sm text-slate-400">Selecione um tema</p>
                        <div className="grid grid-cols-2 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => isDarkMode && toggleTheme()}
                                className={`p-5 rounded-2xl border-2 transition-colors ${!isDarkMode ? 'border-violet-500 bg-slate-100' : 'border-transparent bg-slate-100'
                                    }`}
                            >
                                <div className="aspect-video rounded-xl bg-white shadow-sm mb-4 flex items-center justify-center">
                                    <Sun className="w-8 h-8 text-amber-500" />
                                </div>
                                <p className="text-sm font-medium text-slate-800">Modo Claro</p>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => !isDarkMode && toggleTheme()}
                                className={`p-5 rounded-2xl border-2 transition-colors ${isDarkMode ? 'border-violet-500 bg-[#1a1a2e]' : 'border-transparent bg-[#1a1a2e]'
                                    }`}
                            >
                                <div className="aspect-video rounded-xl bg-[#252545] mb-4 flex items-center justify-center">
                                    <Moon className="w-8 h-8 text-violet-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-200">Modo Escuro</p>
                            </motion.button>
                        </div>
                    </motion.div>
                );

            case 'notifications':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-bold text-white">Notificações</h2>
                        <p className="text-sm text-slate-400">Controle quais notificações você deseja receber. As notificações desativadas não aparecerão no sino.</p>

                        <div className="space-y-3">
                            {notificationSettings.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${item.enabled
                                        ? 'bg-violet-500/5 border-violet-500/20'
                                        : 'bg-white/5 border-white/5'
                                        }`}
                                >
                                    <div>
                                        <p className="text-sm font-medium text-white">{item.label}</p>
                                        <p className="text-xs text-slate-500">{item.description}</p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={item.enabled}
                                        onToggle={() => toggleSetting(item.id)}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <p className="text-sm text-amber-400">
                                <strong>Dica:</strong> Desativar uma categoria oculta as notificações correspondentes do popup no sino da barra superior.
                            </p>
                        </div>
                    </motion.div>
                );

            case 'security':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-bold text-white">Segurança</h2>

                        <div className="space-y-3">
                            <SettingsItem
                                icon={Lock}
                                label="Alterar Senha"
                                description="Atualize sua senha de acesso"
                                onClick={() => setShowPasswordModal(true)}
                            />
                            <SettingsItem
                                icon={Clock}
                                label="Última Atividade"
                                description="Sua última ação registrada"
                                rightContent={
                                    <span className="text-xs text-slate-400">Agora</span>
                                }
                            />
                            <SettingsItem
                                icon={LogOut}
                                label="Sair da Conta"
                                description="Encerrar sessão atual"
                                onClick={signOut}
                                danger
                            />
                        </div>
                    </motion.div>
                );

            case 'system':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-bold text-white">Sistema</h2>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {loadingStats ? (
                                <div className="col-span-3 flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <StatCard icon={FolderKanban} label="Projetos" value={stats.projects} color="bg-violet-500" />
                                    <StatCard icon={Users} label="Clientes" value={stats.clients} color="bg-emerald-500" />
                                    <StatCard icon={Shield} label="Admins" value={stats.admins} color="bg-amber-500" />
                                </>
                            )}
                        </div>

                        {/* System Actions */}
                        <div className="space-y-3">
                            <SettingsItem
                                icon={RefreshCw}
                                label="Atualizar Cache"
                                description="Limpa o cache e recarrega dados do sistema"
                                onClick={() => {
                                    window.location.reload();
                                }}
                            />
                            <SettingsItem
                                icon={Download}
                                label="Exportar Dados"
                                description="Exportar dados com filtros avançados"
                                onClick={() => setShowExportModal(true)}
                            />
                            <SettingsItem
                                icon={HardDrive}
                                label="Informações do Sistema"
                                description="Versão e detalhes técnicos"
                                rightContent={
                                    <span className="text-xs text-violet-400 font-mono">v1.0.0</span>
                                }
                            />
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
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
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-violet-400" />
                        </div>
                        <h1 className="text-3xl font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Configurações</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400"
                    >
                        Gerencie suas preferências e conta
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => window.location.reload()}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                >
                    <RefreshCw className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Mobile Tabs */}
            {isMobile && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide"
                >
                    {settingsSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${activeSection === section.id
                                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                }`}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Desktop Layout */}
            <div className="flex gap-8">
                {/* Sidebar - Desktop only */}
                {!isMobile && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-56 flex-shrink-0 space-y-2"
                    >
                        {settingsSections.map((section, index) => (
                            <motion.button
                                key={section.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === section.id
                                    ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/10 text-white border-l-2 border-violet-500'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <section.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{section.label}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Change Password Modal */}
            <PortalModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                title="Alterar Senha"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Senha Atual</label>
                        <input
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Nova Senha</label>
                        <input
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Confirmar Nova Senha</label>
                        <input
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                            placeholder="Confirme a nova senha"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setShowPasswordModal(false)}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleChangePassword}
                            disabled={savingPassword || !passwordForm.new || !passwordForm.confirm}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            {savingPassword ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </PortalModal>

            {/* Export Modal */}
            <PortalModal isOpen={showExportModal} onClose={() => setShowExportModal(false)}>
                <div className="p-6 max-h-[85vh] overflow-y-auto scrollbar-hide">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                <FileSpreadsheet className="w-5 h-5 text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Exportar Dados</h2>
                                <p className="text-slate-400 text-sm">Selecione o tipo de dados e filtros</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowExportModal(false)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Data Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm text-slate-400 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Tipo de Dados
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {exportDataTypes.map(type => {
                                const IconComponent = type.icon;
                                const isSelected = exportConfig.dataType === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setExportConfig({ ...exportConfig, dataType: type.id })}
                                        className={`p-3 rounded-xl border text-left transition-all ${isSelected
                                                ? 'bg-violet-500/20 border-violet-500/50 text-white'
                                                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-violet-500/30' : 'bg-white/10'
                                                }`}>
                                                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-violet-300' : 'text-slate-400'}`} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{type.label}</p>
                                                <p className="text-xs text-slate-500">{type.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Filters */}
                    {['clients', 'cards_approved', 'cards_rejected', 'cards_all'].includes(exportConfig.dataType) && (
                        <div className="mb-6">
                            <label className="block text-sm text-slate-400 mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Filtrar por Período
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Data Inicial</label>
                                    <input
                                        type="date"
                                        value={exportConfig.dateFrom}
                                        onChange={(e) => setExportConfig({ ...exportConfig, dateFrom: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Data Final</label>
                                    <input
                                        type="date"
                                        value={exportConfig.dateTo}
                                        onChange={(e) => setExportConfig({ ...exportConfig, dateTo: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Deixe em branco para exportar todos os registros</p>
                        </div>
                    )}

                    {/* Status Filter (only for cards_all) */}
                    {exportConfig.dataType === 'cards_all' && (
                        <div className="mb-6">
                            <label className="block text-sm text-slate-400 mb-3 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filtrar por Status
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: 'all', label: 'Todos' },
                                    { value: 'active', label: 'Aprovados' },
                                    { value: 'pending_approval', label: 'Pendentes' },
                                    { value: 'draft', label: 'Rascunhos' },
                                    { value: 'archived', label: 'Arquivados' }
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setExportConfig({ ...exportConfig, status: opt.value })}
                                        className={`px-4 py-2 rounded-xl text-sm transition-all ${exportConfig.status === opt.value
                                                ? 'bg-violet-500/20 border border-violet-500/50 text-white'
                                                : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Include Details Toggle */}
                    {['clients', 'projects'].includes(exportConfig.dataType) && (
                        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white font-medium">Incluir detalhes expandidos</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {exportConfig.dataType === 'clients'
                                            ? 'Adiciona estatísticas de cards por cliente'
                                            : 'Adiciona lista de clientes por projeto'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setExportConfig({ ...exportConfig, includeDetails: !exportConfig.includeDetails })}
                                    className={`w-12 h-6 rounded-full transition-all ${exportConfig.includeDetails ? 'bg-violet-500' : 'bg-white/20'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform ${exportConfig.includeDetails ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Format Selection */}
                    <div className="mb-6">
                        <label className="block text-sm text-slate-400 mb-3 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Formato de Exportação
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setExportConfig({ ...exportConfig, format: 'json' })}
                                className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${exportConfig.format === 'json'
                                        ? 'bg-violet-500/20 border-violet-500/50 text-white'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                <FileJson className="w-5 h-5" />
                                <span className="font-medium">JSON</span>
                            </button>
                            <button
                                onClick={() => setExportConfig({ ...exportConfig, format: 'csv' })}
                                className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${exportConfig.format === 'csv'
                                        ? 'bg-violet-500/20 border-violet-500/50 text-white'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                <FileSpreadsheet className="w-5 h-5" />
                                <span className="font-medium">CSV</span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            {exportConfig.format === 'json'
                                ? 'Ideal para backup completo com estrutura hierárquica'
                                : 'Ideal para análise em Excel ou Google Sheets'}
                        </p>
                    </div>

                    {/* Export Preview */}
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-4 h-4 text-violet-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white mb-1">Resumo da Exportação</p>
                                <p className="text-xs text-slate-400">
                                    {exportDataTypes.find(t => t.id === exportConfig.dataType)?.label || 'Dados'}
                                    {exportConfig.dateFrom && ` • De ${new Date(exportConfig.dateFrom).toLocaleDateString('pt-BR')}`}
                                    {exportConfig.dateTo && ` até ${new Date(exportConfig.dateTo).toLocaleDateString('pt-BR')}`}
                                    {exportConfig.status !== 'all' && exportConfig.dataType === 'cards_all' && ` • Status: ${{ active: 'Aprovados', pending_approval: 'Pendentes', draft: 'Rascunhos', archived: 'Arquivados' }[exportConfig.status]
                                        }`}
                                    {` • Formato: ${exportConfig.format.toUpperCase()}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowExportModal(false)}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleExportData}
                            disabled={exporting}
                            className="flex-1 py-3 rounded-xl bg-white text-[#0A0A0B] font-medium hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {exporting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Exportando...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Exportar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </PortalModal>
        </div>
    );
}
