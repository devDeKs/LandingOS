import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Paperclip, MessageCircle, Settings2 } from 'lucide-react';
import Modal from '../../components/dashboard/Modal';
import './ProjectsPage.css';

// Membros da equipe mockados
const teamMembers = [
    { id: 1, avatar: 'https://i.pravatar.cc/40?img=1', name: 'Ana' },
    { id: 2, avatar: 'https://i.pravatar.cc/40?img=2', name: 'Carlos' },
    { id: 3, avatar: 'https://i.pravatar.cc/40?img=3', name: 'Maria' },
    { id: 4, avatar: 'https://i.pravatar.cc/40?img=4', name: 'Pedro' },
    { id: 5, avatar: 'https://i.pravatar.cc/40?img=5', name: 'Julia' },
];

// Categorias baseadas em TIPO de tarefa
const landingPageCategories = [
    { name: 'Design & UX', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
    { name: 'Referência', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
    { name: 'Frontend', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    { name: 'Infraestrutura', color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)' },
    { name: 'Integração', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    { name: 'SEO & Marketing', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    { name: 'Conteúdo', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
    { name: 'Backend', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
];

// Função para obter categoria por nome
const getCategory = (name) => landingPageCategories.find(c => c.name === name) || landingPageCategories[0];

// Dados iniciais das colunas Kanban - Fluxo de Criação de Landing Page
const initialColumns = {
    referencias: {
        id: 'referencias',
        title: 'Suas Referências',
        cards: [
            {
                id: 'card-ref-1',
                category: 'Referência',
                description: 'Referências visuais do site da Clinica Mayo - Foco na Hero Section limpa.',
                progress: 0,
                attachments: 5,
                comments: 2,
                members: [1, 2]
            },
            {
                id: 'card-ref-2',
                category: 'Design & UX',
                description: 'Paleta de cores inspirada no perfil do Instagram @dermatodream (Tons pastéis).',
                progress: 0,
                attachments: 3,
                comments: 1,
                members: [1]
            },
            {
                id: 'card-ref-3',
                category: 'Referência',
                description: 'Exemplo de carrossel de "Antes e Depois" que gostamos muito. Animado e interativo.',
                progress: 0,
                attachments: 8,
                comments: 4,
                members: [1, 3]
            },
            {
                id: 'card-ref-4',
                category: 'SEO & Marketing',
                description: 'Benchmark de concorrentes locais - Prints das seções de preços.',
                progress: 0,
                attachments: 12,
                comments: 0,
                members: [1, 2, 4]
            },
        ]
    },
    aguardando: {
        id: 'aguardando',
        title: 'Aguardando Aprovação',
        cards: [
            {
                id: 'card-apr-1',
                category: 'Frontend',
                description: 'Hero Section V1 - Vídeo de background com chamada para ação flutuante.',
                progress: 80,
                attachments: 2,
                comments: 5,
                members: [2, 3]
            },
            {
                id: 'card-apr-2',
                category: 'Frontend',
                description: 'Seção de Tratamentos - Grid interativo com hover effects em vidro.',
                progress: 75,
                attachments: 4,
                comments: 3,
                members: [3, 4]
            },
            {
                id: 'card-apr-3',
                category: 'Design & UX',
                description: 'Área de Depoimentos - Design estilo "Twitter Cards" com fotos reais.',
                progress: 90,
                attachments: 1,
                comments: 2,
                members: [2, 5]
            },
        ]
    },
    aprovados: {
        id: 'aprovados',
        title: 'Aprovados',
        cards: [
            {
                id: 'card-ok-1',
                category: 'Infraestrutura',
                description: 'Domínio (draclaudia.com.br) configurado e propagado no Cloudflare.',
                progress: 100,
                attachments: 1,
                comments: 0,
                members: [4]
            },
            {
                id: 'card-ok-2',
                category: 'Integração',
                description: 'Integração de Gateway de Pagamento (Stripe) - Testes realizados com sucesso.',
                progress: 100,
                attachments: 3,
                comments: 1,
                members: [4, 5]
            },
            {
                id: 'card-ok-3',
                category: 'Conteúdo',
                description: 'Seção "Sobre a Doutora" - Copy e fotos aprovadas pela equipe.',
                progress: 100,
                attachments: 2,
                comments: 6,
                members: [1, 3]
            },
        ]
    },
    finalizados: {
        id: 'finalizados',
        title: 'Finalizados',
        cards: [
            {
                id: 'card-done-1',
                category: 'Infraestrutura',
                description: 'Setup do Servidor VPS (DigitalOcean) com Docker e Nginx configurados.',
                progress: 100,
                attachments: 0,
                comments: 2,
                members: [4]
            },
            {
                id: 'card-done-2',
                category: 'SEO & Marketing',
                description: 'SEO Técnico - Meta tags, Sitemap XML e robots.txt otimizados.',
                progress: 100,
                attachments: 1,
                comments: 0,
                members: [3, 5]
            },
            {
                id: 'card-done-3',
                category: 'SEO & Marketing',
                description: 'Instalação de Pixels de Rastreamento (Meta Ads e Google Analytics 4).',
                progress: 100,
                attachments: 2,
                comments: 1,
                members: [2, 4]
            },
        ]
    }
};

function ProjectCard({ card, index, onDragStart }) {
    const cardMembers = teamMembers.filter(m => card.members.includes(m.id));
    const category = getCategory(card.category);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, card.id)}
            className="project-card"
            style={{
                animationDelay: `${index * 0.1}s`,
            }}
        >
            {/* Cabeçalho do Card com Tag e Menu */}
            <div className="project-card-header">
                <span
                    className="project-tag"
                    style={{
                        backgroundColor: category.bg,
                        color: category.color,
                        borderColor: category.color
                    }}
                >
                    {card.category}
                </span>
                <button className="project-card-menu">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Descrição do Card */}
            <p className="project-card-description">
                {card.description}
            </p>

            {/* Seção de Progresso */}
            <div className="project-progress-section">
                <div className="project-progress-bar">
                    <div
                        className="project-progress-fill"
                        style={{
                            width: `${card.progress}%`,
                            background: `linear-gradient(90deg, ${category.color}, ${category.color}cc)`
                        }}
                    />
                </div>
                <span className="project-progress-text">{card.progress}%</span>
            </div>

            {/* Rodapé do Card */}
            <div className="project-card-footer">
                {/* Membros da Equipe */}
                <div className="project-members">
                    {cardMembers.slice(0, 4).map((member, idx) => (
                        <img
                            key={member.id}
                            src={member.avatar}
                            alt={member.name}
                            className="project-member-avatar"
                            style={{
                                zIndex: 10 - idx,
                                animationDelay: `${0.3 + idx * 0.1}s`
                            }}
                        />
                    ))}
                    {cardMembers.length > 4 && (
                        <span className="project-member-more">
                            +{cardMembers.length - 4}
                        </span>
                    )}
                </div>

                {/* Anexos e Comentários */}
                <div className="project-card-stats">
                    <span className="project-stat">
                        <Paperclip className="w-3.5 h-3.5" />
                        {card.attachments}
                    </span>
                    <span className="project-stat">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {card.comments}
                    </span>
                </div>
            </div>
        </div>
    );
}

function KanbanColumn({ column, cards, onDragStart, onDragOver, onDrop, columnIndex }) {
    return (
        <div
            className="kanban-column-wrapper"
            style={{ animationDelay: `${columnIndex * 0.15}s` }}
        >
            {/* Cabeçalho da Coluna */}
            <div className="kanban-column-header-new">
                <h3 className="kanban-column-title">{column.title}</h3>
                <button className="kanban-add-btn">
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Container da Coluna com Background */}
            <div
                className="kanban-column-new"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, column.id)}
            >
                {/* Container dos Cards */}
                <div className="kanban-cards-container">
                    {cards.map((card, index) => (
                        <ProjectCard
                            key={card.id}
                            card={card}
                            index={index}
                            onDragStart={onDragStart}
                        />
                    ))}

                    {cards.length === 0 && (
                        <div className="kanban-empty-state">
                            <p>Arraste itens aqui</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProjectsPage() {
    const [columns, setColumns] = useState(initialColumns);
    const [draggedCard, setDraggedCard] = useState(null);
    const [sourceColumn, setSourceColumn] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateProject = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsNewProjectModalOpen(false);
        }, 1500);
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

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

        if (!draggedCard || !sourceColumn || sourceColumn === targetColumnId) {
            return;
        }

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
        <div className={`projects-page ${isLoaded ? 'loaded' : ''}`}>
            {/* Cabeçalho */}
            <div className="projects-header">
                <div className="projects-header-left">
                    <h1 className="projects-title">Projetos</h1>
                </div>
                <div className="projects-header-right">
                    <button className="projects-filter-btn">
                        <Settings2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsNewProjectModalOpen(true)} className="projects-create-btn">
                        <Plus className="w-4 h-4" />
                        Criar Projeto
                    </button>
                </div>
            </div>

            {/* Quadro Kanban */}
            <div className="kanban-board">
                {Object.values(columns).map((column, index) => (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        cards={column.cards}
                        columnIndex={index}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />
                ))}
            </div>


            {/* New Project Modal */}
            <Modal
                isOpen={isNewProjectModalOpen}
                onClose={() => setIsNewProjectModalOpen(false)}
                title="Novo Projeto"
            >
                <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Nome do Projeto</label>
                        <input
                            type="text"
                            placeholder="Ex: Landing Page Tech"
                            className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[var(--dash-accent)] transition-colors"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Cliente</label>
                            <input
                                type="text"
                                placeholder="Ex: Acme Corp"
                                className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[var(--dash-accent)] transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Prazo</label>
                            <input
                                type="date"
                                className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[var(--dash-accent)] transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Categoria</label>
                        <select className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[var(--dash-accent)] transition-colors appearance-none">
                            <option value="">Selecione...</option>
                            <option value="design">Design & UX</option>
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="seo">SEO & Marketing</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Descrição</label>
                        <textarea
                            rows="3"
                            placeholder="Descreva o escopo do projeto..."
                            className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[var(--dash-accent)] transition-colors resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsNewProjectModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--dash-text-secondary)] hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Criar Projeto
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
