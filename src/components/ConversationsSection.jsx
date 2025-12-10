import React, { useEffect, useRef } from 'react';

const ConversationsSection = () => {
    const formRef = useRef(null);
    const inputRef = useRef(null);
    const messagesRef = useRef(null);

    useEffect(() => {
        const form = formRef.current;
        const input = inputRef.current;
        const messages = messagesRef.current;

        function scrollToBottom() {
            if (messages) {
                messages.scrollTop = messages.scrollHeight;
            }
        }

        function addMessage(text, who = 'You') {
            if (!messages) return;

            const row = document.createElement('div');
            row.className = 'flex items-start gap-3';
            row.innerHTML = `
                <img src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80" alt="avatar" class="h-8 w-8 rounded-full ring-1 ring-white/10">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <p class="text-sm font-medium text-white">${who}</p>
                        <span class="text-[11px] text-slate-400">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="mt-1 inline-flex px-3 py-2 rounded-2xl ${who === 'You' ? 'bg-gradient-to-br from-violet-500/20 to-indigo-500/20' : 'bg-white/5'} ring-1 ring-white/10">
                        <p class="text-sm ${who === 'You' ? 'text-slate-100' : 'text-slate-200'}">${text}</p>
                    </div>
                </div>
            `;
            messages.appendChild(row);
            scrollToBottom();
        }

        const handleSubmit = (e) => {
            e.preventDefault();
            const value = (input?.value || '').trim();
            if (!value) return;
            addMessage(value, 'You');
            if (input) input.value = '';
            setTimeout(() => addMessage("Anotado! Vou atualizar o deck e te aviso quando estiver pronto.", 'Lina'), 900);
        };

        const handleInput = () => {
            if (input) {
                input.style.height = 'auto';
                input.style.height = Math.min(input.scrollHeight, 120) + 'px';
            }
        };

        if (form) {
            form.addEventListener('submit', handleSubmit);
        }
        if (input) {
            input.addEventListener('input', handleInput);
        }

        return () => {
            if (form) {
                form.removeEventListener('submit', handleSubmit);
            }
            if (input) {
                input.removeEventListener('input', handleInput);
            }
        };
    }, []);

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
                            Novo: Resumos de IA para threads
                        </span>
                    </div>

                    <h1 className="sm:text-6xl md:text-7xl text-4xl font-light text-white tracking-tighter" style={{ fontFamily: "'Barlow', sans-serif" }}>
                        Comunicação que Fecha Negócios
                    </h1>
                    <p className="max-w-2xl sm:text-lg text-base text-zinc-300 font-sans">
                        Integração direta com seus canais de venda. Transforme interesse em reuniões agendadas automaticamente.
                    </p>

                    <div className="flex gap-3 mt-6 mb-0 pb-8 items-center justify-center">
                        <a
                            href="#"
                            className="group inline-flex items-center gap-2 hover:bg-gradient-to-r hover:from-red-900/80 hover:to-red-800/80 text-sm font-medium text-zinc-200 hover:text-white border-white/10 border rounded-full pt-2.5 pr-5 pb-2.5 pl-5 backdrop-blur-lg font-sans transition-all duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path>
                            </svg>
                            Conheça nossa interface
                        </a>
                    </div>
                </div>

                {/* App Preview */}
                <div className="relative sm:mt-8 mt-6">
                    {/* Glow */}
                    <div className="absolute inset-0 -top-8 mx-auto h-56 max-w-5xl rounded-[28px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-indigo-500/30 blur-2xl"></div>

                    <section className="relative ring-1 ring-white/10 supports-[backdrop-filter]:bg-white/5 overflow-hidden text-white bg-white/5 border-slate-50/10 border rounded-2xl backdrop-blur-xl">
                        {/* Sidebar (icons only) */}
                        <nav
                            className="hidden sm:flex flex-col absolute inset-y-0 left-0 w-14 z-10 pt-4 pr-2 pb-4 pl-2 backdrop-blur items-center justify-between"
                            aria-label="Primary"
                        >
                            <div className="flex flex-col gap-3 items-center">
                                <button type="button" className="h-10 w-10 ring-1 ring-white/20 flex bg-white/10 rounded-xl items-center justify-center" title="Home" aria-label="Home">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home w-5 h-5 text-white">
                                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                                        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    </svg>
                                </button>
                                <div className="h-px w-8 bg-white/10"></div>
                                <button type="button" className="h-10 w-10 rounded-xl text-slate-300 hover:bg-white/10 flex items-center justify-center" title="Search" aria-label="Search">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search w-5 h-5">
                                        <path d="m21 21-4.34-4.34"></path>
                                        <circle cx="11" cy="11" r="8"></circle>
                                    </svg>
                                </button>
                                <button type="button" className="h-10 w-10 rounded-xl text-slate-300 hover:bg-white/10 flex items-center justify-center" title="Contacts" aria-label="Contacts">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-5 h-5">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                        <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                    </svg>
                                </button>
                                <button type="button" className="h-10 w-10 rounded-xl text-slate-300 hover:bg-white/10 flex items-center justify-center" title="Calls" aria-label="Calls">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-5 h-5">
                                        <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                                    </svg>
                                </button>
                                <button type="button" className="h-10 w-10 rounded-xl text-slate-300 hover:bg-white/10 flex items-center justify-center" title="Files" aria-label="Files">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder w-5 h-5">
                                        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <button type="button" className="h-10 w-10 rounded-xl text-slate-300 hover:bg-white/10 flex items-center justify-center" title="Settings" aria-label="Settings">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings w-5 h-5">
                                        <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                                <button type="button" className="h-10 w-10 rounded-xl text-slate-300 hover:bg-white/10 flex items-center justify-center" title="Help" aria-label="Help">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle w-5 h-5">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                        <path d="M12 17h.01"></path>
                                    </svg>
                                </button>
                            </div>
                        </nav>

                        <div className="grid grid-cols-1 lg:grid-cols-2 sm:pl-16">
                            {/* Left: Conversations */}
                            <div className="sm:p-8 lg:p-10 pt-5 pr-5 pb-5 pl-5">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="sm:text-2xl text-xl text-white tracking-tight font-light" style={{ fontFamily: "'Barlow', sans-serif" }}>Inbox</h2>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                                className="h-4 w-4">
                                                <path d="M3 7h18"></path>
                                                <path d="M3 12h18"></path>
                                                <path d="M3 17h18"></path>
                                            </svg>
                                            <span className="text-xs sm:text-sm font-medium font-sans">Canais</span>
                                        </div>
                                    </div>

                                    <div className="ring-1 ring-white/10 bg-white/5 rounded-xl p-3">
                                        <div className="flex items-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                                className="h-4 w-4 text-slate-300">
                                                <path d="m21 21-4.34-4.34"></path>
                                                <circle cx="11" cy="11" r="8"></circle>
                                            </svg>
                                            <input placeholder="Buscar mensagens" className="bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-400 flex-1" />
                                        </div>

                                        <div className="mt-3 space-y-1" id="chat-list">
                                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10 flex items-center gap-3">
                                                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm text-slate-200 truncate font-sans"># lancamento-produto</p>
                                                    <p className="text-xs text-slate-400 truncate font-sans">Lina: Checagem final na landing…</p>
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-sans">2m</span>
                                            </button>
                                            <button className="w-full text-left px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center gap-3">
                                                <span className="inline-flex h-2 w-2 rounded-full bg-violet-400"></span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm text-slate-200 truncate font-sans"># review-design</p>
                                                    <p className="text-xs text-slate-400 truncate font-sans">Você: Compartilhei o link do Figma</p>
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-sans">14m</span>
                                            </button>
                                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10 flex items-center gap-3">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="9" cy="7" r="4"></circle>
                                                    </svg>
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm text-slate-200 truncate font-sans">Lina Park</p>
                                                    <p className="text-xs text-slate-400 truncate font-sans">DM · "Enviando hotfix"</p>
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-sans">1h</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg tracking-tight font-semibold text-white font-sans">Ações Rápidas</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex gap-2 ring-1 ring-white/10 hover:bg-white/10 transition-colors bg-white/5 rounded-lg pt-2 pr-3 pb-2 pl-3 items-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                                                    <path d="M3 7h18"></path>
                                                    <path d="M3 12h18"></path>
                                                    <path d="M3 17h18"></path>
                                                </svg>
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-xs text-slate-300 font-sans block">Todos os canais</span>
                                                    <span className="text-[10px] text-slate-500 font-sans">⌘ + K</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ring-1 ring-white/10 hover:bg-white/10 transition-colors bg-white/5 rounded-lg pt-2 pr-3 pb-2 pl-3 items-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] text-slate-300">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                </svg>
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-xs text-slate-300 font-sans block">Iniciar chamada</span>
                                                    <span className="text-[10px] text-slate-500 font-sans">⌘ + Shift + C</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ring-1 ring-white/10 hover:bg-white/10 transition-colors bg-white/5 rounded-lg pt-2 pr-3 pb-2 pl-3 items-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                                                    <path d="m21 21-4.34-4.34"></path>
                                                    <circle cx="11" cy="11" r="8"></circle>
                                                </svg>
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-xs text-slate-300 font-sans block">Buscar</span>
                                                    <span className="text-[10px] text-slate-500 font-sans">⌘ + F</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ring-1 ring-white/10 hover:bg-white/10 transition-colors bg-white/5 rounded-lg pt-2 pr-3 pb-2 pl-3 items-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="9" cy="7" r="4"></circle>
                                                </svg>
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-xs text-slate-300 font-sans block">Mensagens diretas</span>
                                                    <span className="text-[10px] text-slate-500 font-sans">⌘ + D</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ring-1 ring-white/10 hover:bg-white/10 transition-colors bg-white/5 rounded-lg pt-2 pr-3 pb-2 pl-3 items-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                                                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                                                </svg>
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-xs text-slate-300 font-sans block">Arquivos e mídia</span>
                                                    <span className="text-[10px] text-slate-500 font-sans">⌘ + U</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ring-1 ring-white/10 hover:bg-white/10 transition-colors bg-white/5 rounded-lg pt-2 pr-3 pb-2 pl-3 items-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                                    <path d="M12 17h.01"></path>
                                                </svg>
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-xs text-slate-300 font-sans block">Central de ajuda</span>
                                                    <span className="text-[10px] text-slate-500 font-sans">⌘ + ?</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                                                <span className="font-sans">Pressione ⌘ + / para atalhos</span>
                                                <span className="inline-flex items-center gap-1 font-sans">
                                                    <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-white/10 text-[9px]">6</span>
                                                    não lidas
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Chat thread */}
                            <div className="lg:border-t-0 lg:border-l border-white/10 border-t pr-4 pl-4">
                                <div className="sm:p-8 lg:p-10 pt-5 pr-5 pb-5 pl-5 space-y-5">
                                    {/* Channel header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex h-8 w-8 items-center justify-center ring-1 ring-white/20 bg-white/10 rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-white">
                                                    <path d="M3 7h18"></path>
                                                    <path d="M3 12h18"></path>
                                                    <path d="M3 17h18"></path>
                                                </svg>
                                            </span>
                                            <div>
                                                <p className="text-white font-medium font-sans"># lancamento-produto</p>
                                                <p className="text-[12px] text-slate-400 font-sans">42 membros · 6 online</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10" type="button" aria-label="Start call">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-200">
                                                    <path d="M22 16.92A7 7 0 0 1 16.92 22C9.17 22 2 14.83 2 7.08A7 7 0 0 1 7.08 2L10 4v4L7 9a12.29 12.29 0 0 0 8 8l1-3h4Z"></path>
                                                </svg>
                                            </button>
                                            <button className="p-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10" type="button" aria-label="Settings">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-200">
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.26 1.3.73 1.77.47.47 1.11.73 1.77.73h.09a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div
                                        ref={messagesRef}
                                        id="messages"
                                        className="ring-1 ring-white/10 bg-white/5 rounded-xl p-4 space-y-4 max-h-[340px] overflow-y-auto scroll-smooth"
                                    >
                                        <div className="flex items-start gap-3">
                                            <img src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/a7a0f0f5-9a19-4888-87bf-ff8780ff8008_320w.jpg" alt="avatar" className="h-8 w-8 ring-1 ring-white/10 object-cover rounded-full" />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-white font-sans">Lina</p>
                                                    <span className="text-[11px] text-slate-400 font-sans">09:28</span>
                                                </div>
                                                <div className="mt-1 inline-flex px-3 py-2 rounded-2xl bg-white/5 ring-1 ring-white/10">
                                                    <p className="text-sm text-slate-200 font-sans">Bom dia! Finalizando a copy do anúncio agora.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <img src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/3eba3b9c-9fcf-4da6-9371-116a96e97133_320w.jpg" alt="avatar" className="h-8 w-8 ring-1 ring-white/10 object-cover rounded-full" />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-white font-sans">Você</p>
                                                    <span className="text-[11px] text-slate-400 font-sans">09:30</span>
                                                </div>
                                                <div className="mt-1 inline-flex px-3 py-2 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 ring-1 ring-white/10">
                                                    <p className="text-sm text-slate-100 font-sans">Incrível. Podemos adicionar o print da nova tabela de preços?</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <img src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/a7a0f0f5-9a19-4888-87bf-ff8780ff8008_320w.jpg" alt="avatar" className="h-8 w-8 ring-1 ring-white/10 object-cover rounded-full" />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-white font-sans">Lina</p>
                                                    <span className="text-[11px] text-slate-400 font-sans">09:31</span>
                                                </div>
                                                <div className="mt-1 space-y-2">
                                                    <div className="inline-flex px-3 py-2 rounded-2xl bg-white/5 ring-1 ring-white/10">
                                                        <p className="text-sm text-slate-200 font-sans">Sim, enviando os assets em breve.</p>
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 ring-1 ring-white/10">
                                                        <span className="h-8 w-12 overflow-hidden ring-1 ring-white/10 bg-white/10 rounded-lg"></span>
                                                        <span className="h-8 w-12 rounded-lg overflow-hidden ring-1 ring-white/10 bg-white/10"></span>
                                                        <span className="text-xs text-slate-400 font-sans">2 arquivos</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Composer */}
                                    <div className="ring-1 ring-white/10 bg-white/5 rounded-xl p-2">
                                        <form ref={formRef} id="chat-form" className="flex gap-2 items-start">
                                            <button type="button" className="p-2 rounded-lg hover:bg-white/10 text-slate-200" aria-label="Add">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
                                                    <path d="M12 5v14"></path>
                                                    <path d="M5 12h14"></path>
                                                </svg>
                                            </button>
                                            <div className="flex-1">
                                                <textarea
                                                    ref={inputRef}
                                                    id="chat-input"
                                                    rows="1"
                                                    placeholder="Mensagem #lancamento-produto"
                                                    className="w-full resize-none outline-none placeholder:text-slate-500 text-sm text-slate-100 bg-transparent pt-2 pr-2 pb-2 pl-2"
                                                ></textarea>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button type="button" className="p-2 rounded-lg hover:bg-white/10 text-slate-200" aria-label="Attach">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
                                                        <path d="M13.5 8.5 5.9 16a3 3 0 1 0 4.24 4.24L18 12.38a5 5 0 0 0-7.07-7.07L5 11.24"></path>
                                                    </svg>
                                                </button>
                                                <button type="submit" className="inline-flex gap-1.5 hover:opacity-95 text-xs font-medium text-white bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg pt-2 pr-3 pb-2 pl-3 items-center">
                                                    Enviar
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                                                        <path d="m22 2-7 20-4-9-9-4Z"></path>
                                                        <path d="M22 2 11 13"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* AI Recap */}
                                    <div className="ring-1 ring-white/10 bg-white/5 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex h-6 w-6 items-center justify-center ring-1 ring-violet-500/30 bg-violet-500/20 rounded-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-300">
                                                        <path d="m12 6 7 4-7 4-7-4 7-4Z"></path>
                                                        <path d="m19 10v6l-7 4-7-4v-6"></path>
                                                    </svg>
                                                </span>
                                                <h4 className="text-sm font-medium text-white tracking-tight font-sans">Resumo IA</h4>
                                            </div>
                                            <button className="text-xs text-violet-300 hover:text-violet-200 font-sans" type="button">Atualizar</button>
                                        </div>
                                        <ul className="space-y-1.5 text-[13px] text-slate-300 list-disc pl-5">
                                            <li className="font-sans">Copy do anúncio pronta; assets chegando.</li>
                                            <li className="font-sans">Adicionar print da tabela de preços na hero.</li>
                                            <li className="font-sans">Revisão de QA após inserir assets.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <style>{`
                .button {
                    cursor: pointer;
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    transition: all 0.25s ease;
                    background: radial-gradient(65.28% 65.28% at 50% 100%, rgba(34, 211, 238, 0.8) 0%, rgba(34, 211, 238, 0) 100%), linear-gradient(0deg, #2563eb, #2563eb);
                    border-radius: 9999px;
                    border: none;
                    outline: none;
                    padding: 12px 18px;
                    min-height: 48px;
                    min-width: 102px;
                }
                .button::before,
                .button::after {
                    content: "";
                    position: absolute;
                    transition: all 0.5s ease-in-out;
                    z-index: 0;
                }
                .button::before {
                    inset: 1px;
                    background: linear-gradient(177.95deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0) 100%);
                    border-radius: 9999px;
                }
                .button::after {
                    inset: 2px;
                    background: radial-gradient(65.28% 65.28% at 50% 100%, rgba(34, 211, 238, 0.8) 0%, rgba(34, 211, 238, 0) 100%), linear-gradient(0deg, #2563eb, #2563eb);
                    border-radius: 9999px;
                }
                .button:active {
                    transform: scale(0.95);
                }
                .points_wrapper {
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    position: absolute;
                    z-index: 1;
                }
                .points_wrapper .point {
                    bottom: -10px;
                    position: absolute;
                    animation: floating-points infinite ease-in-out;
                    pointer-events: none;
                    width: 2px;
                    height: 2px;
                    background-color: #fff;
                    border-radius: 9999px;
                }
                @keyframes floating-points {
                    0% { transform: translateY(0); }
                    85% { opacity: 0; }
                    100% { transform: translateY(-55px); opacity: 0; }
                }
                .points_wrapper .point:nth-child(1) { left: 10%; opacity: 1; animation-duration: 2.35s; animation-delay: 0.2s; }
                .points_wrapper .point:nth-child(2) { left: 30%; opacity: 0.7; animation-duration: 2.5s; animation-delay: 0.5s; }
                .points_wrapper .point:nth-child(3) { left: 25%; opacity: 0.8; animation-duration: 2.2s; animation-delay: 0.1s; }
                .points_wrapper .point:nth-child(4) { left: 44%; opacity: 0.6; animation-duration: 2.05s; }
                .points_wrapper .point:nth-child(5) { left: 50%; opacity: 1; animation-duration: 1.9s; }
                .points_wrapper .point:nth-child(6) { left: 75%; opacity: 0.5; animation-duration: 1.5s; animation-delay: 1.5s; }
                .points_wrapper .point:nth-child(7) { left: 88%; opacity: 0.9; animation-duration: 2.2s; animation-delay: 0.2s; }
                .points_wrapper .point:nth-child(8) { left: 58%; opacity: 0.8; animation-duration: 2.25s; animation-delay: 0.2s; }
                .points_wrapper .point:nth-child(9) { left: 98%; opacity: 0.6; animation-duration: 2.6s; animation-delay: 0.1s; }
                .points_wrapper .point:nth-child(10) { left: 65%; opacity: 1; animation-duration: 2.5s; animation-delay: 0.2s; }
                .inner {
                    z-index: 2;
                    gap: 6px;
                    position: relative;
                    width: 100%;
                    color: white;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 1.5;
                    transition: color 0.2s ease-in-out;
                }
                .inner svg.icon {
                    width: 18px;
                    height: 18px;
                    transition: transform 0.3s ease;
                    stroke: white;
                    fill: none;
                }
                .button:hover svg.icon {
                    transform: translateX(2px);
                }
                .button:hover svg.icon path {
                    animation: dash 0.8s linear forwards;
                }
                @keyframes dash {
                    0% { stroke-dasharray: 0, 20; stroke-dashoffset: 0; }
                    50% { stroke-dasharray: 10, 10; stroke-dashoffset: -5; }
                    100% { stroke-dasharray: 20, 0; stroke-dashoffset: -10; }
                }
            `}</style>
        </section>
    );
};

export default ConversationsSection;

