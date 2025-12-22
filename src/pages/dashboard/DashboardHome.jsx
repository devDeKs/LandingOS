import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Clock, CheckCircle2, TrendingUp, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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

// 50 dicas relevantes para o LandingOS
const dailyTips = [
    "Use referências visuais para alinhar expectativas com seu cliente desde o início.",
    "Organize suas referências em pastas para facilitar a aprovação do cliente.",
    "Defina prazos realistas e comunique-os claramente para evitar retrabalho.",
    "Uma landing page bem estruturada pode aumentar sua taxa de conversão em até 300%.",
    "Utilize CTAs (Call-to-Action) claros e visíveis em suas landing pages.",
    "Teste diferentes versões da sua landing page para encontrar a que converte mais.",
    "Mantenha o texto da sua landing page conciso e focado no benefício principal.",
    "Use depoimentos de clientes para aumentar a credibilidade do seu projeto.",
    "Certifique-se que sua landing page carrega em menos de 3 segundos.",
    "O primeiro dobramento da página é crucial - coloque as informações mais importantes lá.",
    "Use cores contrastantes para destacar botões de ação.",
    "Revise seu briefing regularmente para garantir que o projeto está no caminho certo.",
    "Agrupe tarefas similares para otimizar seu tempo de trabalho.",
    "Priorize projetos por prazo e complexidade para melhor gestão do tempo.",
    "Documente todas as aprovações do cliente para evitar mal-entendidos.",
    "Use o cronograma para visualizar deadlines e evitar atrasos.",
    "Faça check-ins regulares com clientes para manter alinhamento.",
    "Crie templates para acelerar a produção de novos projetos.",
    "Uma boa hero section pode aumentar o engajamento em 80%.",
    "Mobile-first: 60% dos acessos são por dispositivos móveis.",
    "Use animações sutis para guiar o olhar do usuário.",
    "Menos é mais: designs limpos convertem melhor.",
    "Mantenha consistência visual em todos os elementos da página.",
    "Use espaço em branco estrategicamente para melhorar a legibilidade.",
    "Fontes grandes e legíveis melhoram a experiência do usuário.",
    "Integre analytics desde o dia 1 para mensurar resultados.",
    "Crie urgência com ofertas por tempo limitado na sua landing page.",
    "Use ícones reconhecíveis para facilitar a navegação.",
    "Otimize imagens para web sem perder qualidade.",
    "Formulários curtos têm maior taxa de preenchimento.",
    "Use prova social: números de clientes, vendas ou avaliações.",
    "Garanta que todos os links estejam funcionando antes da entrega.",
    "Teste sua landing page em diferentes navegadores e dispositivos.",
    "Use headlines que comunicam benefícios, não características.",
    "Inclua garantias para reduzir a fricção de compra.",
    "Personalize a experiência do usuário quando possível.",
    "Use vídeos explicativos para aumentar o tempo na página.",
    "Crie uma FAQ para responder dúvidas comuns antecipadamente.",
    "Use chatbots para capturar leads mesmo fora do horário comercial.",
    "Integre dengan redes sociais para ampliar o alcance.",
    "Use remarketing para recuperar visitantes que não converteram.",
    "Mantenha backup de todos os seus projetos regularmente.",
    "Comunique-se proativamente sobre progresso e possíveis atrasos.",
    "Peça feedback específico aos clientes para melhorar entregas futuras.",
    "Estabeleça um processo claro de revisões para evitar loops infinitos.",
    "Use contratos claros definindo escopo, prazos e entregas.",
    "Celebre as aprovações - reconheça o progresso da equipe.",
    "Aprenda com cada projeto: documente o que funcionou e o que não funcionou.",
    "Invista em relacionamento: clientes satisfeitos indicam novos clientes.",
    "Atualize seu portfólio com seus melhores trabalhos regularmente."
];

export default function DashboardHome() {
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    // Seleciona uma dica aleatória baseada no dia
    const todaysTip = useMemo(() => {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        return dailyTips[dayOfYear % dailyTips.length];
    }, []);

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
                        <button className="quick-action-btn" onClick={() => navigate('/dashboard/projetos')}>
                            <FolderKanban className="w-5 h-5" />
                            <span>Ver Projetos</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate('/dashboard/cronograma')}>
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
                            {todaysTip}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
