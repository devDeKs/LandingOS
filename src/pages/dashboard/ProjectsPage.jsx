import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Paperclip, MessageCircle, Settings2, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/dashboard/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// Mock Team Members
const teamMembers = [
    { id: 1, avatar: 'https://i.pravatar.cc/150?u=1', name: 'Ana' },
    { id: 2, avatar: 'https://i.pravatar.cc/150?u=2', name: 'Carlos' },
    { id: 3, avatar: 'https://i.pravatar.cc/150?u=3', name: 'Maria' },
    { id: 4, avatar: 'https://i.pravatar.cc/150?u=4', name: 'Pedro' },
    { id: 5, avatar: 'https://i.pravatar.cc/150?u=5', name: 'Julia' },
];

// Categories
const projectCategories = [
    { name: 'Design & UX', color: '#ec4899' },
    { name: 'Frontend', color: '#3b82f6' },
    { name: 'Infraestrutura', color: '#64748b' },
    { name: 'Integração', color: '#f59e0b' },
    { name: 'SEO & Marketing', color: '#10b981' },
    { name: 'Conteúdo', color: '#f97316' },
    { name: 'Backend', color: '#6366f1' },
    { name: 'Referência', color: '#8b5cf6' },
];

const getCategory = (name) => projectCategories.find(c => c.name === name) || projectCategories[0];

// Initial Data - 3 Columns Only
const initialColumns = {
    aguardando: {
        id: 'aguardando',
        title: 'Aguardando Aprovação',
        color: '#8b5cf6', // Violet
        cards: [
            {
                id: 'card-apr-1',
                category: 'Frontend',
                description: 'Hero Section V1 - Vídeo de background com chamada para ação flutuante.',
                progress: 80,
                attachments: 2,
                comments: 5,
                members: [2, 3],
                updatedAt: 'Há 2h'
            },
            {
                id: 'card-apr-2',
                category: 'Design & UX',
                description: 'Seção de Tratamentos - Grid interativo com hover effects em vidro.',
                progress: 75,
                attachments: 4,
                comments: 3,
                members: [3, 4],
                updatedAt: 'Há 4h'
            },
            {
                id: 'card-apr-3',
                category: 'Conteúdo',
                description: 'Revisão final dos textos institucionais e biografia.',
                progress: 90,
                attachments: 1,
                comments: 2,
                members: [1, 5],
                updatedAt: 'Há 5h'
            },
        ]
    },
    aprovados: {
        id: 'aprovados',
        title: 'Aprovados',
        color: '#10b981', // Emerald
        cards: [
            {
                id: 'card-ok-1',
                category: 'Infraestrutura',
                description: 'Domínio configurado e propagado no Cloudflare.',
                progress: 100,
                attachments: 1,
                comments: 0,
                members: [4],
                updatedAt: 'Ontem'
            },
            {
                id: 'card-ok-2',
                category: 'Integração',
                description: 'Gateway de Pagamento (Stripe) - Testes realizados.',
                progress: 100,
                attachments: 3,
                comments: 1,
                members: [4, 5],
                updatedAt: 'Ontem'
            },
        ]
    },
    finalizados: {
        id: 'finalizados',
        title: 'Finalizados',
        color: '#3b82f6', // Blue
        cards: [
            {
                id: 'card-done-1',
                category: 'Infraestrutura',
                description: 'Setup do Servidor VPS (DigitalOcean).',
                progress: 100,
                attachments: 0,
                comments: 2,
                members: [4],
                updatedAt: '2 dias atrás'
            },
            {
                id: 'card-done-2',
                category: 'SEO & Marketing',
                description: 'SEO Técnico - Meta tags e Sitemap XML.',
                progress: 100,
                attachments: 1,
                comments: 0,
                members: [3, 5],
                updatedAt: '3 dias atrás'
            },
        ]
    }
};

