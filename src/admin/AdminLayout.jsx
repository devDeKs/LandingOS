import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useAdminNotifications } from '../context/AdminNotificationContext';
import {
    LayoutDashboard, Users, FolderKanban, UserCog, Settings, Bell,
    Sun, Moon, Menu, X, Search, Shield, LogOut, AlertTriangle,
    Briefcase, Check, Trash2, MessageCircle
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
            { path: '/admin/mensagens', icon: MessageCircle, label: 'Mensagens' },
        ]
    },
    {
        title: 'Administrativo',
        items: [
            { path: '/admin/clientes', icon: Users, label: 'Clientes' },
            { path: '/admin/equipe', icon: UserCog, label: 'Equipe' },
            { path: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
        ]
    }
];

export default function AdminLayout() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, userName, signOut, userProfile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const firstLetter = userName ? userName[0].toUpperCase() : 'A';

    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [expandedNotif, setExpandedNotif] = useState(null);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searching, setSearching] = useState(false);

    // Admin Notifications
    const { notifications, unreadCount, markAllRead, clearAll } = useAdminNotifications();

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
        setShowSearchResults(false);
        setSearchQuery('');
    }, [location.pathname]);

    // Debounced search function
    const performSearch = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        setSearching(true);
        setShowSearchResults(true);

        try {
            const results = [];

            // Search clients
            const { data: clients } = await supabase
                .from('profiles')
                .select('id, full_name, email, project_name')
                .is('deleted_at', null)
                .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,project_name.ilike.%${query}%`)
                .limit(5);

            (clients || []).forEach(c => {
                results.push({
                    type: 'client',
                    icon: 'Users',
                    title: c.full_name || c.email,
                    subtitle: c.project_name || c.email,
                    path: '/admin/clientes'
                });
            });

            // Search cards/projects
            const { data: cards } = await supabase
                .from('projects')
                .select('id, name, category, status')
                .is('deleted_at', null)
                .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
                .limit(5);

            (cards || []).forEach(c => {
                results.push({
                    type: 'card',
                    icon: 'Briefcase',
                    title: c.name,
                    subtitle: c.category || c.status,
                    path: '/admin/cards'
                });
            });

            // Search navigation items
            const navMatches = [];
            navSections.forEach(section => {
                section.items.forEach(item => {
                    if (item.label.toLowerCase().includes(query.toLowerCase())) {
                        navMatches.push({
                            type: 'page',
                            icon: 'LayoutDashboard',
                            title: item.label,
                            subtitle: section.title,
                            path: item.path
                        });
                    }
                });
            });
            results.push(...navMatches);

            // Search settings
            const settingsKeywords = ['configurações', 'exportar', 'backup', 'senha', 'equipe', 'notificações'];
            settingsKeywords.forEach(keyword => {
                if (keyword.includes(query.toLowerCase())) {
                    results.push({
                        type: 'setting',
                        icon: 'Settings',
                        title: keyword.charAt(0).toUpperCase() + keyword.slice(1),
                        subtitle: 'Configurações',
                        path: '/admin/configuracoes'
                    });
                }
            });

            setSearchResults(results.slice(0, 8));
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setSearching(false);
        }
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, performSearch]);

    const handleSearchResultClick = (result) => {
        navigate(result.path);
        setShowSearchResults(false);
        setSearchQuery('');
    };

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
                        ? 'bg-white/[0.06] text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        {/* Active indicator */}
                        {isActive && (
                            <motion.div
                                layoutId="admin-nav-indicator"
                                className="absolute left-0 w-1 h-8 bg-gradient-to-b from-violet-400/80 to-fuchsia-500/80 rounded-full"
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
        <div className="dashboard-layout flex min-h-screen relative overflow-hidden bg-[#030014] text-white selection:bg-purple-500/30">

            {/* Ambient Background Lights - Softer, like landing page */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
                <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] bg-fuchsia-600/8 rounded-full blur-[120px] mix-blend-screen"></div>
                <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[100px]"></div>
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
                    bg-white/[0.02] backdrop-blur-2xl border-white/[0.04] shadow-2xl
                `}
                style={{ overflow: 'hidden' }}
            >
                {/* Logo Area */}
                <div className="h-24 relative border-b border-white/5 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {sidebarExpanded ? (
                            <motion.div
                                key="full-logo"
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="flex flex-col items-center"
                            >
                                <img
                                    src="/logo.png"
                                    alt="LandingOS"
                                    className="h-10 w-auto object-contain"
                                />
                                <span className="text-xs text-slate-400 mt-1">Painel de Controle</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="icon-logo"
                                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                transition={{ duration: 0.3, ease: "backOut" }}
                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg shadow-purple-500/20"
                            >
                                {/* Landi Face SVG - White background with dark face */}
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
                                    <div className="relative w-full h-full rounded-full flex items-center justify-center text-sm font-bold bg-[#1a1a2e] text-violet-400 border-2 border-violet-500/50 overflow-hidden">
                                        {userProfile?.avatar_url ? (
                                            <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            firstLetter
                                        )}
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
                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.04]">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-xl relative hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                placeholder="Buscar clientes, projetos, configurações..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                            />

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {showSearchResults && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f17] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                    >
                                        {searching ? (
                                            <div className="p-4 text-center text-slate-400 text-sm">
                                                Buscando...
                                            </div>
                                        ) : searchResults.length === 0 ? (
                                            <div className="p-4 text-center text-slate-500 text-sm">
                                                {searchQuery.length < 2 ? 'Digite ao menos 2 caracteres' : 'Nenhum resultado encontrado'}
                                            </div>
                                        ) : (
                                            <div className="max-h-80 overflow-y-auto">
                                                {searchResults.map((result, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSearchResultClick(result)}
                                                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                                                    >
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${result.type === 'client' ? 'bg-emerald-500/10' :
                                                            result.type === 'card' ? 'bg-violet-500/10' :
                                                                result.type === 'page' ? 'bg-blue-500/10' :
                                                                    'bg-amber-500/10'
                                                            }`}>
                                                            {result.type === 'client' && <Users className="w-4 h-4 text-emerald-400" />}
                                                            {result.type === 'card' && <Briefcase className="w-4 h-4 text-violet-400" />}
                                                            {result.type === 'page' && <LayoutDashboard className="w-4 h-4 text-blue-400" />}
                                                            {result.type === 'setting' && <Settings className="w-4 h-4 text-amber-400" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-white truncate">{result.title}</p>
                                                            <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                                                        </div>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${result.type === 'client' ? 'bg-emerald-500/10 text-emerald-400' :
                                                            result.type === 'card' ? 'bg-violet-500/10 text-violet-400' :
                                                                result.type === 'page' ? 'bg-blue-500/10 text-blue-400' :
                                                                    'bg-amber-500/10 text-amber-400'
                                                            }`}>
                                                            {result.type === 'client' ? 'Cliente' :
                                                                result.type === 'card' ? 'Card' :
                                                                    result.type === 'page' ? 'Página' : 'Config'}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <Bell className="w-5 h-5 text-slate-400" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-violet-500 rounded-full border-2 border-[#0B0B0F]"></span>
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
                                            className="absolute right-0 top-14 w-80 md:w-96 bg-[#12121a] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                                <h3 className="font-semibold text-white">Notificações</h3>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={markAllRead}
                                                        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Lidas
                                                    </button>
                                                    <button
                                                        onClick={clearAll}
                                                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Limpar
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="max-h-[400px] overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notif) => (
                                                        <div
                                                            key={notif.id}
                                                            onClick={() => setExpandedNotif(expandedNotif === notif.id ? null : notif.id)}
                                                            className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notif.read ? 'bg-violet-500/5' : ''}`}
                                                        >
                                                            <div className="flex gap-3">
                                                                <div
                                                                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                                                    style={{ backgroundColor: notif.bg, color: notif.color }}
                                                                >
                                                                    <notif.icon className="w-4 h-4" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <h4 className={`text-sm font-medium ${!notif.read ? 'text-white' : 'text-slate-400'}`}>
                                                                            {notif.title}
                                                                        </h4>
                                                                        <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                                                                            {notif.time}
                                                                        </span>
                                                                    </div>
                                                                    <p className={`text-xs text-slate-500 leading-relaxed ${expandedNotif === notif.id ? '' : 'line-clamp-2'}`}>
                                                                        {notif.message}
                                                                    </p>
                                                                    {expandedNotif !== notif.id && notif.message.length > 60 && (
                                                                        <span className="text-[10px] text-violet-400 mt-1 block">
                                                                            Ver mais
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-8 text-center text-slate-500">
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
