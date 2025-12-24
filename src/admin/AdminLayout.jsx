import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Users, FolderKanban, UserCog, Settings, Bell,
    Sun, Moon, Menu, X, Search, Shield, ChevronRight, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/dashboard.css';

const adminNavItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/admin/clientes', icon: Users, label: 'Clientes' },
    { path: '/admin/projetos', icon: FolderKanban, label: 'Projetos' },
    { path: '/admin/equipe', icon: UserCog, label: 'Equipe' },
    { path: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function AdminLayout() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, userName, signOut } = useAuth();

    const firstLetter = userName ? userName[0].toUpperCase() : 'A';

    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="dashboard-layout flex min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0B0F] to-[#050505] text-white selection:bg-purple-500/30">

            {/* Ambient Background Lights - Admin uses more purple/red tones */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/25 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px]"></div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Admin Glass Sidebar */}
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
                    bg-white/5 backdrop-blur-2xl border-white/5 shadow-2xl
                `}
            >
                {/* Admin Badge & Logo */}
                <div className="flex items-center justify-center h-24 relative">
                    <AnimatePresence mode="wait">
                        {sidebarExpanded ? (
                            <motion.div
                                key="admin-logo"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className="text-lg font-bold text-white">Admin</span>
                                    <span className="text-xs text-slate-400 block">Painel de Controle</span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="admin-icon"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
                            >
                                <Shield className="w-5 h-5 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col justify-center gap-2 px-3">
                    {adminNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `group relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300
                                ${isActive
                                    ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/10 text-white shadow-lg shadow-purple-500/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }
                                ${!sidebarExpanded ? 'justify-center' : ''}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="admin-nav-indicator"
                                            className="absolute left-0 w-1 h-8 bg-gradient-to-b from-violet-400 to-fuchsia-500 rounded-full shadow-lg shadow-purple-500/50"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                    <item.icon className={`w-5 h-5 transition-all ${isActive ? 'text-violet-400' : 'group-hover:text-violet-300'}`} />
                                    <AnimatePresence>
                                        {sidebarExpanded && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-sm font-medium whitespace-nowrap"
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
                <div className="p-4 mt-auto space-y-3">
                    {/* Logout Button */}
                    <button
                        onClick={signOut}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all
                            ${!sidebarExpanded ? 'justify-center' : ''}`}
                    >
                        <LogOut className="w-5 h-5" />
                        <AnimatePresence>
                            {sidebarExpanded && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-sm font-medium"
                                >
                                    Sair
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Admin Profile */}
                    <div className={`p-3 rounded-2xl flex items-center gap-3 transition-all backdrop-blur-md cursor-pointer
                        bg-white/5 border border-white/5 hover:bg-white/10
                        ${!sidebarExpanded ? 'justify-center' : ''}`}
                    >
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full relative">
                                <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-sm opacity-60"></div>
                                <div className="relative w-full h-full rounded-full flex items-center justify-center text-sm font-bold bg-[#1a1a2e] text-violet-400 border-2 border-violet-500/50">
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
                                    <p className="text-sm font-bold truncate text-white">{userName}</p>
                                    <p className="text-xs truncate text-violet-400">Administrador</p>
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
            >
                {/* Top Header */}
                <header className="sticky top-0 z-30 px-6 py-4">
                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/5">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-xl relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar clientes, projetos..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
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
                <main className="flex-1 px-6 pb-6 overflow-auto">
                    <Outlet />
                </main>
            </motion.div>
        </div>
    );
}