function ProjectCard({ card, index, onDragStart, columnId, onApprove }) {
    const { isDarkMode } = useTheme();
    const cardMembers = teamMembers.filter(m => card.members.includes(m.id));
    const category = getCategory(card.category);
    const isApprovalColumn = columnId === 'aguardando';

    return (
        <motion.div
            layout
            layoutId={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            draggable
            onDragStart={(e) => onDragStart(e, card.id)}
            className={`relative group p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-lg hover:-translate-y-1
                ${isDarkMode
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:shadow-purple-500/10'
                    : 'bg-white/60 border-slate-200 shadow-sm hover:shadow-md hover:bg-white'
                }
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <span
                    className="text-[10px] px-2.5 py-1 rounded-full border font-medium tracking-wide uppercase"
                    style={{
                        borderColor: `${category.color}40`,
                        backgroundColor: `${category.color}15`,
                        color: category.color
                    }}
                >
                    {card.category}
                </span>
                <button className={`transition-colors ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <p className={`text-sm font-medium mb-5 leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {card.description}
            </p>

            {/* Progress Bar */}
            <div className={`w-full h-1.5 rounded-full mb-4 overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${card.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{
                        background: `linear-gradient(90deg, ${category.color}, #f0abfc)`
                    }}
                />
            </div>

            {/* Approve Button for "Aguardando" Column */}
            {isApprovalColumn && (
                <button
                    onClick={() => onApprove(card)}
                    className="w-full mb-4 group/btn relative overflow-hidden rounded-xl bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10 border border-white/10 hover:border-purple-500/30"
                >
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <span className="relative flex items-center justify-center gap-2 tracking-wide">
                        APROVAR AGORA
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 group-hover/btn:translate-x-0.5 transition-transform">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </span>
                </button>
            )}

            {/* Footer */}
            <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200/50'}`}>
                <div className="flex -space-x-2">
                    {cardMembers.slice(0, 3).map((member) => (
                        <img
                            key={member.id}
                            src={member.avatar}
                            alt={member.name}
                            className={`w-6 h-6 rounded-full object-cover ring-2 ${isDarkMode ? 'border-[#0B0B0F] ring-black/20' : 'border-white ring-white'}`}
                        />
                    ))}
                    {cardMembers.length > 3 && (
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[8px]
                            ${isDarkMode ? 'bg-slate-800 border-[#0B0B0F] text-white' : 'bg-slate-100 border-white text-slate-600'}
                        `}>
                            +{cardMembers.length - 3}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-medium flex items-center gap-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`}></div>
                        {card.updatedAt}
                    </span>
                    <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {card.attachments > 0 && (
                            <span className="flex items-center gap-1 text-[10px]">
                                <Paperclip className="w-3 h-3" /> {card.attachments}
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-[10px]">
                            <MessageCircle className="w-3 h-3" /> {card.comments}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function KanbanColumn({ column, Cards, onDragStart, onDragOver, onDrop, columnIndex, onApprove }) {
    const { isDarkMode } = useTheme();

    return (
        <div className="flex flex-col h-full min-w-[320px] lg:min-w-[350px]">
            {/* Column Header */}
            <div className={`flex items-center justify-between mb-6 px-1`}>
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_10px]`} style={{ backgroundColor: column.color, boxShadow: `0 0 10px ${column.color}` }}></div>
                    <h3 className={`text-sm font-semibold tracking-wide uppercase ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{column.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border
                        ${isDarkMode ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-slate-200 text-slate-600 border-slate-300'}
                    `}>
                        {Cards.length}
                    </span>
                </div>
                {columnIndex === 0 && (
                    <button className={`p-1.5 rounded-lg transition-colors
                        ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-900'}
                    `}>
                        <Plus className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Cards Container */}
            <div
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, column.id)}
                className={`flex-1 rounded-2xl border p-4 flex flex-col gap-4 transition-colors
                    ${isDarkMode
                        ? 'bg-white/[0.02] border-white/[0.02] hover:bg-white/[0.03]'
                        : 'bg-slate-100/50 border-slate-200/50 hover:bg-slate-100'
                    }
                `}
            >
                <AnimatePresence mode="popLayout">
                    {Cards.map((card, index) => (
                        <ProjectCard
                            key={card.id}
                            card={card}
                            index={index}
                            columnId={column.id}
                            onDragStart={onDragStart}
                            onApprove={onApprove}
                        />
                    ))}
                </AnimatePresence>

                {Cards.length === 0 && (
                    <div className={`h-32 border border-dashed rounded-xl flex flex-col items-center justify-center gap-2
                        ${isDarkMode ? 'border-white/10 bg-white/[0.01] text-slate-500' : 'border-slate-300 bg-slate-50/50 text-slate-400'}
                    `}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <Plus className="w-4 h-4 opacity-50" />
                        </div>
                        <span className="text-xs">Nenhum item</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProjectsPage() {
    const { isDarkMode } = useTheme();
    const [columns, setColumns] = useState(initialColumns);
    const [draggedCard, setDraggedCard] = useState(null);
    const [sourceColumn, setSourceColumn] = useState(null);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

    // Approval Handler
    const handleApprove = (card) => {
        // Find source column (should be 'aguardando')
        const sourceColId = 'aguardando';
        const targetColId = 'aprovados';

        // Animate move
        setColumns(prev => {
            const sourceCards = prev[sourceColId].cards.filter(c => c.id !== card.id);
            // Add to target with updated status if needed
            const updatedCard = { ...card, progress: 100, updatedAt: 'Agora' };
            const targetCards = [updatedCard, ...prev[targetColId].cards];

            return {
                ...prev,
                [sourceColId]: { ...prev[sourceColId], cards: sourceCards },
                [targetColId]: { ...prev[targetColId], cards: targetCards }
            };
        });
    };

    const handleDragStart = (e, cardId) => {
        for (const [colId, col] of Object.entries(columns)) {
            const card = col.cards.find(c => c.id === cardId);
            if (card) {
                setDraggedCard(card);
                setSourceColumn(colId);
                e.dataTransfer.effectAllowed = 'move';
                break;
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetColumnId) => {
        e.preventDefault();
        if (!draggedCard || !sourceColumn || sourceColumn === targetColumnId) return;

        setColumns(prev => {
            const newColumns = { ...prev };
            newColumns[sourceColumn] = {
                ...newColumns[sourceColumn],
                cards: newColumns[sourceColumn].cards.filter(c => c.id !== draggedCard.id)
            };
            newColumns[targetColumnId] = {
                ...newColumns[targetColumnId],
                cards: [...newColumns[targetColumnId].cards, draggedCard]
            };
            return newColumns;
        });
        setDraggedCard(null);
        setSourceColumn(null);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Page Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className={`text-3xl font-display font-bold mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Projetos Ativos</h1>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Gerencie o fluxo de aprovação das suas landing pages.</p>
                </div>
                <div className="flex gap-3">
                    <button className={`p-2.5 rounded-xl border transition-colors
                        ${isDarkMode
                            ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                            : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }
                    `}>
                        <Settings2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsNewProjectModalOpen(true)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg
                            ${isDarkMode
                                ? 'bg-white text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
                            }
                        `}
                    >
                        <Plus className="w-5 h-5" />
                        Criar Projeto
                    </button>
                </div>
            </header>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar pb-6">
                <div className="flex gap-6 h-full min-w-max px-1">
                    {Object.values(columns).map((column, index) => (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            Cards={column.cards}
                            columnIndex={index}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onApprove={handleApprove}
                        />
                    ))}
                </div>
            </div>

            {/* Status Widget (Floating) */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className={`fixed bottom-8 right-8 backdrop-blur-xl border p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-float z-50 group cursor-default
                    ${isDarkMode
                        ? 'bg-white/10 border-white/10'
                        : 'bg-white/80 border-slate-200 shadow-slate-300'
                    }
                `}
                style={{ boxShadow: isDarkMode ? '0 20px 40px -10px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(0,0,0,0.1)' }}
            >
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping opacity-20"></div>
                </div>
                <div>
                    <h4 className={`text-sm font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Status do Projeto</h4>
                    <p className="text-xs text-emerald-400 font-medium">Em dia (On Track)</p>
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute -top-12 right-0 bg-black/90 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Última verificação: Há 5 min
                </div>
            </motion.div>

            {/* Modal remains mostly the same, just styled basics if needed */}
            <Modal
                isOpen={isNewProjectModalOpen}
                onClose={() => setIsNewProjectModalOpen(false)}
                title="Novo Projeto"
            >
                {/* Form content simplified for this step - assuming reuse of previous form logic or simplified for demo */}
                <div className="text-center py-8 text-slate-400">
                    <p>Formulário de criação simplificado para demo.</p>
                </div>
            </Modal>
        </div>
    );
}
