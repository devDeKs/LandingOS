import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    UserCog, Search, Plus, Eye, MoreHorizontal, Mail, Shield,
    Calendar, Loader2, RefreshCw, X, Crown, Trash2, Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// Role configuration for badges
const roleConfig = {
    super_admin: {
        label: 'Super Admin',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        icon: Crown
    },
    admin: {
        label: 'Admin',
        color: 'text-violet-400',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
        icon: Shield
    },
};

// Portal Modal Component
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
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
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

export default function AdminTeamPage() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(null);
    const [saving, setSaving] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    // New admin form
    const [newAdmin, setNewAdmin] = useState({
        full_name: '',
        email: '',
        password: '',
        role_id: ''
    });

    // Fetch all roles
    const fetchRoles = async () => {
        try {
            const { data, error } = await supabase
                .from('roles')
                .select('*')
                .in('name', ['super_admin', 'admin']);

            if (!error && data) {
                setRoles(data);
                // Set default role to admin
                const adminRole = data.find(r => r.name === 'admin');
                if (adminRole) {
                    setNewAdmin(prev => ({ ...prev, role_id: adminRole.id }));
                }
            }
        } catch (err) {
            console.error('Error fetching roles:', err);
        }
    };

    // Fetch all team members (admins)
    const fetchTeamMembers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    *,
                    role:roles(id, name, description)
                `)
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Could not fetch team members:', error.message);
                setTeamMembers([]);
            } else {
                // Filter only admin/super_admin users
                const admins = (data || []).filter(
                    p => p.role?.name === 'super_admin' || p.role?.name === 'admin'
                );
                setTeamMembers(admins);
            }
        } catch (err) {
            console.error('Error fetching team members:', err);
            setTeamMembers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchTeamMembers();
    }, []);

    // Filter by search
    const filteredMembers = teamMembers.filter(member =>
        member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Create new admin user
    const handleCreateAdmin = async () => {
        if (!newAdmin.email || !newAdmin.full_name || !newAdmin.password || !newAdmin.role_id) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        if (newAdmin.password.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        setSaving(true);
        try {
            // Create user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: newAdmin.email,
                password: newAdmin.password,
                options: {
                    data: {
                        full_name: newAdmin.full_name
                    }
                }
            });

            if (authError) throw authError;

            // Update profile with role_id
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        full_name: newAdmin.full_name,
                        role_id: newAdmin.role_id
                    })
                    .eq('id', authData.user.id);

                if (profileError) {
                    console.warn('Could not update profile:', profileError.message);
                }
            }

            alert('Administrador criado com sucesso! Um email de confirmação foi enviado.');
            setShowAddModal(false);
            const adminRole = roles.find(r => r.name === 'admin');
            setNewAdmin({
                full_name: '',
                email: '',
                password: '',
                role_id: adminRole?.id || ''
            });
            fetchTeamMembers();
        } catch (err) {
            console.error('Error creating admin:', err);
            alert('Erro ao criar administrador: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Get role config
    const getRoleConfig = (roleName) => {
        return roleConfig[roleName] || roleConfig.admin;
    };

    // Remove admin (demote to regular user)
    const handleRemoveAdmin = async (memberId, memberName) => {
        if (!confirm(`Tem certeza que deseja remover "${memberName}" como administrador? O usuário será convertido para usuário comum.`)) {
            return;
        }

        setRemovingId(memberId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role_id: null })
                .eq('id', memberId);

            if (error) throw error;

            alert('Administrador removido com sucesso!');
            fetchTeamMembers();
        } catch (err) {
            console.error('Error removing admin:', err);
            alert('Erro ao remover administrador: ' + err.message);
        } finally {
            setRemovingId(null);
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
                            <UserCog className="w-5 h-5 text-violet-400" />
                        </div>
                        <h1 className="text-3xl font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Equipe</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400"
                    >
                        {teamMembers.length} {teamMembers.length === 1 ? 'administrador' : 'administradores'}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3"
                >
                    <button
                        onClick={() => { fetchRoles(); fetchTeamMembers(); }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0A0A0B] text-sm font-medium hover:bg-slate-100 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Admin
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
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                </div>
            </motion.div>

            {/* Team Members Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                </div>
            ) : filteredMembers.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5"
                >
                    <UserCog className="w-16 h-16 text-slate-600 mb-4" />
                    <p className="text-slate-400 text-lg mb-2">Nenhum administrador encontrado</p>
                    <p className="text-sm text-slate-500">Adicione um novo admin para começar</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filteredMembers.map((member, index) => {
                        const roleInfo = getRoleConfig(member.role?.name);
                        const RoleIcon = roleInfo.icon;

                        return (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-violet-500/30 transition-all"
                            >
                                {/* Role Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.bg} ${roleInfo.color} ${roleInfo.border} border`}>
                                        <RoleIcon className="w-3 h-3" />
                                        {roleInfo.label}
                                    </span>
                                </div>

                                {/* Avatar and Info */}
                                <div className="flex items-start gap-4 mb-4">
                                    {/* Neon Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="absolute inset-[-3px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-sm opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                        {member.avatar_url ? (
                                            <img
                                                src={member.avatar_url}
                                                alt={member.full_name}
                                                className="relative w-14 h-14 rounded-full object-cover border-2 border-violet-500/50"
                                            />
                                        ) : (
                                            <div className="relative w-14 h-14 rounded-full bg-[#1a1a2e] flex items-center justify-center text-xl font-bold text-violet-400 border-2 border-violet-500/50">
                                                {member.full_name?.[0]?.toUpperCase() || 'A'}
                                            </div>
                                        )}
                                        {/* Online indicator */}
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#12121a] rounded-full"></div>
                                    </div>

                                    <div className="flex-1 min-w-0 pt-1">
                                        <h3 className="text-lg font-semibold text-white truncate">
                                            {member.full_name || 'Sem nome'}
                                        </h3>
                                        <p className="text-sm text-slate-500 truncate">
                                            {member.email || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Mail className="w-4 h-4 text-slate-500" />
                                        <span className="truncate">{member.email || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                        <span>Desde {formatDate(member.created_at)}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => setShowViewModal(member)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Ver Detalhes
                                    </button>
                                    <button
                                        onClick={() => handleRemoveAdmin(member.id, member.full_name)}
                                        disabled={removingId === member.id}
                                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sm text-red-400 hover:text-red-300 transition-colors border border-red-500/20 disabled:opacity-50"
                                    >
                                        {removingId === member.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                        Remover
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* Add Admin Modal */}
            <PortalModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Novo Administrador"
            >
                <div className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nome Completo *
                        </label>
                        <input
                            type="text"
                            value={newAdmin.full_name}
                            onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                            placeholder="Nome do administrador"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                            placeholder="admin@email.com"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Senha *
                        </label>
                        <input
                            type="password"
                            value={newAdmin.password}
                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nível de Acesso *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {roles.map(role => {
                                const config = getRoleConfig(role.name);
                                const RoleIcon = config.icon;
                                const isSelected = newAdmin.role_id === role.id;

                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setNewAdmin({ ...newAdmin, role_id: role.id })}
                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${isSelected
                                            ? `${config.bg} ${config.border} border-2`
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                                            <RoleIcon className={`w-5 h-5 ${config.color}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-sm font-medium ${isSelected ? config.color : 'text-white'}`}>
                                                {config.label}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {role.name === 'super_admin' ? 'Acesso total' : 'Acesso administrativo'}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-white/5">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreateAdmin}
                            disabled={saving || !newAdmin.email || !newAdmin.full_name || !newAdmin.password || !newAdmin.role_id}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                'Criar Admin'
                            )}
                        </button>
                    </div>
                </div>
            </PortalModal>

            {/* View Member Modal */}
            <PortalModal
                isOpen={!!showViewModal}
                onClose={() => setShowViewModal(null)}
                title="Detalhes do Administrador"
            >
                {showViewModal && (
                    <div className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-[-3px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-sm opacity-60"></div>
                                {showViewModal.avatar_url ? (
                                    <img
                                        src={showViewModal.avatar_url}
                                        alt={showViewModal.full_name}
                                        className="relative w-20 h-20 rounded-full object-cover border-2 border-violet-500/50"
                                    />
                                ) : (
                                    <div className="relative w-20 h-20 rounded-full bg-[#1a1a2e] flex items-center justify-center text-2xl font-bold text-violet-400 border-2 border-violet-500/50">
                                        {showViewModal.full_name?.[0]?.toUpperCase() || 'A'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    {showViewModal.full_name || 'Sem nome'}
                                </h3>
                                {(() => {
                                    const roleInfo = getRoleConfig(showViewModal.role?.name);
                                    const RoleIcon = roleInfo.icon;
                                    return (
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${roleInfo.bg} ${roleInfo.color} ${roleInfo.border} border`}>
                                            <RoleIcon className="w-3 h-3" />
                                            {roleInfo.label}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Email</span>
                                <span className="text-sm text-white">{showViewModal.email || '-'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Cadastrado em</span>
                                <span className="text-sm text-white">{formatDate(showViewModal.created_at)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Última atualização</span>
                                <span className="text-sm text-white">{formatDate(showViewModal.updated_at)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowViewModal(null)}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </PortalModal>
        </div>
    );
}
