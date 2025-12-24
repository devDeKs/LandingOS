import React, { useState } from 'react';
import { MessageCircle, Search, Hash, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Mock project data for messages
const mockProjects = [
    { id: 1, name: 'Landing Page Dr. Marcus', status: 'active', lastMessage: 'Aprovado! Podemos prosseguir.', time: 'Há 2h' },
    { id: 2, name: 'E-commerce Studio Design', status: 'active', lastMessage: 'Enviei as novas referências.', time: 'Há 5h' },
    { id: 3, name: 'Consult Pro Website', status: 'pending', lastMessage: 'Aguardando aprovação do cliente.', time: 'Ontem' },
];

export default function MessagesPage() {
    const { isDarkMode } = useTheme();
    const [selectedProject, setSelectedProject] = useState(mockProjects[0]);
    const [message, setMessage] = useState('');

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Sidebar List */}
            <div className={`w-80 flex flex-col rounded-2xl border overflow-hidden transition-colors ${isDarkMode ? 'bg-[#1A1A20] border-white/5' : 'bg-white border-slate-200'}`}>
                <div className={`p-4 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <h2 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Mensagens</h2>
                    <div className={`relative px-3 py-2 rounded-xl flex items-center gap-2 transition-colors ${isDarkMode ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <Search className="w-4 h-4 opacity-50" />
                        <input
                            type="text"
                            placeholder="Buscar conversa..."
                            className="bg-transparent outline-none flex-1 text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {mockProjects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`p-4 cursor-pointer transition-colors border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} ${selectedProject?.id === project.id
                                    ? isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'
                                    : isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                                    <Hash className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{project.name}</p>
                                    <p className={`text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{project.lastMessage}</p>
                                </div>
                                <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{project.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#1A1A20] border-white/5' : 'bg-white border-slate-200'}`}>
                {/* Header */}
                <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                            <Hash className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <div>
                            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProject?.name}</h3>
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Projeto {selectedProject?.status}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>2 participantes</span>
                    </div>
                </div>

                {/* Messages Area (Placeholder) */}
                <div className="flex-1 p-6 flex items-center justify-center">
                    <div className="text-center">
                        <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                        <h4 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Chat em Construção</h4>
                        <p className={`text-sm max-w-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            O sistema de mensagens em tempo real será implementado em breve.
                        </p>
                    </div>
                </div>

                {/* Input Area */}
                <div className={`p-4 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isDarkMode ? 'bg-black/20' : 'bg-slate-100'}`}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className={`flex-1 bg-transparent outline-none text-sm ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
                        />
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors">
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
