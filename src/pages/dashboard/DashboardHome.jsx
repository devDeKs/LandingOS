import React from 'react';
import { BarChart3, FolderKanban, Clock, CheckCircle2, TrendingUp, Plus } from 'lucide-react';

const statsCards = [
    { label: 'Projetos Ativos', value: '4', icon: FolderKanban, color: 'purple' },
    { label: 'Aguardando Aprovação', value: '7', icon: Clock, color: 'orange' },
    { label: 'Aprovados Este Mês', value: '12', icon: CheckCircle2, color: 'green' },
    { label: 'Taxa de Aprovação', value: '94%', icon: TrendingUp, color: 'blue' },
];

const recentActivity = [
    { type: 'approval', message: 'Landing page Clínica aprovada', time: 'Há 2 horas', project: 'Dr. Marcus' },
    { type: 'upload', message: 'Nova referência adicionada', time: 'Há 4 horas', project: 'Escritório JM' },
    { type: 'comment', message: 'Comentário do cliente', time: 'Há 6 horas', project: 'Studio Design' },
    { type: 'rejection', message: 'Revisão solicitada', time: 'Há 1 dia', project: 'Consult Pro' },
];

export default function DashboardHome() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--dash-text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                        Bem-vindo de volta, João 👋
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--dash-text-muted)' }}>
                        Aqui está um resumo dos seus projetos
                    </p>
                </div>
                <button className="btn-primary flex items-center gap-2 self-start">
                    <Plus className="w-4 h-4" />
                    Novo Projeto
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => (
                    <div key={index} className="dashboard-card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm" style={{ color: 'var(--dash-text-muted)' }}>
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold mt-1" style={{ color: 'var(--dash-text-primary)' }}>
                                    {stat.value}
                                </p>
                            </div>
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                                        stat.color === 'orange' ? 'bg-orange-500/10 text-orange-500' :
                                            stat.color === 'green' ? 'bg-green-500/10 text-green-500' :
                                                'bg-blue-500/10 text-blue-500'
                                    }`}
                            >
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 dashboard-card p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold" style={{ color: 'var(--dash-text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                            Atividade Recente
                        </h2>
                        <button className="text-sm hover:underline" style={{ color: 'var(--dash-accent)' }}>
                            Ver Todas
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-[var(--dash-bg-tertiary)]">
                                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'approval' ? 'bg-green-500' :
                                        activity.type === 'upload' ? 'bg-blue-500' :
                                            activity.type === 'comment' ? 'bg-purple-500' :
                                                'bg-orange-500'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm" style={{ color: 'var(--dash-text-primary)' }}>
                                        {activity.message}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--dash-text-muted)' }}>
                                        {activity.project} · {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card p-5">
                    <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--dash-text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                        Ações Rápidas
                    </h2>
                    <div className="space-y-3">
                        <button className="w-full btn-secondary text-left flex items-center gap-3">
                            <FolderKanban className="w-5 h-5" style={{ color: 'var(--dash-accent)' }} />
                            <span>Ver Projetos</span>
                        </button>
                        <button className="w-full btn-secondary text-left flex items-center gap-3">
                            <BarChart3 className="w-5 h-5" style={{ color: 'var(--dash-accent)' }} />
                            <span>Relatórios</span>
                        </button>
                        <button className="w-full btn-secondary text-left flex items-center gap-3">
                            <Clock className="w-5 h-5" style={{ color: 'var(--dash-accent)' }} />
                            <span>Pendências</span>
                        </button>
                    </div>

                    {/* Mini CTA */}
                    <div
                        className="mt-6 p-4 rounded-xl"
                        style={{ backgroundColor: 'var(--dash-accent-bg)' }}
                    >
                        <p className="text-sm font-medium" style={{ color: 'var(--dash-accent)' }}>
                            💡 Dica do dia
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--dash-text-secondary)' }}>
                            Organize suas referências em pastas para facilitar a aprovação do cliente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
