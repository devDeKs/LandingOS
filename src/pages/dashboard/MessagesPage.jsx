import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, Image, Zap } from 'lucide-react';

const conversations = [
    {
        id: 1,
        name: 'Dr. Marcus',
        avatar: 'https://i.pravatar.cc/40?img=11',
        lastMessage: 'Perfeito! A hero section ficou incrível.',
        time: 'Agora',
        unread: 2,
        online: true
    },
    {
        id: 2,
        name: 'JM Advogados',
        avatar: 'https://i.pravatar.cc/40?img=12',
        lastMessage: 'Podemos agendar uma call para amanhã?',
        time: '2h',
        unread: 0,
        online: false
    },
    {
        id: 3,
        name: 'Studio Design',
        avatar: 'https://i.pravatar.cc/40?img=13',
        lastMessage: 'Enviamos as referências que você pediu.',
        time: '5h',
        unread: 0,
        online: true
    },
    {
        id: 4,
        name: 'Consult Pro',
        avatar: 'https://i.pravatar.cc/40?img=14',
        lastMessage: 'Aguardando aprovação final.',
        time: '1d',
        unread: 0,
        online: false
    }
];

const messages = [
    { id: 1, sender: 'them', text: 'Olá! Tudo bem?', time: '10:30' },
    { id: 2, sender: 'me', text: 'Oi! Tudo ótimo, e com você?', time: '10:32' },
    { id: 3, sender: 'them', text: 'Estou muito empolgado com o projeto! A equipe adorou o primeiro draft.', time: '10:33' },
    { id: 4, sender: 'me', text: 'Que ótimo ouvir isso! Vou preparar a próxima versão com as melhorias que discutimos.', time: '10:35' },
    { id: 5, sender: 'them', text: 'Perfeito! A hero section ficou incrível.', time: '10:40' },
];

