import React from 'react';
import { User, Bell, Palette, Shield, CreditCard, HelpCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const settingsSections = [
    { id: 'profile', icon: User, label: 'Perfil' },
    { id: 'notifications', icon: Bell, label: 'Notificações' },
    { id: 'appearance', icon: Palette, label: 'Aparência' },
    { id: 'security', icon: Shield, label: 'Segurança' },
    { id: 'billing', icon: CreditCard, label: 'Cobrança' },
    { id: 'help', icon: HelpCircle, label: 'Ajuda' },
];

export default function SettingsPage() {
    const { isDarkMode, toggleTheme } = useTheme();
    const [activeSection, setActiveSection] = React.useState('appearance');

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--dash-text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                Configurações
            </h1>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="lg:w-48 flex-shrink-0">
                    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                        {settingsSections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${activeSection === section.id
                                        ? 'bg-[var(--dash-accent-bg)] text-[var(--dash-accent)] font-medium'
                                        : 'hover:bg-[var(--dash-bg-tertiary)]'
                                    }`}
                                style={{ color: activeSection === section.id ? 'var(--dash-accent)' : 'var(--dash-text-secondary)' }}
                            >
                                <section.icon className="w-4 h-4" />
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeSection === 'appearance' && (
                        <div className="dashboard-card p-6">
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--dash-text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                                Aparência
                            </h2>

                            {/* Theme Toggle */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--dash-bg-tertiary)' }}>
                                    <div>
                                        <p className="font-medium" style={{ color: 'var(--dash-text-primary)' }}>Tema</p>
                                        <p className="text-sm mt-0.5" style={{ color: 'var(--dash-text-muted)' }}>
                                            Escolha entre modo claro e escuro
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm" style={{ color: 'var(--dash-text-secondary)' }}>
                                            {isDarkMode ? 'Escuro' : 'Claro'}
                                        </span>
                                        <button
                                            onClick={toggleTheme}
                                            className={`theme-toggle ${isDarkMode ? 'active' : ''}`}
                                        >
                                            <span className="theme-toggle-knob"></span>
                                        </button>
                                    </div>
                                </div>

                                {/* Theme Preview */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => isDarkMode && toggleTheme()}
                                        className={`p-4 rounded-xl border-2 transition-all ${!isDarkMode ? 'border-[var(--dash-accent)]' : 'border-transparent'}`}
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    >
                                        <div className="aspect-video rounded-lg bg-white shadow-sm mb-3 flex items-center justify-center">
                                            <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-800">Modo Claro</p>
                                    </button>
                                    <button
                                        onClick={() => !isDarkMode && toggleTheme()}
                                        className={`p-4 rounded-xl border-2 transition-all ${isDarkMode ? 'border-[var(--dash-accent)]' : 'border-transparent'}`}
                                        style={{ backgroundColor: '#1a1a35' }}
                                    >
                                        <div className="aspect-video rounded-lg bg-[#252545] shadow-sm mb-3 flex items-center justify-center">
                                            <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-200">Modo Escuro</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'profile' && (
                        <div className="dashboard-card p-6">
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--dash-text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                                Perfil
                            </h2>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-2xl font-bold">
                                    JS
                                </div>
                                <div>
                                    <button className="btn-secondary text-sm">Alterar Foto</button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dash-text-secondary)' }}>Nome</label>
                                    <input
                                        type="text"
                                        defaultValue="João Silva"
                                        className="w-full h-10 px-3 rounded-lg text-sm"
                                        style={{
                                            backgroundColor: 'var(--dash-bg-tertiary)',
                                            color: 'var(--dash-text-primary)',
                                            border: '1px solid var(--dash-border)'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dash-text-secondary)' }}>Email</label>
                                    <input
                                        type="email"
                                        defaultValue="joao@empresa.com"
                                        className="w-full h-10 px-3 rounded-lg text-sm"
                                        style={{
                                            backgroundColor: 'var(--dash-bg-tertiary)',
                                            color: 'var(--dash-text-primary)',
                                            border: '1px solid var(--dash-border)'
                                        }}
                                    />
                                </div>
                                <button className="btn-primary mt-4">Salvar Alterações</button>
                            </div>
                        </div>
                    )}

                    {activeSection !== 'appearance' && activeSection !== 'profile' && (
                        <div className="dashboard-card p-6 text-center">
                            <p style={{ color: 'var(--dash-text-muted)' }}>
                                Seção em desenvolvimento...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
