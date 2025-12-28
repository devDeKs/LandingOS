import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Hash, Search, Send, Loader2, MessageCircle, Users, Plus, X, Eye, FolderKanban, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

// Portal Modal for creating channels
const PortalModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md bg-[#0f0f17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default function AdminMessagesPage() {
    const { user, userName } = useAuth();
    const navigate = useNavigate();
    const [projectNames, setProjectNames] = useState([]);
    const [selectedProjectName, setSelectedProjectName] = useState(null);
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewChannelModal, setShowNewChannelModal] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');
    const [creatingChannel, setCreatingChannel] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Fetch all unique project names
    const fetchProjectNames = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('project_name, full_name')
                .not('project_name', 'is', null)
                .is('deleted_at', null);

            if (error) throw error;

            // Get unique project names with client info
            const uniqueProjects = [];
            const seen = new Set();
            (data || []).forEach(p => {
                if (p.project_name && !seen.has(p.project_name)) {
                    seen.add(p.project_name);
                    uniqueProjects.push({
                        name: p.project_name,
                        clientName: p.full_name
                    });
                }
            });

            setProjectNames(uniqueProjects);

            // Auto-select first
            if (uniqueProjects.length > 0 && !selectedProjectName) {
                setSelectedProjectName(uniqueProjects[0].name);
            }
        } catch (err) {
            console.error('Error fetching project names:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch channels for selected project_name
    const fetchChannels = async () => {
        if (!selectedProjectName) return;

        try {
            const { data, error } = await supabase
                .from('chat_channels')
                .select('*, card:card_id(name, category)')
                .eq('project_name', selectedProjectName)
                .is('deleted_at', null)
                .order('is_default', { ascending: false })
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Sort: Reunião first, then others
            const sorted = (data || []).sort((a, b) => {
                if (a.is_default) return -1;
                if (b.is_default) return 1;
                return 0;
            });

            setChannels(sorted);

            // Auto-select Reunião or first channel
            if (sorted.length > 0) {
                const reuniao = sorted.find(c => c.is_default);
                setSelectedChannel(reuniao || sorted[0]);
            } else {
                setSelectedChannel(null);
                setMessages([]);
            }
        } catch (err) {
            console.error('Error fetching channels:', err);
        }
    };

    // Fetch messages for selected channel (on demand)
    const fetchMessages = async () => {
        if (!selectedChannel) return;

        setMessagesLoading(true);
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select(`
                    id,
                    content,
                    type,
                    file_url,
                    created_at,
                    sender_id,
                    sender:sender_id (
                        full_name,
                        role_id,
                        avatar_url
                    )
                `)
                .eq('channel_id', selectedChannel.id)
                .is('deleted_at', null)
                .order('created_at', { ascending: true })
                .limit(100);

            if (error) throw error;
            setMessages(data || []);
            setTimeout(scrollToBottom, 100);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setMessagesLoading(false);
        }
    };

    // Create new channel
    const handleCreateChannel = async () => {
        if (!newChannelName.trim() || !selectedProjectName) return;

        setCreatingChannel(true);
        try {
            const { data, error } = await supabase
                .from('chat_channels')
                .insert({
                    project_name: selectedProjectName,
                    card_id: null,
                    name: newChannelName.trim(),
                    is_default: false
                })
                .select()
                .single();

            if (error) throw error;

            setChannels(prev => [...prev, data]);
            setSelectedChannel(data);
            setNewChannelName('');
            setShowNewChannelModal(false);
        } catch (err) {
            console.error('Error creating channel:', err);
            alert('Erro ao criar canal: ' + err.message);
        } finally {
            setCreatingChannel(false);
        }
    };

    // Send message with optimistic UI
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChannel || sending) return;

        const messageContent = newMessage.trim();
        setNewMessage('');
        setSending(true);

        // Optimistic UI
        const optimisticMessage = {
            id: `temp-${Date.now()}`,
            content: messageContent,
            type: 'text',
            created_at: new Date().toISOString(),
            sender_id: user.id,
            sender: { full_name: userName, role_id: 'admin' },
            isOptimistic: true,
            isAdmin: true
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setTimeout(scrollToBottom, 50);

        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .insert({
                    channel_id: selectedChannel.id,
                    sender_id: user.id,
                    content: messageContent,
                    type: 'text'
                })
                .select(`
                    id,
                    content,
                    type,
                    created_at,
                    sender_id,
                    sender:sender_id (
                        full_name,
                        role_id,
                        avatar_url
                    )
                `)
                .single();

            if (error) throw error;

            setMessages(prev => prev.map(m =>
                m.id === optimisticMessage.id ? { ...data, isAdmin: true } : m
            ));
        } catch (err) {
            console.error('Error sending message:', err);
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
            setNewMessage(messageContent);
        } finally {
            setSending(false);
        }
    };

    // Format time
    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Hoje';
        if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    // Check if sender is admin
    const isAdminSender = (msg) => {
        return msg.sender_id === user.id || msg.isAdmin;
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, msg) => {
        const date = new Date(msg.created_at).toDateString();
        if (!groups[date]) groups[date] = [];
        groups[date].push(msg);
        return groups;
    }, {});

    // Initial fetch
    useEffect(() => {
        fetchProjectNames();
    }, []);

    // Fetch channels when project changes
    useEffect(() => {
        if (selectedProjectName) {
            fetchChannels();
        }
    }, [selectedProjectName]);

    // Fetch messages when channel changes
    useEffect(() => {
        if (selectedChannel) {
            fetchMessages();
        }
    }, [selectedChannel?.id]);

    // Realtime subscription for messages
    useEffect(() => {
        if (!selectedChannel) return;

        const channel = supabase
            .channel(`admin-chat:${selectedChannel.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `channel_id=eq.${selectedChannel.id}`
            }, async (payload) => {
                if (payload.new.sender_id === user.id) return;

                const { data } = await supabase
                    .from('chat_messages')
                    .select(`
                        id,
                        content,
                        type,
                        created_at,
                        sender_id,
                        sender:sender_id (
                            full_name,
                            role_id,
                            avatar_url
                        )
                    `)
                    .eq('id', payload.new.id)
                    .single();

                if (data) {
                    setMessages(prev => [...prev, data]);
                    setTimeout(scrollToBottom, 50);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedChannel?.id, user?.id]);

    // Realtime for new channels
    useEffect(() => {
        if (!selectedProjectName) return;

        const channel = supabase
            .channel(`admin-channels:${selectedProjectName}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_channels',
                filter: `project_name=eq.${selectedProjectName}`
            }, () => {
                fetchChannels();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedProjectName]);

    // Filter projects by search
    const filteredProjects = projectNames.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-4">
            {/* Projects Sidebar */}
            <div className="w-72 flex flex-col rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <div className="p-4 border-b border-white/[0.06]">
                    <h2
                        className="text-lg font-normal mb-4"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <span className="bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                            Projetos
                        </span>
                    </h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar projeto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/50"
                        />
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredProjects.length === 0 ? (
                        <div className="p-6 text-center">
                            <FolderKanban className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                            <p className="text-sm text-slate-500">Nenhum projeto</p>
                        </div>
                    ) : (
                        filteredProjects.map((project) => (
                            <div
                                key={project.name}
                                onClick={() => setSelectedProjectName(project.name)}
                                className={`p-4 cursor-pointer transition-all border-b border-white/[0.04] ${selectedProjectName === project.name
                                    ? 'bg-violet-500/10 border-l-2 border-l-violet-500'
                                    : 'hover:bg-white/[0.03]'
                                    }`}
                            >
                                <p className="font-medium text-sm text-white truncate">{project.name}</p>
                                <p className="text-xs text-slate-500 truncate">
                                    {project.clientName || 'Cliente não definido'}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Channels Sidebar */}
            <div className="w-64 flex flex-col rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Canais</h3>
                    <button
                        onClick={() => setShowNewChannelModal(true)}
                        disabled={!selectedProjectName}
                        className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {!selectedProjectName ? (
                        <div className="p-4 text-center text-slate-500 text-xs">
                            Selecione um projeto
                        </div>
                    ) : channels.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-xs">
                            Nenhum canal
                        </div>
                    ) : (
                        <>
                            {/* Reunião (fixed at top) */}
                            {channels.filter(c => c.is_default).map((channel) => (
                                <div
                                    key={channel.id}
                                    onClick={() => setSelectedChannel(channel)}
                                    className={`p-3 cursor-pointer transition-all flex items-center gap-2 border-b border-white/[0.06] ${selectedChannel?.id === channel.id
                                        ? 'bg-amber-500/10 text-amber-400'
                                        : 'bg-white/[0.02] text-slate-400 hover:bg-white/[0.04] hover:text-white'
                                        }`}
                                >
                                    <Pin className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm font-medium truncate">{channel.name}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 ml-auto">
                                        Geral
                                    </span>
                                </div>
                            ))}

                            {/* Card channels */}
                            <div className="p-2">
                                <p className="text-[10px] text-slate-600 uppercase tracking-wider px-2 py-2">Cards</p>
                            </div>
                            {channels.filter(c => !c.is_default).map((channel) => (
                                <div
                                    key={channel.id}
                                    onClick={() => setSelectedChannel(channel)}
                                    className={`p-3 cursor-pointer transition-all flex items-center gap-2 ${selectedChannel?.id === channel.id
                                        ? 'bg-violet-500/10 text-violet-400'
                                        : 'text-slate-400 hover:bg-white/[0.03] hover:text-white'
                                        }`}
                                >
                                    <Hash className="w-4 h-4 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm truncate block">{channel.name}</span>
                                        {channel.card?.category && (
                                            <span className="text-[10px] text-slate-600">{channel.card.category}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                {selectedChannel ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedChannel.is_default
                                    ? 'bg-amber-500/20'
                                    : 'bg-violet-500/20'
                                    }`}>
                                    {selectedChannel.is_default ? (
                                        <Pin className="w-5 h-5 text-amber-400" />
                                    ) : (
                                        <Hash className="w-5 h-5 text-violet-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{selectedChannel.name}</h3>
                                    <p className="text-xs text-slate-500">{selectedProjectName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* View Project Cards */}
                                <button
                                    onClick={() => navigate(`/admin/projetos/${encodeURIComponent(selectedProjectName)}`)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    Ver Cards
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messagesLoading ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                                        <MessageCircle className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <p className="text-slate-400">Nenhuma mensagem</p>
                                    <p className="text-sm text-slate-600 mt-1">Inicie a conversa com o cliente!</p>
                                </div>
                            ) : (
                                Object.entries(groupedMessages).map(([date, msgs]) => (
                                    <div key={date}>
                                        <div className="flex items-center gap-4 my-6">
                                            <div className="flex-1 h-px bg-white/10"></div>
                                            <span className="text-xs text-slate-500 font-medium">
                                                {formatDate(msgs[0].created_at)}
                                            </span>
                                            <div className="flex-1 h-px bg-white/10"></div>
                                        </div>

                                        {msgs.map((msg, idx) => {
                                            const isAdmin = isAdminSender(msg);
                                            const showAvatar = idx === 0 || msgs[idx - 1]?.sender_id !== msg.sender_id;

                                            return (
                                                <motion.div
                                                    key={msg.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`flex gap-3 mb-2 ${isAdmin ? 'flex-row-reverse' : ''}`}
                                                >
                                                    {showAvatar ? (
                                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold relative overflow-hidden ${isAdmin
                                                            ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 text-amber-400'
                                                            : 'bg-emerald-500/20 text-emerald-400'
                                                            }`}>
                                                            {msg.sender?.avatar_url ? (
                                                                <img src={msg.sender.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                                            ) : (
                                                                (msg.sender?.full_name || 'U')[0].toUpperCase()
                                                            )}
                                                            {isAdmin && (
                                                                <div className="absolute inset-[-2px] rounded-full border-2 border-amber-500/50"></div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 flex-shrink-0"></div>
                                                    )}

                                                    <div className={`max-w-[70%] ${isAdmin ? 'items-end' : 'items-start'}`}>
                                                        {showAvatar && (
                                                            <p className={`text-xs text-slate-500 mb-1 ${isAdmin ? 'text-right' : ''}`}>
                                                                {msg.sender?.full_name || 'Usuário'}
                                                            </p>
                                                        )}
                                                        <div className={`px-4 py-2.5 rounded-2xl ${isAdmin
                                                            ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-br-md'
                                                            : 'bg-white/10 text-white rounded-bl-md'
                                                            } ${msg.isOptimistic ? 'opacity-70' : ''}`}>
                                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                                        </div>
                                                        <p className={`text-[10px] text-slate-600 mt-1 ${isAdmin ? 'text-right' : ''}`}>
                                                            {formatTime(msg.created_at)}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.06]">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-violet-500/50 transition-colors">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Responder ao cliente..."
                                    disabled={sending}
                                    className="flex-1 bg-transparent outline-none text-sm text-white placeholder-slate-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="px-5 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-violet-500/25"
                                >
                                    {sending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">Selecione um canal</h3>
                            <p className="text-sm text-slate-500 max-w-xs">
                                Escolha um projeto e canal para gerenciar as mensagens
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* New Channel Modal */}
            <PortalModal isOpen={showNewChannelModal} onClose={() => setShowNewChannelModal(false)}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Criar Novo Canal</h3>
                        <button
                            onClick={() => setShowNewChannelModal(false)}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-sm text-slate-400 mb-4">
                        Projeto: <span className="text-white font-medium">{selectedProjectName}</span>
                    </p>

                    <label className="block text-sm text-slate-400 mb-2">Nome do Canal</label>
                    <input
                        type="text"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        placeholder="Ex: Aprovação de Design"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setShowNewChannelModal(false)}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreateChannel}
                            disabled={!newChannelName.trim() || creatingChannel}
                            className="flex-1 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-white font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {creatingChannel ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            Criar Canal
                        </button>
                    </div>
                </div>
            </PortalModal>
        </div>
    );
}