export default function MessagesPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageText, setMessageText] = useState('');
    const [isPriority, setIsPriority] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className={`dashboard-page ${isLoaded ? 'loaded' : ''}`} style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div className="page-header" style={{ marginBottom: '20px' }}>
                <div className="page-header-left">
                    <h1 className="page-title">Mensagens</h1>
                    <p className="page-subtitle">
                        Comunicação com clientes e equipe
                    </p>
                </div>
            </div>

            {/* Chat Container */}
            <div
                className="glass-panel"
                style={{
                    flex: 1,
                    padding: 0,
                    display: 'flex',
                    overflow: 'hidden',
                    animationDelay: '0.1s'
                }}
            >
                {/* Conversations List */}
                <div style={{
                    width: '320px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Search */}
                    <div style={{ padding: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Buscar conversas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="glass-input"
                                style={{ paddingLeft: '42px' }}
                            />
                            <Search
                                className="w-4 h-4"
                                style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--dash-text-muted)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Priority Support Block */}
                    <div style={{ padding: '0 20px 20px 20px' }}>
                        <div
                            onClick={() => setIsPriority(!isPriority)}
                            style={{
                                padding: '12px',
                                borderRadius: '16px',
                                background: isPriority
                                    ? 'linear-gradient(135deg, rgba(91, 33, 182, 0.4) 0%, rgba(46, 16, 101, 0.4) 100%)'
                                    : 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid',
                                borderColor: isPriority ? '#7c3aed' : 'rgba(255, 255, 255, 0.06)',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: isPriority ? '0 4px 20px rgba(124, 58, 237, 0.25)' : 'none'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: isPriority ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <Zap
                                        className="w-5 h-5"
                                        style={{
                                            color: isPriority ? '#fbbf24' : 'var(--dash-text-muted)',
                                            fill: isPriority ? '#fbbf24' : 'none',
                                            filter: isPriority ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' : 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <h3 style={{
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: isPriority ? 'white' : 'var(--dash-text-primary)',
                                            marginBottom: '2px'
                                        }}>Suporte Prioritário</h3>
                                        <div style={{
                                            width: '32px',
                                            height: '18px',
                                            borderRadius: '10px',
                                            background: isPriority ? '#7c3aed' : 'rgba(255, 255, 255, 0.1)',
                                            position: 'relative',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <div style={{
                                                width: '14px',
                                                height: '14px',
                                                borderRadius: '50%',
                                                background: 'white',
                                                position: 'absolute',
                                                top: '2px',
                                                left: isPriority ? '16px' : '2px',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }} />
                                        </div>
                                    </div>
                                    <p style={{
                                        fontSize: '11px',
                                        color: isPriority ? 'rgba(255, 255, 255, 0.8)' : 'var(--dash-text-muted)',
                                        marginTop: '1px'
                                    }}>
                                        Resposta em até 4h úteis
                                    </p>
                                </div>
                            </div>

                            {/* Animated Shine Effect when active */}
                            {isPriority && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                                    animation: 'shine 2s infinite',
                                    pointerEvents: 'none'
                                }} />
                            )}
                        </div>
                    </div>

                    {/* Conversations */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
                        {conversations.map((conv, index) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '14px',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    marginBottom: '4px',
                                    background: selectedConversation?.id === conv.id
                                        ? 'var(--dash-accent-bg)'
                                        : 'transparent',
                                    border: '1px solid',
                                    borderColor: selectedConversation?.id === conv.id
                                        ? 'rgba(139, 92, 246, 0.2)'
                                        : 'transparent',
                                    transition: 'all 0.3s ease',
                                    opacity: 0,
                                    animation: 'fadeInUp 0.4s ease forwards',
                                    animationDelay: `${0.1 + index * 0.05}s`
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedConversation?.id !== conv.id) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedConversation?.id !== conv.id) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={conv.avatar}
                                        alt={conv.name}
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    {conv.online && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '2px',
                                            right: '2px',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: '#10b981',
                                            border: '2px solid var(--dash-bg-primary)'
                                        }} />
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '4px'
                                    }}>
                                        <span style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: 'var(--dash-text-primary)'
                                        }}>{conv.name}</span>
                                        <span style={{
                                            fontSize: '11px',
                                            color: 'var(--dash-text-muted)'
                                        }}>{conv.time}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span style={{
                                            fontSize: '13px',
                                            color: 'var(--dash-text-muted)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '160px'
                                        }}>{conv.lastMessage}</span>
                                        {conv.unread > 0 && (
                                            <span style={{
                                                minWidth: '20px',
                                                height: '20px',
                                                borderRadius: '10px',
                                                background: 'var(--dash-accent)',
                                                color: 'white',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '0 6px'
                                            }}>{conv.unread}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Chat Header */}
                    <div style={{
                        padding: '16px 24px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={selectedConversation?.avatar}
                                    alt={selectedConversation?.name}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                                {selectedConversation?.online && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '2px',
                                        right: '2px',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: '#10b981',
                                        border: '2px solid var(--dash-bg-primary)'
                                    }} />
                                )}
                            </div>
                            <div>
                                <h3 style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: 'var(--dash-text-primary)',
                                    marginBottom: '2px'
                                }}>{selectedConversation?.name}</h3>
                                <span style={{
                                    fontSize: '12px',
                                    color: selectedConversation?.online ? '#10b981' : 'var(--dash-text-muted)'
                                }}>
                                    {selectedConversation?.online ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-icon">
                                <Phone className="w-4 h-4" />
                            </button>
                            <button className="btn-icon">
                                <Video className="w-4 h-4" />
                            </button>
                            <button className="btn-icon">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        {messages.map((msg, index) => (
                            <div
                                key={msg.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                                    opacity: 0,
                                    animation: 'fadeInUp 0.4s ease forwards',
                                    animationDelay: `${0.2 + index * 0.08}s`
                                }}
                            >
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '14px 18px',
                                    borderRadius: msg.sender === 'me'
                                        ? '20px 20px 4px 20px'
                                        : '20px 20px 20px 4px',
                                    background: msg.sender === 'me'
                                        ? 'linear-gradient(135deg, #5b21b6, #2e1065)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                    color: msg.sender === 'me' ? 'white' : 'var(--dash-text-primary)',
                                    boxShadow: msg.sender === 'me' ? '0 4px 12px rgba(91, 33, 182, 0.3)' : 'none',
                                    fontSize: '14px',
                                    lineHeight: '1.5'
                                }}>
                                    {msg.text}
                                    <div style={{
                                        fontSize: '11px',
                                        marginTop: '6px',
                                        opacity: 0.7,
                                        textAlign: msg.sender === 'me' ? 'right' : 'left'
                                    }}>
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div style={{
                        padding: '16px 24px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 8px 8px 20px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}>
                            <input
                                type="text"
                                placeholder="Digite sua mensagem..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '14px',
                                    color: 'var(--dash-text-primary)'
                                }}
                            />
                            <button className="btn-icon" style={{ background: 'transparent' }}>
                                <Smile className="w-5 h-5" />
                            </button>
                            <button className="btn-icon" style={{ background: 'transparent' }}>
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <button className="btn-icon" style={{ background: 'transparent' }}>
                                <Image className="w-5 h-5" />
                            </button>
                            <button
                                className="btn-primary"
                                style={{
                                    borderRadius: '12px',
                                    padding: '10px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
