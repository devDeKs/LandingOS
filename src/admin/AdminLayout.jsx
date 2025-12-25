import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Users, FolderKanban, UserCog, Settings, Bell,
    Sun, Moon, Menu, X, Search, Shield, LogOut, AlertTriangle,
    Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import '../styles/dashboard.css';

// Navigation structure with sections
const navSections = [
    {
        title: 'Operacional',
        items: [
            { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
            { path: '/admin/revisao', icon: AlertTriangle, label: 'Central de Revisão', badge: 'rejected' },
            { path: '/admin/cards', icon: Briefcase, label: 'Cards' },
            { path: '/admin/projetos', icon: FolderKanban, label: 'Projetos' },
        ]
    },
    {
        title: 'Administrativo',
        items: [
            { path: '/admin/clientes', icon: Users, label: 'CRM Clientes' },
            { path: '/admin/equipe', icon: UserCog, label: 'Equipe' },
            { path: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
        ]
    }
];

export default function AdminLayout() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, userName, signOut } = useAuth();
    const location = useLocation();

    const firstLetter = userName ? userName[0].toUpperCase() : 'A';

    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [rejectedCount, setRejectedCount] = useState(0);

    // Fetch rejected cards count
    const fetchRejectedCount = async () => {
        try {
            const { count, error } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'archived')
                .not('rejected_at', 'is', null)
                .is('deleted_at', null);

            if (!error && count !== null) {
                setRejectedCount(count);
            }
        } catch (err) {
            console.error('Error fetching rejected count:', err);
        }
    };

    useEffect(() => {
        fetchRejectedCount();

        const channel = supabase
            .channel('admin_rejected_count')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
                fetchRejectedCount();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const renderNavItem = (item) => {
        const showBadge = item.badge === 'rejected' && rejectedCount > 0;

        return (
            <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                    `group relative flex items-center h-12 rounded-xl transition-all duration-300 overflow-hidden
                    ${isActive
                        ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/10 text-white shadow-lg shadow-purple-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        {/* Active indicator */}
                        {isActive && (
                            <motion.div
                                layoutId="admin-nav-indicator"
                                className="absolute left-0 w-1 h-8 bg-gradient-to-b from-violet-400 to-fuchsia-500 rounded-full shadow-lg shadow-purple-500/50"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}

                        {/* Fixed icon container - always at same position */}
                        <div className="w-[56px] h-12 flex items-center justify-center flex-shrink-0">
                            <div className="relative">
                                <item.icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-violet-400' : 'group-hover:text-violet-300'}`} />
                                {/* Badge on collapsed */}
                                <AnimatePresence>
                                    {showBadge && !sidebarExpanded && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white shadow-lg shadow-red-500/50"
                                        >
                                            {rejectedCount > 9 ? '9+' : rejectedCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Label with blur animation */}
                        <motion.div
                            initial={false}
                            animate={{
                                opacity: sidebarExpanded ? 1 : 0,
                                filter: sidebarExpanded ? 'blur(0px)' : 'blur(8px)',
                                x: sidebarExpanded ? 0 : -10,
                            }}
                            transition={{
                                duration: 0.25,
                                ease: [0.25, 0.1, 0.25, 1]
                            }}
                            className="flex-1 flex items-center justify-between pr-4 pointer-events-none"
                            style={{
                                visibility: sidebarExpanded ? 'visible' : 'hidden'
                            }}
                        >
                            <span className="text-sm font-medium whitespace-nowrap">
                                {item.label}
                            </span>
                            {showBadge && (
                                <span className="px-2 py-0.5 bg-red-500 rounded-full text-[10px] font-bold text-white shadow-lg shadow-red-500/50">
                                    {rejectedCount}
                                </span>
                            )}
                        </motion.div>
                    </>
                )}
            </NavLink>
        );
    };

    return (
        <div className="dashboard-layout flex min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0B0F] to-[#050505] text-white selection:bg-purple-500/30">

            {/* Ambient Background Lights */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/25 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px]"></div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Admin Glass Sidebar */}
            <motion.aside
                onMouseEnter={() => setSidebarExpanded(true)}
                onMouseLeave={() => setSidebarExpanded(false)}
                initial={false}
                animate={{
                    width: sidebarExpanded ? 280 : 80
                }}
                transition={{
                    duration: 0.35,
                    ease: [0.25, 0.1, 0.25, 1]
                }}
                className={`dashboard-sidebar fixed left-4 top-4 bottom-4 z-50 flex flex-col rounded-2xl border
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}
                    bg-white/5 backdrop-blur-2xl border-white/5 shadow-2xl
                `}
                style={{ overflow: 'hidden' }}
            >
                {/* Admin Badge & Logo */}
                <div className="h-20 relative border-b border-white/5 flex items-center px-4">
                    {/* Fixed Logo Icon */}
                    <div className="w-[48px] h-12 flex items-center justify-center flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {/* Logo Text with blur animation */}
                    <motion.div
                        initial={false}
                        animate={{
                            opacity: sidebarExpanded ? 1 : 0,
                            filter: sidebarExpanded ? 'blur(0px)' : 'blur(8px)',
                            x: sidebarExpanded ? 0 : -10,
                        }}
                        transition={{
                            duration: 0.25,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                        className="ml-3"
                        style={{ visibility: sidebarExpanded ? 'visible' : 'hidden' }}
                    >
                        <span className="text-lg font-bold text-white">Admin</span>
                        <span className="text-xs text-slate-400 block">Painel de Controle</span>
                    </motion.div>
                </div>

                {/* Navigation with Sections */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
                    {navSections.map((section, sectionIndex) => (
                        <div key={section.title}>
                            {/* Section Title with blur animation */}
                            <motion.p
                                initial={false}
                                animate={{
                                    opacity: sidebarExpanded ? 1 : 0,
                                    filter: sidebarExpanded ? 'blur(0px)' : 'blur(8px)',
                                    x: sidebarExpanded ? 0 : -5,
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: [0.25, 0.1, 0.25, 1]
                                }}
                                className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 h-4 ml-[18px]"
                                style={{ visibility: sidebarExpanded ? 'visible' : 'hidden' }}
                            >
                                {section.title}
                            </motion.p>

                            {/* Section Items */}
                            <div className="space-y-1">
                                {section.items.map(renderNavItem)}
                            </div>

                            {/* Divider between sections */}
                            {sectionIndex < navSections.length - 1 && (
                                <div className="my-4 border-t border-white/5" />
                            )}
                        </div>
                    ))}
                </nav>

                {/* Bottom Profile Area */}
                <div className="p-3 mt-auto space-y-2 border-t border-white/5">
                    {/* Logout Button */}
                    <button
                        onClick={signOut}
                        className="w-full flex items-center h-12 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <div className="w-[56px] h-12 flex items-center justify-center flex-shrink-0">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <motion.span
                            initial={false}
                            animate={{
                                opacity: sidebarExpanded ? 1 : 0,
                                filter: sidebarExpanded ? 'blur(0px)' : 'blur(8px)',
                            }}
                            transition={{ duration: 0.25 }}
                            className="text-sm font-medium"
                            style={{ visibility: sidebarExpanded ? 'visible' : 'hidden' }}
                        >
                            Sair
                        </motion.span>
                    </button>

                    {/* Admin Profile */}
                    <div className="flex items-center h-14 rounded-2xl transition-all backdrop-blur-md cursor-pointer bg-white/5 border border-white/5 hover:bg-white/10">
                        <div className="w-[56px] h-14 flex items-center justify-center flex-shrink-0">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full relative">
                                    <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-sm opacity-60"></div>
                                    <div className="relative w-full h-full rounded-full flex items-center justify-center text-sm font-bold bg-[#1a1a2e] text-violet-400 border-2 border-violet-500/50">
                                        {firstLetter}
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0B0B0F] rounded-full"></div>
                            </div>
                        </div>

                        <motion.div
                            initial={false}
                            animate={{
                                opacity: sidebarExpanded ? 1 : 0,
                                filter: sidebarExpanded ? 'blur(0px)' : 'blur(8px)',
                            }}
                            transition={{ duration: 0.25 }}
                            className="flex-1 min-w-0 pr-3"
                            style={{ visibility: sidebarExpanded ? 'visible' : 'hidden' }}
                        >
                            <p className="text-sm font-bold truncate text-white">{userName}</p>
                            <p className="text-xs truncate text-violet-400">Administrador</p>
                        </motion.div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <motion.div
                className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10 lg:ml-[100px]"
                initial={false}
                animate={{
                    marginLeft: sidebarExpanded ? 300 : 100
                }}
                transition={{
                    duration: 0.35,
                    ease: [0.25, 0.1, 0.25, 1]
                }}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-30 px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/5">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-xl relative hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar clientes, projetos..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            {/* Rejected Alert Badge */}
                            {rejectedCount > 0 && (
                                <NavLink
                                    to="/admin/revisao"
                                    className="relative p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20"
                                >
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                                        {rejectedCount > 9 ? '9+' : rejectedCount}
                                    </span>
                                </NavLink>
                            )}

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-400" />}
                            </button>

                            {/* Notifications */}
                            <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                <Bell className="w-5 h-5 text-slate-400" />
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-violet-500 rounded-full border-2 border-[#0B0B0F]"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 px-4 lg:px-6 pb-6 overflow-auto">
                    <Outlet />
                </main>
            </motion.div>
        </div>
    );
}
