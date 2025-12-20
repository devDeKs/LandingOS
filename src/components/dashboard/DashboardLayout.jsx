import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
    LayoutDashboard, Kanban, Image, MessageSquare, Calendar, Bell, Settings,
    Sun, Moon, Menu, X, Search, CheckCircle2, Upload, AlertCircle, Clock, Check
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
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [expandedNotif, setExpandedNotif] = useState(null);

    // Mock Notifications Data
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Projeto Aprovado',
            message: 'Dr. Marcus aprovou a Hero Section da landing page. Você pode prosseguir com o desenvolvimento.',
            time: 'Há 2 horas',
            read: false,
            icon: CheckCircle2,
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.1)'
        },
        {
            id: 2,
            title: 'Novo Comentário',
            message: 'O cliente deixou feedback sobre o design da seção de preços. Confira as sugestões.',
            time: 'Há 4 horas',
            read: false,
            icon: MessageSquare,
            color: '#8b5cf6',
            bg: 'rgba(139, 92, 246, 0.1)'
        },
        {
            id: 3,
            title: 'Prazo Próximo',
            message: 'A entrega do projeto Consult Pro está agendada para daqui a 2 dias.',
            time: 'Há 1 dia',
            read: true,
            icon: Clock,
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.1)'
        },
        {
            id: 4,
            title: 'Atenção Necessária',
            message: 'O cliente JM Advogados solicitou uma revisão urgente na seção de contato. Por favor, verifique o mais rápido possível.',
            time: 'Há 2 dias',
            read: true,
            icon: AlertCircle,
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.1)'
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const toggleExpand = (id) => {
        setExpandedNotif(expandedNotif === id ? null : id);
    };

    return (
        <div className="dashboard-layout flex min-h-screen relative overflow-hidden">

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Floating Sidebar - Colapsável */}
            <motion.aside
                onMouseEnter={() => setSidebarExpanded(true)}
                onMouseLeave={() => setSidebarExpanded(false)}
                initial={false}
                animate={{
                    width: sidebarExpanded ? 288 : 80
                }}
                transition={{
                    duration: sidebarExpanded ? 0.3 : 0.15,
                    ease: "easeInOut"
                }}
                className={`dashboard-sidebar fixed left-0 top-0 h-screen z-50 flex flex-col overflow-hidden
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{
                    margin: '0',
                    boxShadow: '4px 0 24px 0 rgba(0, 0, 0, 0.2)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                {/* Logo Area */}
                <div className="flex items-center justify-center h-24 border-b border-white/5 mx-4 relative">
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
                                className="h-10 w-auto object-contain dashboard-logo"
                            />
                        ) : (
                            <motion.div
                                key="icon-logo"
                                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                transition={{ duration: 0.3, ease: "backOut" }}
                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg shadow-purple-500/20"
                            >
                                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                    <circle cx="16" cy="18" r="2.5" fill="#0A0A0B" />
                                    <circle cx="32" cy="18" r="2.5" fill="#0A0A0B" />
                                    <path d="M24 22 Q22 24 20 24" stroke="#0A0A0B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                    <path d="M18 27 Q24 32 30 27" stroke="#0A0A0B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
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
                                `nav-item ${isActive ? 'active' : ''} ${!sidebarExpanded ? 'collapsed' : ''} overflow-hidden`
                            }
                            title={!sidebarExpanded ? item.label : undefined}
                        >
                            <item.icon className="w-6 h-6 flex-shrink-0 transition-colors" />
                            <AnimatePresence mode="wait">
                                {sidebarExpanded && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10, filter: "blur(5px)" }}
                                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, x: -10, filter: "blur(5px)", transition: { duration: 0.1 } }}
                                        transition={{ duration: 0.3, delay: 0.05 }}
                                        className="font-medium text-[15px] nav-label whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Profile Area */}
                <div className="p-4 mt-auto">
                    <div className={`p-3 rounded-2xl bg-[var(--dash-bg-tertiary)] flex items-center gap-3 transition-all
                        ${!sidebarExpanded ? 'justify-center' : ''}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 p-[2px] flex-shrink-0">
                            <div className="w-full h-full rounded-full bg-[var(--dash-bg-primary)] flex items-center justify-center">
                                <span className="font-bold text-[var(--dash-text-primary)]">JS</span>
                            </div>
                        </div>

                        <AnimatePresence>
                            {sidebarExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, width: "auto", filter: "blur(0px)" }}
                                    exit={{ opacity: 0, width: 0, filter: "blur(5px)", transition: { duration: 0.1 } }}
                                    transition={{ duration: 0.3, delay: 0.05 }}
                                    className="flex-1 min-w-0 nav-label overflow-hidden whitespace-nowrap"
                                >
                                    <p className="text-sm font-bold truncate">João Silva</p>
                                    <p className="text-xs text-[var(--dash-text-muted)] truncate">Admin</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <motion.div
                className="flex-1 flex flex-col min-w-0 min-h-screen"
                animate={{
                    marginLeft: sidebarExpanded ? 288 : 80
                }}
                transition={{
                    duration: sidebarExpanded ? 0.3 : 0.15,
                    ease: "easeInOut"
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
                                            <button
                                                onClick={markAllRead}
                                                className="text-xs text-[var(--dash-accent)] hover:text-[var(--dash-accent-light)] flex items-center gap-1 transition-colors"
                                            >
                                                <Check className="w-3 h-3" />
                                                Marcar lidas
                                            </button>
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
