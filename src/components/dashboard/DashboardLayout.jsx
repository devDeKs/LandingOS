import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Kanban, Image, MessageSquare, Calendar, Bell, Settings,
    Sun, Moon, Menu, X, Search, CheckCircle2, Upload, AlertCircle, Clock, Check, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/dashboard.css';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/dashboard/projetos', icon: Kanban, label: 'Projetos' },
    { path: '/dashboard/midia', icon: Image, label: 'Biblioteca de Mídia' },
    { path: '/dashboard/mensagens', icon: MessageSquare, label: 'Mensagens' },
    { path: '/dashboard/cronograma', icon: Calendar, label: 'Cronograma' },
    { path: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function DashboardLayout() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { isNotificationEnabled } = useSettings();
    const { user, userName } = useAuth();

    // Get first letter for avatar
    const firstLetter = userName ? userName[0].toUpperCase() : 'U';

    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [expandedNotif, setExpandedNotif] = useState(null);

    // Mock Notifications Data
    const [allNotifications, setAllNotifications] = useState([
        {
            id: 1,
            title: 'Projeto Aprovado',
            message: 'Dr. Marcus aprovou a Hero Section da landing page. Você pode prosseguir com o desenvolvimento.',
            time: 'Há 2 horas',
            read: false,
            icon: CheckCircle2,
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.1)',
            categoryId: 'approvals'
        },
        {
            id: 2,
            title: 'Novo Comentário',
            message: 'O cliente deixou feedback sobre o design da seção de preços. Confira as sugestões.',
            time: 'Há 4 horas',
            read: false,
            icon: MessageSquare,
            color: '#8b5cf6',
            bg: 'rgba(139, 92, 246, 0.1)',
            categoryId: 'comments'
        },
        {
            id: 3,
            title: 'Prazo Próximo',
            message: 'A entrega do projeto Consult Pro está agendada para daqui a 2 dias.',
            time: 'Há 1 dia',
            read: true,
            icon: Clock,
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.1)',
            categoryId: 'deadlines'
        },
        {
            id: 4,
            title: 'Atenção Necessária',
            message: 'O cliente JM Advogados solicitou uma revisão urgente na seção de contato. Por favor, verifique o mais rápido possível.',
            time: 'Há 2 dias',
            read: true,
            icon: AlertCircle,
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.1)',
            categoryId: 'deadlines'
        }
    ]);

    // Filtrar notificações com base nas configurações
    const notifications = allNotifications.filter(n => isNotificationEnabled(n.categoryId));
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setAllNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAllNotifications = () => {
        setAllNotifications([]);
    };

    const toggleExpand = (id) => {
        setExpandedNotif(expandedNotif === id ? null : id);
    };

    return (
        <div className="dashboard-layout flex min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0B0F] to-[#050505] text-white selection:bg-purple-500/30">

            {/* Ambient Background Lights */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Premium Glass Sidebar */}
            <motion.aside
                onMouseEnter={() => setSidebarExpanded(true)}
                onMouseLeave={() => setSidebarExpanded(false)}
                initial={false}
                animate={{
                    width: sidebarExpanded ? 280 : 80
                }}
                transition={{
                    duration: sidebarExpanded ? 0.4 : 0.3,
                    ease: [0.22, 1, 0.36, 1]
                }}
                className={`dashboard-sidebar fixed left-4 top-4 bottom-4 z-50 flex flex-col overflow-hidden rounded-2xl border transition-all duration-300
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}
                    ${isDarkMode
                        ? 'bg-white/5 backdrop-blur-2xl border-white/5 shadow-2xl'
                        : 'bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-lg'
                    }
                `}
            >
                {/* Logo Area */}
                <div className="flex items-center justify-center h-24 relative">
                    <AnimatePresence mode="wait">
                        {sidebarExpanded ? (
                            <motion.img
                                key="full-logo"
                                src="/logo.png"
                                alt="LandingOS"
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={`h-10 w-auto object-contain dashboard-logo ${!isDarkMode ? 'brightness-0 invert-0 opacity-80' : ''}`}
                            />
                        ) : (
                            <motion.div
                                key="icon-logo"
                                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                transition={{ duration: 0.3, ease: "backOut" }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors
                                    ${isDarkMode ? 'bg-white shadow-purple-500/20' : 'bg-slate-900 shadow-slate-900/20'}
                                `}
                            >
                                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                    <circle cx="16" cy="18" r="2.5" fill={isDarkMode ? "#0A0A0B" : "#FFFFFF"} />
                                    <circle cx="32" cy="18" r="2.5" fill={isDarkMode ? "#0A0A0B" : "#FFFFFF"} />
                                    <path d="M24 22 Q22 24 20 24" stroke={isDarkMode ? "#0A0A0B" : "#FFFFFF"} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                    <path d="M18 27 Q24 32 30 27" stroke={isDarkMode ? "#0A0A0B" : "#FFFFFF"} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `relative flex items-center px-3 py-3 rounded-xl transition-all duration-300 group
                                ${isActive
                                    ? isDarkMode
                                        ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                                        : 'bg-white text-slate-900 shadow-md shadow-slate-200/50 ring-1 ring-slate-200'
                                    : isDarkMode
                                        ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full blur-[2px]
                                            ${isDarkMode ? 'bg-purple-500' : 'bg-purple-600'}
                                        `}></div>
                                    )}
                                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300
                                        ${isActive
                                            ? isDarkMode ? 'scale-110 text-purple-300' : 'scale-110 text-purple-600'
                                            : 'group-hover:scale-110'
                                        }
                                    `} />

                                    <AnimatePresence>
                                        {sidebarExpanded && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="ml-3 font-medium text-sm whitespace-nowrap"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Profile Area */}
                <div className="p-4 mt-auto">
                    <div className={`p-3 rounded-2xl flex items-center gap-3 transition-all backdrop-blur-md cursor-pointer group
                        ${isDarkMode
                            ? 'bg-white/5 border border-white/5 hover:bg-white/10'
                            : 'bg-white/50 border border-slate-200 hover:bg-white hover:shadow-md'
                        }
                        ${!sidebarExpanded ? 'justify-center' : ''}`}
                    >
                        <div className="relative">
                            {/* Neon Avatar */}
                            <div className="w-9 h-9 rounded-full relative">
                                {/* Glow effect */}
                                <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-sm opacity-60"></div>
                                {/* Avatar circle */}
                                <div className={`relative w-full h-full rounded-full flex items-center justify-center text-sm font-bold
                                    ${isDarkMode ? 'bg-[#1a1a2e] text-purple-400' : 'bg-slate-100 text-purple-600'}
                                    border-2 border-purple-500/50`}
                                >
                                    {firstLetter}
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0B0B0F] rounded-full"></div>
                        </div>

                        <AnimatePresence>
                            {sidebarExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="flex-1 min-w-0 overflow-hidden"
                                >
                                    <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{userName}</p>
                                    <p className={`text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{user?.email?.split('@')[0] || 'User'}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <motion.div
                className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10"
                animate={{
                    marginLeft: sidebarExpanded ? 300 : 100
                }}
                transition={{
                    duration: sidebarExpanded ? 0.4 : 0.3,
                    ease: [0.22, 1, 0.36, 1]
                }}
                style={{
                    padding: '24px'
                }}
            >
                {/* Floating Top Bar */}
                <header className="flex items-center justify-between gap-6 mb-8 px-2">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-full glass-btn text-[var(--dash-text-secondary)]"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Search Bar - Glass Style */}
                        <div className="search-input-wrapper flex items-center w-full max-w-md h-14 px-6 gap-3">
                            <Search className="w-5 h-5 text-[var(--dash-text-muted)]" />
                            <input
                                type="text"
                                placeholder="Busque por projetos, tarefas..."
                                className="bg-transparent border-none outline-none text-sm w-full text-[var(--dash-text-primary)] placeholder-[var(--dash-text-muted)]"
                            />
                        </div>
                    </div>

                    {/* Right Actions - Glass Style */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="glass-btn w-12 h-12 rounded-full flex items-center justify-center"
                        >
                            {isDarkMode ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="glass-btn w-12 h-12 rounded-full flex items-center justify-center relative"
                            >
                                <Bell className="w-5 h-5 text-[var(--dash-text-secondary)]" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 border border-[var(--dash-bg-primary)]"></span>
                                )}
                            </button>

                            {/* Notifications Popover */}
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-14 w-80 md:w-96 bg-[var(--dash-card-bg)] backdrop-blur-xl border border-[var(--dash-card-border)] rounded-2xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                            <h3 className="font-semibold text-[var(--dash-text-primary)]">Notificações</h3>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={markAllRead}
                                                    className="text-xs text-[var(--dash-accent)] hover:text-[var(--dash-accent-light)] flex items-center gap-1 transition-colors"
                                                >
                                                    <Check className="w-3 h-3" />
                                                    Lidas
                                                </button>
                                                <button
                                                    onClick={clearAllNotifications}
                                                    className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Limpar
                                                </button>
                                            </div>
                                        </div>

                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {notifications.length > 0 ? (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => toggleExpand(notif.id)}
                                                        className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notif.read ? 'bg-[var(--dash-accent-bg)]/30' : ''}`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div
                                                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                                style={{ backgroundColor: notif.bg, color: notif.color }}
                                                            >
                                                                <notif.icon className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <h4 className={`text-sm font-medium ${!notif.read ? 'text-[var(--dash-text-primary)]' : 'text-[var(--dash-text-secondary)]'}`}>
                                                                        {notif.title}
                                                                    </h4>
                                                                    <span className="text-[10px] text-[var(--dash-text-muted)] whitespace-nowrap ml-2">
                                                                        {notif.time}
                                                                    </span>
                                                                </div>
                                                                <p className={`text-xs text-[var(--dash-text-secondary)] leading-relaxed ${expandedNotif === notif.id ? '' : 'line-clamp-2'}`}>
                                                                    {notif.message}
                                                                </p>
                                                                {expandedNotif !== notif.id && notif.message.length > 60 && (
                                                                    <span className="text-[10px] text-[var(--dash-accent)] mt-1 block">
                                                                        Ver mais
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-[var(--dash-text-muted)]">
                                                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                                    <p className="text-sm">Nenhuma notificação</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Content Render */}
                <main className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <Outlet />
                </main>
            </motion.div>

            {/* Mobile Sidebar Styles */}
            <style>{`
                @media (max-width: 1024px) {
                    .dashboard-layout > div:nth-child(2) {
                        margin-left: 0 !important;
                        padding: 16px !important;
                    }
                }
            `}</style>
        </div >
    );
}
