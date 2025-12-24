import React, { useState } from 'react';
import {
    Users, FolderKanban, DollarSign, TrendingUp,
    ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
    AlertCircle, Plus, Eye, MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for admin dashboard
const statsData = [
    {
        label: 'Total de Clientes',
        value: '24',
        change: '+12%',
        positive: true,
        icon: Users,
        color: 'from-violet-500 to-purple-600',
        shadowColor: 'shadow-violet-500/20'
    },
    {
        label: 'Projetos Ativos',
        value: '38',
        change: '+8%',
        positive: true,
        icon: FolderKanban,
        color: 'from-fuchsia-500 to-pink-600',
        shadowColor: 'shadow-fuchsia-500/20'
    },
    {
        label: 'Receita Mensal',
        value: 'R$ 45.2k',
        change: '+23%',
        positive: true,
        icon: DollarSign,
        color: 'from-emerald-500 to-teal-600',
        shadowColor: 'shadow-emerald-500/20'
    },
    {
        label: 'Taxa de Conversão',
        value: '67%',
        change: '-3%',
        positive: false,
        icon: TrendingUp,
        color: 'from-amber-500 to-orange-600',
        shadowColor: 'shadow-amber-500/20'
    },
];

const recentActivity = [
    {
        id: 1,
        type: 'project',
        message: 'Novo projeto criado para Dr. Marcus',
        client: 'MedClinic Pro',
        time: 'Há 5 min',
        icon: FolderKanban,
        color: 'text-violet-400',
        bg: 'bg-violet-500/10'
    },
    {
        id: 2,
        type: 'client',
        message: 'Novo cliente cadastrado',
        client: 'JM Advogados',
        time: 'Há 2 horas',
        icon: Users,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10'
    },
    {
        id: 3,
        type: 'approval',
        message: 'Landing page aprovada',
        client: 'Consult Pro',
        time: 'Há 4 horas',
        icon: CheckCircle2,
        color: 'text-green-400',
        bg: 'bg-green-500/10'
    },
    {
        id: 4,
        type: 'alert',
        message: 'Prazo próximo do vencimento',
        client: 'Tech Solutions',
        time: 'Há 6 horas',
        icon: AlertCircle,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10'
    },
];

const recentClients = [
    { id: 1, name: 'Dr. Marcus Silva', email: 'marcus@medclinic.com', projects: 3, status: 'active' },
    { id: 2, name: 'JM Advogados', email: 'contato@jmadvogados.com', projects: 2, status: 'active' },
    { id: 3, name: 'Consult Pro', email: 'admin@consultpro.com', projects: 1, status: 'pending' },
    { id: 4, name: 'Tech Solutions', email: 'dev@techsolutions.io', projects: 4, status: 'active' },
];

export default function AdminHome() {
    const [isLoaded, setIsLoaded] = useState(true);

    return (
        <div className={`dashboard-page ${isLoaded ? 'loaded' : ''}`}>
            {/* Header */}
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    Painel Administrativo
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400"
                >
                    Visão geral de todos os clientes e projetos
                </motion.p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className={`relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all group ${stat.shadowColor}`}
                    >
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg ${stat.shadowColor}`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Value */}
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>

                        {/* Label */}
                        <p className="text-sm text-slate-400 mb-3">{stat.label}</p>

                        {/* Change indicator */}
                        <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {stat.positive ? (
                                <ArrowUpRight className="w-4 h-4" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4" />
                            )}
                            <span>{stat.change} este mês</span>
                        </div>

                        {/* Hover glow effect */}
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
                    className="lg:col-span-1 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Atividade Recente</h2>
                        <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                            Ver tudo
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
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
                        ))}
                    </div>
                </motion.div>

                {/* Recent Clients */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="lg:col-span-2 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Clientes Recentes</h2>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25">
                            <Plus className="w-4 h-4" />
                            Novo Cliente
                        </button>
                    </div>

                    {/* Clients Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                                    <th className="pb-4 font-medium">Cliente</th>
                                    <th className="pb-4 font-medium">Email</th>
                                    <th className="pb-4 font-medium">Projetos</th>
                                    <th className="pb-4 font-medium">Status</th>
                                    <th className="pb-4 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentClients.map((client, index) => (
                                    <motion.tr
                                        key={client.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.05 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold">
                                                    {client.name[0]}
                                                </div>
                                                <span className="text-sm text-white font-medium">{client.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-slate-400">{client.email}</td>
                                        <td className="py-4 text-sm text-white">{client.projects}</td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                                                ${client.status === 'active'
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-amber-500/10 text-amber-400'}`}
                                            >
                                                {client.status === 'active' ? 'Ativo' : 'Pendente'}
                                            </span>
                                        </td>
                                        <td className="py-4">
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
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-white/5"
            >
                <h3 className="text-lg font-bold text-white mb-4">Ações Rápidas</h3>
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white transition-colors border border-white/5">
                        + Novo Cliente
                    </button>
                    <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white transition-colors border border-white/5">
                        + Novo Projeto
                    </button>
                    <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white transition-colors border border-white/5">
                        Gerar Relatório
                    </button>
                    <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white transition-colors border border-white/5">
                        Convidar Membro
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
