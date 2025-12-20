import React, { useState, useEffect } from 'react';
import { BarChart3, FolderKanban, Clock, CheckCircle2, TrendingUp, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const statsCards = [
    { 
        label: 'Projetos Ativos', 
        value: '4', 
        icon: FolderKanban, 
        color: 'purple',
        trend: '+2',
        trendType: 'positive',
        bg: 'rgba(139, 92, 246, 0.1)',
        iconColor: '#8b5cf6'
    },
    { 
        label: 'Aguardando', 
        value: '7', 
        icon: Clock, 
        color: 'orange',
        trend: '+3',
        trendType: 'positive',
        bg: 'rgba(245, 158, 11, 0.1)',
        iconColor: '#f59e0b'
    },
    { 
        label: 'Aprovados', 
        value: '12', 
        icon: CheckCircle2, 
        color: 'green',
        trend: '+5',
        trendType: 'positive',
        bg: 'rgba(16, 185, 129, 0.1)',
        iconColor: '#10b981'
    },
    { 
        label: 'Taxa de Aprovação', 
        value: '94%', 
        icon: TrendingUp, 
        color: 'blue',
        trend: '+8%',
        trendType: 'positive',
        bg: 'rgba(59, 130, 246, 0.1)',
        iconColor: '#3b82f6'
    },
];

const recentActivity = [
    { 
        type: 'approval', 
        message: 'Landing page Clínica aprovada', 
        time: 'Há 2 horas', 
        project: 'Dr. Marcus',
        color: '#10b981'
    },
    { 
        type: 'upload', 
        message: 'Nova referência adicionada', 
        time: 'Há 4 horas', 
        project: 'Escritório JM',
        color: '#3b82f6'
    },
    { 
        type: 'comment', 
        message: 'Comentário do cliente', 
        time: 'Há 6 horas', 
        project: 'Studio Design',
        color: '#8b5cf6'
    },
    { 
        type: 'revision', 
        message: 'Revisão solicitada', 
        time: 'Há 1 dia', 
        project: 'Consult Pro',
        color: '#f59e0b'
    },
];

export default function DashboardHome() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className={`dashboard-page ${isLoaded ? 'loaded' : ''}`}>
            {/* Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-title">
                        Bem-vindo de volta, João 👋
                    </h1>
                    <p className="page-subtitle">
                        Aqui está um resumo dos seus projetos
                    </p>
                </div>
                <div className="page-header-right">
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus className="w-4 h-4" />
                        Novo Projeto
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statsCards.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-card-header">
                            <span className="stat-card-label">{stat.label}</span>
                            <div 
                                className="stat-card-icon"
                                style={{ backgroundColor: stat.bg }}
                            >
                                <stat.icon 
                                    className="w-5 h-5" 
                                    style={{ color: stat.iconColor }}
                                />
                            </div>
                        </div>
                        <div className="stat-card-value">{stat.value}</div>
                        <div className={`stat-card-trend ${stat.trendType}`}>
                            {stat.trendType === 'positive' ? (
                                <ArrowUpRight className="w-3 h-3" />
                            ) : (
                                <ArrowDownRight className="w-3 h-3" />
                            )}
                            {stat.trend} este mês
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="content-grid">
                {/* Recent Activity */}
                <div className="glass-panel" style={{ animationDelay: '0.3s' }}>
                    <div className="glass-panel-header">
                        <h2 className="glass-panel-title">Atividade Recente</h2>
                        <button className="glass-panel-action">Ver Todas →</button>
                    </div>
                    <div className="activity-list">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div 
                                    className="activity-indicator"
                                    style={{ backgroundColor: activity.color }}
                                />
                                <div className="activity-content">
                                    <p className="activity-message">{activity.message}</p>
                                    <p className="activity-meta">{activity.project} · {activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-panel" style={{ animationDelay: '0.4s' }}>
                    <div className="glass-panel-header">
                        <h2 className="glass-panel-title">Ações Rápidas</h2>
                    </div>
                    <div className="quick-actions">
                        <button className="quick-action-btn">
                            <FolderKanban className="w-5 h-5" />
                            <span>Ver Projetos</span>
                        </button>
                        <button className="quick-action-btn">
                            <BarChart3 className="w-5 h-5" />
                            <span>Relatórios</span>
                        </button>
                        <button className="quick-action-btn">
                            <Clock className="w-5 h-5" />
                            <span>Pendências</span>
                        </button>
                    </div>

                    {/* Tip Card */}
                    <div className="tip-card">
                        <p className="tip-card-title">
                            💡 Dica do dia
                        </p>
                        <p className="tip-card-content">
                            Organize suas referências em pastas para facilitar a aprovação do cliente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
