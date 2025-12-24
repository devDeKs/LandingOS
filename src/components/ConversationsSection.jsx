import React from 'react';

const ConversationsSection = () => {
    // Dados mockados focado na experiência VIP (2 colunas principais + foco no Card de Aprovação)
    const mockColumns = [
        {
            title: 'Aguardando Aprovação',
            cards: [
                {
                    id: 'highlight-card',
                    tag: 'Estrutura de Conversão',
                    tagColor: '#8b5cf6', // Violeta
                    description: 'Seção Hero (Versão Premium)',
                    progress: 85,
                    isHighlight: true
                },
                {
                    tag: 'Design & UX',
                    tagColor: '#ec4899', // Pink
                    description: 'Paleta de cores inspirada no Instagram',
                    progress: 60
                }
            ]
        },
        {
            title: 'Aprovados',
            cards: [
                { tag: 'Infraestrutura', tagColor: '#64748b', description: 'Domínio configurado no Cloudflare', progress: 100 },
                { tag: 'Integração', tagColor: '#f59e0b', description: 'Gateway de Pagamento (Stripe)', progress: 100 },
                { tag: 'Conteúdo', tagColor: '#f97316', description: 'Seção "Sobre a Doutora" aprovada', progress: 100 },
            ]
        }
    ];

    return (
        <section className="relative z-10 py-12 sm:py-20 overflow-hidden">
            {/* Purple Light Beams Background Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Texto da Seção */}
                    <div className="flex flex-col space-y-8 text-left">
                        <div className="inline-flex">
                            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 backdrop-blur font-sans">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                                </span>
                                Processo Exclusivo
                            </span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Veja Seu Site Nascer em <span className="text-purple-glow">Tempo Real</span>
                        </h2>

                        <p className="text-lg text-slate-400 max-w-xl font-sans leading-relaxed">
                            Esqueça a ansiedade de não saber o que está acontecendo. Nossa metodologia exclusiva Kanban coloca você dentro do nosso fluxo de trabalho.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Transparência de Elite", desc: "Acesso total ao nosso fluxo interno. Você vê o que nós vemos." },
                                { title: "Decisões em Tempo Real", desc: "Aprove cada etapa com um clique e elimine semanas de idas e vindas de e-mails." },
                                { title: "Sincronia Total", desc: "Sua visão e nossa execução em um único ambiente de alta performance." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium font-sans">{item.title}</h4>
                                        <p className="text-slate-400 text-sm mt-1 font-sans">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dashboard Zoom Preview */}
                    <div className="relative">
                        {/* Glass Container Principal */}
                        <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-500">

                            {/* Decorative Top Bar to look like an app */}
                            <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center px-4 justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-600/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-600/50"></div>
                                </div>
                                <div className="text-[10px] text-slate-500 font-sans tracking-widest uppercase">Dashboard - LandingOS</div>
                            </div>

                            <div className="p-6 sm:p-8 bg-grid-pattern relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 pointer-events-none"></div>

                                {/* Kanban Focus Grid */}
                                <div className="grid grid-cols-2 gap-4 sm:gap-6 relative z-10">
                                    {mockColumns.map((column, colIndex) => (
                                        <div key={colIndex} className="flex flex-col gap-4">
                                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full ${colIndex === 0 ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                                                {column.title}
                                            </h3>

                                            <div className="flex flex-col gap-3">
                                                {column.cards.map((card, cardIndex) => (
                                                    <div
                                                        key={cardIndex}
                                                        className={`relative p-4 rounded-xl border transition-all duration-300 group/card
                                                            ${card.isHighlight
                                                                ? 'bg-gradient-to-br from-violet-500/10 to-transparent border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] shadow-[0_0_15px_rgba(139,92,246,0.05)]'
                                                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            <span className="text-[10px] px-2 py-0.5 rounded border" style={{
                                                                borderColor: `${card.tagColor}40`,
                                                                backgroundColor: `${card.tagColor}10`,
                                                                color: card.tagColor
                                                            }}>
                                                                {card.tag}
                                                            </span>
                                                        </div>

                                                        <p className={`text-sm font-medium mb-4 ${card.isHighlight ? 'text-white' : 'text-slate-300'}`}>
                                                            {card.description}
                                                        </p>

                                                        {/* Progress Bar */}
                                                        <div className="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                                                style={{
                                                                    width: `${card.progress}%`,
                                                                    backgroundColor: card.tagColor
                                                                }}
                                                            ></div>
                                                        </div>

                                                        {card.isHighlight && (
                                                            <button className="w-full mt-2 group/btn relative overflow-hidden rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-white/20 border border-white/10">
                                                                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                                                <span className="relative flex items-center justify-center gap-2">
                                                                    APROVAR AGORA
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-300 group-hover/btn:translate-x-0.5 transition-transform">
                                                                        <path d="M5 12h14"></path>
                                                                        <path d="m12 5 7 7-7 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </button>
                                                        )}

                                                        {!card.isHighlight && (
                                                            <div className="flex items-center gap-2 pt-1">
                                                                <div className="flex -space-x-1.5">
                                                                    <div className="h-4 w-4 rounded-full bg-slate-700 ring-1 ring-black"></div>
                                                                    <div className="h-4 w-4 rounded-full bg-slate-600 ring-1 ring-black"></div>
                                                                </div>
                                                                <span className="text-[10px] text-slate-500">Atualizado há 2h</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Empty State / Ghost Card for realism */}
                                                <div className="h-24 rounded-xl border border-dashed border-white/5 bg-white/[0.01] flex items-center justify-center">
                                                    <span className="text-xs text-slate-600">Espaço livre...</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge (Social Proof/Status) */}
                        <div className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl animate-float">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs ring-4 ring-black/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-white">Status do Projeto</p>
                                    <p className="text-[10px] text-emerald-400">Em dia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ConversationsSection;
