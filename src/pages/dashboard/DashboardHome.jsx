import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FolderKanban, Clock, CheckCircle2, AlertCircle,
    ArrowUpRight, RefreshCw, Calendar, MessageSquare,
    Settings, Loader2, Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

// 50 daily tips
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
    "Documente todas as aprovações para evitar mal-entendidos.",
    "Use o cronograma para visualizar deadlines e evitar atrasos.",
    "Faça check-ins regulares para manter alinhamento.",
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
    "Integre com redes sociais para ampliar o alcance.",
    "Use remarketing para recuperar visitantes que não converteram.",
    "Mantenha backup de todos os seus projetos regularmente.",
    "Comunique-se proativamente sobre progresso e possíveis atrasos.",
    "Peça feedback específico para melhorar entregas futuras.",
    "Estabeleça um processo claro de revisões para evitar loops infinitos.",
    "Use contratos claros definindo escopo, prazos e entregas.",
    "Celebre as aprovações - reconheça o progresso da equipe.",
    "Aprenda com cada projeto: documente o que funcionou e o que não funcionou.",
    "Invista em relacionamento: clientes satisfeitos indicam novos clientes.",
    "Atualize seu portfólio com seus melhores trabalhos regularmente."
];

export default function DashboardHome() {
    const navigate = useNavigate();
    const { user, userName } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    // Real data states
    const [stats, setStats] = useState({
        totalProjects: 0,
        inProgress: 0,
        pendingApproval: 0,
        completed: 0,
        projectsThisMonth: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    // Daily tip based on day
    const todaysTip = useMemo(() => {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        return dailyTips[dayOfYear % dailyTips.length];
    }, []);

    // Format time ago helper
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

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        if (!user) return;

        setLoading(true);
        try {
            // Get current month boundaries
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            // Fetch user's projects/cards
            const { data: projects, error } = await supabase
                .from('projects')
                .select('id, name, status, created_at, updated_at, category')
                .eq('client_id', user.id)
                .is('deleted_at', null)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            const allProjects = projects || [];

            // Calculate stats
            const inProgress = allProjects.filter(p =>
                p.status === 'in_progress' || p.status === 'draft'
            ).length;
            const pendingApproval = allProjects.filter(p =>
                p.status === 'pending_approval'
            ).length;
            const completed = allProjects.filter(p =>
                p.status === 'active' || p.status === 'completed'
            ).length;
            const projectsThisMonth = allProjects.filter(p =>
                p.created_at >= monthStart
            ).length;

            setStats({
                totalProjects: allProjects.length,
                inProgress,
                pendingApproval,
                completed,
                projectsThisMonth
            });

            // Build recent activity
            const activityItems = allProjects.slice(0, 5).map(project => {
                let icon, color, bg, message;

                switch (project.status) {
                    case 'active':
                    case 'completed':
                        icon = CheckCircle2;
                        color = 'text-emerald-400';
                        bg = 'bg-emerald-500/10';
                        message = `"${project.name}" foi aprovado`;
                        break;
                    case 'pending_approval':
                        icon = AlertCircle;
                        color = 'text-amber-400';
                        bg = 'bg-amber-500/10';
                        message = `"${project.name}" aguarda sua aprovação`;
                        break;
                    case 'in_progress':
                        icon = Clock;
                        color = 'text-blue-400';
                        bg = 'bg-blue-500/10';
                        message = `"${project.name}" em desenvolvimento`;
                        break;
                    default:
                        icon = FolderKanban;
                        color = 'text-violet-400';
                        bg = 'bg-violet-500/10';
                        message = `"${project.name}" atualizado`;
                }

                return {
                    id: project.id,
                    icon,
                    color,
                    bg,
                    message,
                    category: project.category || 'Projeto',
                    time: formatTimeAgo(project.updated_at)
                };
            });

            setRecentActivity(activityItems);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
            setIsLoaded(true);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    // Stats cards config
    const statsCards = [
        {
            label: 'Meus Projetos',
            value: stats.totalProjects,
            change: stats.projectsThisMonth > 0 ? `+${stats.projectsThisMonth} este mês` : 'Total',
            positive: stats.projectsThisMonth > 0,
            icon: FolderKanban,
            color: 'from-violet-500 to-purple-600'
        },
        {
            label: 'Em Andamento',
            value: stats.inProgress,
            change: 'Em desenvolvimento',
            positive: true,
            icon: Clock,
            color: 'from-amber-500 to-orange-600'
        },
        {
            label: 'Aguardando Aprovação',
            value: stats.pendingApproval,
            change: stats.pendingApproval > 0 ? 'Requer ação' : 'Nenhum pendente',
            positive: stats.pendingApproval === 0,
            icon: AlertCircle,
            color: 'from-rose-500 to-pink-600'
        },
        {
            label: 'Concluídos',
            value: stats.completed,
            change: 'Aprovados',
            positive: true,
            icon: CheckCircle2,
            color: 'from-emerald-500 to-teal-600'
        },
    ];

    // Quick actions config
    const quickActions = [
        { label: 'Ver Projetos', icon: FolderKanban, path: '/dashboard/projetos', color: 'text-violet-400' },
        { label: 'Cronograma', icon: Calendar, path: '/dashboard/cronograma', color: 'text-blue-400' },
        { label: 'Mensagens', icon: MessageSquare, path: '/dashboard/mensagens', color: 'text-emerald-400' },
        { label: 'Configurações', icon: Settings, path: '/dashboard/configuracoes', color: 'text-slate-400' },
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
                        <h1
                            className="text-2xl md:text-3xl font-normal text-white"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            <span className="bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                                Bem-vindo de volta, {userName || 'Usuário'}
                            </span>{' '}👋
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400"
                    >
                        Aqui está um resumo dos seus projetos
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white disabled:opacity-50 self-start md:self-auto"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="relative p-5 md:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.1] transition-all group"
                    >
                        <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg opacity-80`}>
                            <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <p className="text-2xl md:text-3xl text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stat.value}
                        </p>
                        <p className="text-sm text-slate-400 mb-3">{stat.label}</p>
                        <div className={`flex items-center gap-1 text-xs md:text-sm ${stat.positive ? 'text-emerald-400' : 'text-amber-400'}`}>
                            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
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
                    className="lg:col-span-2 p-5 md:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Atividade Recente</h2>
                        <button
                            onClick={() => navigate('/dashboard/projetos')}
                            className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            Ver Todos →
                        </button>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                            </div>
                        ) : recentActivity.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <FolderKanban className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Nenhuma atividade recente</p>
                                <p className="text-xs text-slate-600 mt-1">Seus projetos aparecerão aqui</p>
                            </div>
                        ) : (
                            recentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    onClick={() => navigate('/dashboard/projetos')}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
                                >
                                    <div className={`p-2.5 rounded-lg ${activity.bg}`}>
                                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{activity.message}</p>
                                        <p className="text-xs text-slate-500">{activity.category}</p>
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Quick Actions + Tip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="lg:col-span-1 space-y-6"
                >
                    {/* Quick Actions */}
                    <div className="p-5 md:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
                        <h2 className="text-lg font-bold text-white mb-4">Ações Rápidas</h2>
                        <div className="space-y-2">
                            {quickActions.map((action, index) => (
                                <motion.button
                                    key={action.label}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    onClick={() => navigate(action.path)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all text-left group"
                                >
                                    <action.icon className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-sm text-white">{action.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Tip of the Day */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-5 h-5 text-amber-400" />
                            <h3 className="text-sm font-semibold text-white">Dica do dia</h3>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {todaysTip}
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
