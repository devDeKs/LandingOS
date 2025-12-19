import React from 'react';

const ConversationsSection = () => {
    // Dados mockados para o preview do Kanban
    const mockColumns = [
        {
            title: 'Suas Referências',
            cards: [
                { tag: 'Referência', tagColor: '#8b5cf6', description: 'Referências visuais do site da Clinica Mayo' },
                { tag: 'Design & UX', tagColor: '#ec4899', description: 'Paleta de cores inspirada no Instagram' },
                { tag: 'Referência', tagColor: '#8b5cf6', description: 'Carrossel de "Antes e Depois" animado' },
            ]
        },
        {
            title: 'Aguardando Aprovação',
            cards: [
                { tag: 'Frontend', tagColor: '#3b82f6', description: 'Hero Section V1 - Vídeo de background', progress: 80 },
                { tag: 'Frontend', tagColor: '#3b82f6', description: 'Seção de Tratamentos - Grid interativo', progress: 75 },
                { tag: 'Design & UX', tagColor: '#ec4899', description: 'Depoimentos estilo Twitter Cards', progress: 90 },
            ]
        },
        {
            title: 'Aprovados',
            cards: [
                { tag: 'Infraestrutura', tagColor: '#64748b', description: 'Domínio configurado no Cloudflare', progress: 100 },
                { tag: 'Integração', tagColor: '#f59e0b', description: 'Gateway de Pagamento (Stripe)', progress: 100 },
                { tag: 'Conteúdo', tagColor: '#f97316', description: 'Seção "Sobre a Doutora" aprovada', progress: 100 },
            ]
        },
        {
            title: 'Finalizados',
            cards: [
                { tag: 'Infraestrutura', tagColor: '#64748b', description: 'Setup VPS com Docker e Nginx', progress: 100 },
                { tag: 'SEO & Marketing', tagColor: '#10b981', description: 'SEO Técnico - Meta tags otimizadas', progress: 100 },
                { tag: 'SEO & Marketing', tagColor: '#10b981', description: 'Pixels de Rastreamento instalados', progress: 100 },
            ]
        }
    ];

    // Itens de navegação da sidebar
    const navItems = [
        { icon: 'dashboard', label: 'Dashboard', active: false },
        { icon: 'projects', label: 'Projetos', active: true },
        { icon: 'media', label: 'Biblioteca de Mídia', active: false },
        { icon: 'messages', label: 'Mensagens', active: false },
        { icon: 'calendar', label: 'Cronograma', active: false },
        { icon: 'notifications', label: 'Notificações', active: false },
    ];

    const renderNavIcon = (icon) => {
        switch (icon) {
            case 'dashboard':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                        <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                        <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                        <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                    </svg>
                );
            case 'projects':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                        <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                        <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                        <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                    </svg>
                );
            case 'media':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>
                );
            case 'messages':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                    </svg>
                );
            case 'calendar':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                    </svg>
                );
            case 'notifications':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <section className="relative z-10">
            <div
                className="max-w-6xl sm:px-6 lg:px-8 sm:pt-0 bg-center bg-cover mt-0 mr-auto mb-0 ml-auto pt-0 pr-0 pl-0"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1522745078452-5b62b553a3ea?q=80&w=1200&auto=format&fit=crop)'
                }}
            >
                <div className="flex flex-col text-center mr-auto ml-auto space-y-6 items-center" style={{ paddingTop: '20px' }}>
                    <div className="mb-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200 backdrop-blur font-sans">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-violet-300">
                                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                                <path d="M20 2v4"></path>
                                <path d="M22 4h-4"></path>
                                <circle cx="4" cy="20" r="2"></circle>
                            </svg>
                            Sem Mistério. Sem Espera.
                        </span>
                    </div>

                    <h1 className="sm:text-6xl md:text-7xl text-4xl font-normal tracking-tight bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent px-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Veja Seu Site Nascer em <br /> <span className="text-purple-glow">Tempo Real</span>
                    </h1>
                    <p className="max-w-2xl sm:text-lg text-base text-zinc-300 font-sans">
                        Nosso dashboard colaborativo te coloca no controle total. Você não espera "updates por email", você VIVE o processo.
                    </p>

                    <div className="flex gap-3 mt-6 mb-0 pb-8 items-center justify-center">
                        <a
                            href="#"
                            className="group inline-flex items-center gap-2 hover:bg-gradient-to-r hover:from-violet-900/80 hover:to-violet-800/80 text-sm font-medium text-zinc-200 hover:text-white border-white/10 border rounded-full pt-2.5 pr-5 pb-2.5 pl-5 backdrop-blur-lg font-sans transition-all duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path>
                            </svg>
                            Conheça nossa interface
                        </a>
                    </div>
                </div>

                {/* Dashboard Preview - Kanban (Tamanho de página web) */}
                <div className="relative sm:mt-8 mt-6">
                    {/* Glow */}
                    <div className="absolute inset-0 -top-8 mx-auto h-56 max-w-5xl rounded-[28px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-indigo-500/30 blur-2xl"></div>

                    <section className="relative ring-1 ring-white/10 supports-[backdrop-filter]:bg-white/5 overflow-hidden text-white bg-white/5 border-slate-50/10 border rounded-2xl backdrop-blur-xl" style={{ minHeight: '600px' }}>

                        {/* Sidebar Expandida */}
                        <nav
                            className="hidden sm:flex flex-col absolute inset-y-0 left-0 w-64 z-20 pt-4 pb-4 backdrop-blur-xl bg-white/[0.02] border-r border-white/5"
                            aria-label="Primary"
                        >
                            {/* Logo Completa */}
                            <div className="flex items-center justify-start px-6 h-16 mb-4 border-b border-white/5 mx-0 pb-4">
                                <span className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>LandingOS</span>
                            </div>

                            {/* Navigation Items */}
                            <div className="flex-1 px-4 space-y-2">
                                {navItems.map((item, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:translate-x-1 ${item.active
                                            ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                        title={item.label}
                                    >
                                        {renderNavIcon(item.icon)}
                                        <span className="font-sans text-[13px]">{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Settings at bottom */}
                            <div className="px-4 space-y-1 border-t border-white/5 pt-6 mx-0 mt-2">
                                <button type="button" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-300 hover:translate-x-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    <span className="font-sans text-[13px]">Configurações</span>
                                </button>
                            </div>

                            {/* User Profile */}
                            <div className="px-4 mt-4 mx-0 mb-2">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 p-[2px] flex-shrink-0">
                                        <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">JS</span>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-white truncate font-sans">João Silva</p>
                                        <p className="text-xs text-slate-400 truncate font-sans">Admin</p>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        {/* Main Content - Kanban Preview */}
                        <div className="sm:pl-[280px] p-6 lg:pr-8" style={{ minHeight: '600px' }}>
                            {/* Top Bar */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl sm:text-2xl font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Projetos</h2>
                                <div className="flex items-center gap-3">
                                    {/* Search Bar */}
                                    <div className="hidden md:flex items-center gap-2 bg-white/5 ring-1 ring-white/10 rounded-full px-4 py-2.5 w-56 backdrop-blur">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <path d="m21 21-4.3-4.3"></path>
                                        </svg>
                                        <span className="text-xs text-slate-400 font-sans">Busque por projetos...</span>
                                    </div>

                                    {/* Theme Toggle */}
                                    <button className="h-10 w-10 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:scale-105">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                                        </svg>
                                    </button>

                                    {/* Notifications */}
                                    <div className="relative">
                                        <button className="h-10 w-10 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:scale-105">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                                            </svg>
                                        </button>
                                        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 ring-2 ring-slate-900"></span>
                                    </div>

                                    {/* Create Button */}
                                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5v14"></path>
                                        </svg>
                                        Criar Projeto
                                    </button>
                                </div>
                            </div>

                            {/* Kanban Board */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                {mockColumns.map((column, colIndex) => (
                                    <div key={colIndex} className="flex flex-col">
                                        {/* Column Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs sm:text-sm font-medium text-slate-300" style={{ fontFamily: "'Outfit', sans-serif" }}>{column.title}</span>
                                            <button className="h-6 w-6 rounded-md border border-dashed border-slate-500 text-slate-500 flex items-center justify-center transition-all duration-300 hover:border-violet-500 hover:text-violet-400 hover:rotate-90">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12h14"></path>
                                                    <path d="M12 5v14"></path>
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Column Container */}
                                        <div className="flex-1 bg-white/[0.02] backdrop-blur-md ring-1 ring-white/5 rounded-xl p-2 sm:p-3 space-y-2 sm:space-y-3 min-h-[420px]">
                                            {column.cards.map((card, cardIndex) => (
                                                <div
                                                    key={cardIndex}
                                                    className="bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-lg p-3 transition-all duration-300 hover:bg-white/10 hover:ring-violet-500/30 hover:-translate-y-1 hover:shadow-lg cursor-pointer group"
                                                >
                                                    {/* Tag */}
                                                    <span
                                                        className="inline-block text-[10px] font-medium px-2 py-0.5 rounded mb-2 transition-transform duration-300 group-hover:scale-105"
                                                        style={{
                                                            backgroundColor: `${card.tagColor}20`,
                                                            color: card.tagColor,
                                                            border: `1px solid ${card.tagColor}40`
                                                        }}
                                                    >
                                                        {card.tag}
                                                    </span>

                                                    {/* Description */}
                                                    <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mb-2 font-sans">{card.description}</p>

                                                    {/* Progress Bar */}
                                                    {card.progress !== undefined && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full transition-all duration-500"
                                                                    style={{
                                                                        width: `${card.progress}%`,
                                                                        backgroundColor: card.tagColor
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-[9px] text-slate-400 font-sans">{card.progress}%</span>
                                                        </div>
                                                    )}

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                                                        {/* Avatars */}
                                                        <div className="flex -space-x-1.5">
                                                            <div className="h-5 w-5 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 ring-1 ring-slate-900"></div>
                                                            <div className="h-5 w-5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 ring-1 ring-slate-900"></div>
                                                        </div>
                                                        {/* Stats */}
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                            <span className="flex items-center gap-0.5">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                                                </svg>
                                                                3
                                                            </span>
                                                            <span className="flex items-center gap-0.5">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                                                                </svg>
                                                                2
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default ConversationsSection;
