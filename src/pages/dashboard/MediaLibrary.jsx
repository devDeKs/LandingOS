import React, { useState } from 'react';
import { Upload, FolderPlus, Grid, List, Search, MoreHorizontal, Image as ImageIcon, X } from 'lucide-react';

const mockImages = [
    { id: 1, name: 'hero-section.png', folder: 'Landing Page', size: '2.4 MB', date: '18 Dez 2024', url: 'https://picsum.photos/seed/img1/400/300' },
    { id: 2, name: 'logo-principal.svg', folder: 'Brand', size: '156 KB', date: '17 Dez 2024', url: 'https://picsum.photos/seed/img2/400/300' },
    { id: 3, name: 'pricing-section.png', folder: 'Landing Page', size: '1.8 MB', date: '16 Dez 2024', url: 'https://picsum.photos/seed/img3/400/300' },
    { id: 4, name: 'testimonial-bg.jpg', folder: 'Assets', size: '3.2 MB', date: '15 Dez 2024', url: 'https://picsum.photos/seed/img4/400/300' },
    { id: 5, name: 'icon-set.svg', folder: 'Brand', size: '89 KB', date: '14 Dez 2024', url: 'https://picsum.photos/seed/img5/400/300' },
    { id: 6, name: 'footer-design.png', folder: 'Landing Page', size: '1.1 MB', date: '13 Dez 2024', url: 'https://picsum.photos/seed/img6/400/300' },
];

const folders = ['Todos', 'Landing Page', 'Brand', 'Assets', 'Referências'];

export default function MediaLibrary() {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedFolder, setSelectedFolder] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredImages = mockImages.filter(img => {
        const matchesFolder = selectedFolder === 'Todos' || img.folder === selectedFolder;
        const matchesSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFolder && matchesSearch;
    });

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--dash-text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                        Biblioteca de Mídia
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--dash-text-muted)' }}>
                        {filteredImages.length} arquivos · Gerencie imagens e referências
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <FolderPlus className="w-4 h-4" />
                        Nova Pasta
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                {/* Folders */}
                <div className="flex items-center gap-2 flex-wrap">
                    {folders.map(folder => (
                        <button
                            key={folder}
                            onClick={() => setSelectedFolder(folder)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${selectedFolder === folder
                                    ? 'bg-[var(--dash-accent)] text-white'
                                    : 'bg-[var(--dash-bg-tertiary)] hover:bg-[var(--dash-accent-bg)]'
                                }`}
                            style={{ color: selectedFolder === folder ? 'white' : 'var(--dash-text-secondary)' }}
                        >
                            {folder}
                        </button>
                    ))}
                </div>

                {/* Search & View Toggle */}
                <div className="flex items-center gap-3 ml-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar arquivos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 pl-9 pr-4 rounded-lg text-sm w-48"
                            style={{
                                backgroundColor: 'var(--dash-bg-tertiary)',
                                color: 'var(--dash-text-primary)',
                                border: '1px solid var(--dash-border)'
                            }}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--dash-text-muted)' }} />
                    </div>
                    <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: 'var(--dash-border)' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[var(--dash-accent-bg)]' : 'bg-[var(--dash-bg-tertiary)]'}`}
                            style={{ color: viewMode === 'grid' ? 'var(--dash-accent)' : 'var(--dash-text-muted)' }}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[var(--dash-accent-bg)]' : 'bg-[var(--dash-bg-tertiary)]'}`}
                            style={{ color: viewMode === 'list' ? 'var(--dash-accent)' : 'var(--dash-text-muted)' }}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredImages.map(img => (
                        <div key={img.id} className="dashboard-card group overflow-hidden">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={img.url}
                                    alt={img.name}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors">
                                        <ImageIcon className="w-5 h-5 text-gray-800" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium truncate" style={{ color: 'var(--dash-text-primary)' }}>
                                    {img.name}
                                </p>
                                <p className="text-xs mt-1" style={{ color: 'var(--dash-text-muted)' }}>
                                    {img.size} · {img.date}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="dashboard-card overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
                                <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--dash-text-muted)' }}>Nome</th>
                                <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--dash-text-muted)' }}>Pasta</th>
                                <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--dash-text-muted)' }}>Tamanho</th>
                                <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--dash-text-muted)' }}>Data</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredImages.map(img => (
                                <tr key={img.id} className="hover:bg-[var(--dash-bg-tertiary)] transition-colors" style={{ borderBottom: '1px solid var(--dash-border)' }}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={img.url} alt={img.name} className="w-10 h-10 rounded object-cover" />
                                            <span className="text-sm font-medium" style={{ color: 'var(--dash-text-primary)' }}>{img.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm" style={{ color: 'var(--dash-text-secondary)' }}>{img.folder}</td>
                                    <td className="p-4 text-sm" style={{ color: 'var(--dash-text-secondary)' }}>{img.size}</td>
                                    <td className="p-4 text-sm" style={{ color: 'var(--dash-text-muted)' }}>{img.date}</td>
                                    <td className="p-4">
                                        <button className="p-1 rounded hover:bg-[var(--dash-accent-bg)]">
                                            <MoreHorizontal className="w-4 h-4" style={{ color: 'var(--dash-text-muted)' }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
