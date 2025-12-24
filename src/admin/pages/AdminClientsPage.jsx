import React, { useState, useEffect } from 'react';
import {
    Users, Search, Plus, Eye, MoreHorizontal, Mail, Phone,
    Calendar, FolderKanban, Loader2, RefreshCw, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export default function AdminClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Fetch all clients from profiles table
    const fetchClients = async () => {
        setLoading(true);
        try {
            // Fetch from profiles table
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Could not fetch profiles:', error.message);
                // Table might not exist or be empty
                setClients([]);
            } else {
                // Map profiles to client format
                const mappedClients = (profiles || []).map(p => ({
                    id: p.id,
                    email: p.email || 'N/A',
                    full_name: p.full_name || 'Sem nome',
                    phone: p.phone || '',
                    created_at: p.created_at,
                    projects_count: 0,
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

    useEffect(() => {
        fetchClients();
    }, []);

    // Filter clients by search
    const filteredClients = clients.filter(client =>
        client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        Clientes
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
                        placeholder="Buscar por nome ou email..."
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
                        <p className="text-sm text-slate-500">Os clientes aparecem aqui quando fazem cadastro</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                                    <th className="px-6 py-4 font-medium">Cliente</th>
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

            {/* Add Client Modal Placeholder */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md p-6 rounded-2xl bg-[#1a1a2e] border border-white/10"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Novo Cliente</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Os clientes são adicionados automaticamente quando fazem cadastro na plataforma.
                            </p>
                            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-6">
                                <p className="text-sm text-violet-300">
                                    💡 Compartilhe o link de cadastro com novos clientes para que eles criem suas contas.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                            >
                                Entendi
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
