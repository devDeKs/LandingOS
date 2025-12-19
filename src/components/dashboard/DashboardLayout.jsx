import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
    LayoutDashboard, Kanban, Image, MessageSquare, Calendar, Bell, Settings,
    Sun, Moon, Menu, X, Search
} from 'lucide-react';
import '../../styles/dashboard.css';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/dashboard/projetos', icon: Kanban, label: 'Projetos' },
    { path: '/dashboard/midia', icon: Image, label: 'Biblioteca de Mídia' },
    { path: '/dashboard/mensagens', icon: MessageSquare, label: 'Mensagens' },
    { path: '/dashboard/cronograma', icon: Calendar, label: 'Cronograma' },
    { path: '/dashboard/notificacoes', icon: Bell, label: 'Notificações' },
    { path: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function DashboardLayout() {
    const { isDarkMode, toggleTheme } = useTheme();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <aside
                onMouseEnter={() => setSidebarExpanded(true)}
                onMouseLeave={() => setSidebarExpanded(false)}
                className={`dashboard-sidebar sidebar-transition fixed left-5 top-5 bottom-5 z-50 flex flex-col
                    ${sidebarExpanded ? 'w-72' : 'w-20'}
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{
                    borderRadius: '24px',
                    margin: '0',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                {/* Logo Area */}
                <div className="flex items-center justify-center h-24 border-b border-white/5 mx-4">
                    {sidebarExpanded ? (
                        <img
                            src="/logo.png"
                            alt="LandingOS"
                            className="h-10 w-auto object-contain dashboard-logo"
                        />
                    ) : (
                        <span
                            className="text-2xl font-bold tracking-tight transition-colors duration-300"
                            style={{
                                color: 'var(--dash-text-primary)',
                                fontFamily: "'Outfit', sans-serif"
                            }}
                        >
                            LS
                        </span>
                    )}
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
                                `nav-item ${isActive ? 'active' : ''} ${!sidebarExpanded ? 'collapsed' : ''}`
                            }
                            title={!sidebarExpanded ? item.label : undefined}
                        >
                            <item.icon className="w-6 h-6 flex-shrink-0 transition-colors" />
                            {sidebarExpanded && (
                                <span className="font-medium text-[15px] nav-label">
                                    {item.label}
                                </span>
                            )}
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

                        {sidebarExpanded && (
                            <div className="flex-1 min-w-0 nav-label">
                                <p className="text-sm font-bold truncate">João Silva</p>
                                <p className="text-xs text-[var(--dash-text-muted)] truncate">Admin</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div
                className="flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300"
                style={{
                    marginLeft: sidebarExpanded ? '320px' : '110px',
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
                            <button className="glass-btn w-12 h-12 rounded-full flex items-center justify-center">
                                <Bell className="w-5 h-5 text-[var(--dash-text-secondary)]" />
                            </button>
                            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 border-2 border-[var(--dash-bg-primary)]"></span>
                        </div>
                    </div>
                </header>

                {/* Content Render */}
                <main className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Sidebar Styles */}
            <style>{`
                @media (max-width: 1024px) {
                    .dashboard-layout > div:nth-child(2) {
                        margin-left: 0 !important;
                        padding: 16px !important;
                    }
                }
            `}</style>
        </div>
    );
}
