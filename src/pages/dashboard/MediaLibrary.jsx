import React, { useState, useEffect } from 'react';
import { Upload, FolderPlus, Grid, List, Search, MoreHorizontal, Image as ImageIcon, Eye, Download, Trash2, X, Cloud } from 'lucide-react';
import Modal from '../../components/dashboard/Modal';

const mockImages = [
    { id: 1, name: 'hero-section.png', folder: 'Landing Page', size: '2.4 MB', date: '18 Dez 2024', url: 'https://picsum.photos/seed/img1/400/300' },
    { id: 2, name: 'logo-principal.svg', folder: 'Brand', size: '156 KB', date: '17 Dez 2024', url: 'https://picsum.photos/seed/img2/400/300' },
    { id: 3, name: 'pricing-section.png', folder: 'Landing Page', size: '1.8 MB', date: '16 Dez 2024', url: 'https://picsum.photos/seed/img3/400/300' },
    { id: 4, name: 'testimonial-bg.jpg', folder: 'Assets', size: '3.2 MB', date: '15 Dez 2024', url: 'https://picsum.photos/seed/img4/400/300' },
    { id: 5, name: 'icon-set.svg', folder: 'Brand', size: '89 KB', date: '14 Dez 2024', url: 'https://picsum.photos/seed/img5/400/300' },
    { id: 6, name: 'footer-design.png', folder: 'Landing Page', size: '1.1 MB', date: '13 Dez 2024', url: 'https://picsum.photos/seed/img6/400/300' },
    { id: 7, name: 'about-section.png', folder: 'Assets', size: '2.1 MB', date: '12 Dez 2024', url: 'https://picsum.photos/seed/img7/400/300' },
    { id: 8, name: 'cta-background.jpg', folder: 'Assets', size: '1.5 MB', date: '11 Dez 2024', url: 'https://picsum.photos/seed/img8/400/300' },
];

const folders = ['Todos', 'Landing Page', 'Brand', 'Assets', 'Referências'];

export default function MediaLibrary() {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedFolder, setSelectedFolder] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    const [isLoaded, setIsLoaded] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState([]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files) => {
        const newFiles = Array.from(files).map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            progress: 0,
            status: 'uploading'
        }));
        setUploadingFiles(prev => [...prev, ...newFiles]);

        // Simulate upload
        newFiles.forEach((file, index) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadingFiles(prev => prev.map(f =>
                    f.name === file.name ? { ...f, progress } : f
                ));
                if (progress >= 100) {
                    clearInterval(interval);
                    setUploadingFiles(prev => prev.map(f =>
                        f.name === file.name ? { ...f, status: 'completed' } : f
                    ));
                }
            }, 300);
        });
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const filteredImages = mockImages.filter(img => {
        const matchesFolder = selectedFolder === 'Todos' || img.folder === selectedFolder;
        const matchesSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFolder && matchesSearch;
    });

    return (
        <div className={`dashboard-page ${isLoaded ? 'loaded' : ''}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-title">Biblioteca de Mídia</h1>
                    <p className="page-subtitle">
                        {filteredImages.length} arquivos · Gerencie imagens e referências
                    </p>
                </div>
                <div className="page-header-right">
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FolderPlus className="w-4 h-4" />
                        Nova Pasta
                    </button>
                    <button onClick={() => setIsUploadModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px',
                animation: 'fadeInUp 0.5s ease forwards',
                animationDelay: '0.1s',
                opacity: 0
            }}>
                {/* Folders */}
                <div className="filter-pills">
                    {folders.map(folder => (
                        <button
                            key={folder}
                            onClick={() => setSelectedFolder(folder)}
                            className={`filter-pill ${selectedFolder === folder ? 'active' : ''}`}
                        >
                            {folder}
                        </button>
                    ))}
                </div>

                {/* Search & View Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Buscar arquivos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="glass-input"
                            style={{
                                paddingLeft: '42px',
                                width: '220px'
                            }}
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
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        background: 'rgba(255, 255, 255, 0.03)'
                    }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            className="btn-icon"
                            style={{
                                borderRadius: 0,
                                border: 'none',
                                background: viewMode === 'grid' ? 'var(--dash-accent-bg)' : 'transparent',
                                color: viewMode === 'grid' ? 'var(--dash-accent)' : 'var(--dash-text-muted)'
                            }}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className="btn-icon"
                            style={{
                                borderRadius: 0,
                                border: 'none',
                                background: viewMode === 'list' ? 'var(--dash-accent-bg)' : 'transparent',
                                color: viewMode === 'list' ? 'var(--dash-accent)' : 'var(--dash-text-muted)'
                            }}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'grid' ? (
                <div className="media-grid">
                    {filteredImages.map((img, index) => (
                        <div
                            key={img.id}
                            className="media-card"
                            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                        >
                            <div className="media-card-image">
                                <img
                                    src={img.url}
                                    alt={img.name}
                                />
                                <div className="media-card-overlay">
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="btn-icon"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                color: '#1a1a2e'
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="btn-icon"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                color: '#1a1a2e'
                                            }}
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="media-card-info">
                                <p className="media-card-name">{img.name}</p>
                                <p className="media-card-meta">{img.size} · {img.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    className="glass-panel"
                    style={{
                        padding: 0,
                        overflow: 'hidden',
                        animationDelay: '0.2s'
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                                <th style={{
                                    textAlign: 'left',
                                    padding: '16px 20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: 'var(--dash-text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>Nome</th>
                                <th style={{
                                    textAlign: 'left',
                                    padding: '16px 20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: 'var(--dash-text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>Pasta</th>
                                <th style={{
                                    textAlign: 'left',
                                    padding: '16px 20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: 'var(--dash-text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>Tamanho</th>
                                <th style={{
                                    textAlign: 'left',
                                    padding: '16px 20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: 'var(--dash-text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>Data</th>
                                <th style={{ width: '60px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredImages.map((img, index) => (
                                <tr
                                    key={img.id}
                                    style={{
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        opacity: 0,
                                        animation: 'fadeInUp 0.4s ease forwards',
                                        animationDelay: `${0.1 + index * 0.05}s`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <img
                                                src={img.url}
                                                alt={img.name}
                                                style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '10px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: 'var(--dash-text-primary)'
                                            }}>{img.name}</span>
                                        </div>
                                    </td>
                                    <td style={{
                                        padding: '14px 20px',
                                        fontSize: '13px',
                                        color: 'var(--dash-text-secondary)'
                                    }}>
                                        <span
                                            className="tag"
                                            style={{
                                                background: 'rgba(139, 92, 246, 0.1)',
                                                color: 'var(--dash-accent)',
                                                borderColor: 'transparent'
                                            }}
                                        >
                                            {img.folder}
                                        </span>
                                    </td>
                                    <td style={{
                                        padding: '14px 20px',
                                        fontSize: '13px',
                                        color: 'var(--dash-text-secondary)'
                                    }}>{img.size}</td>
                                    <td style={{
                                        padding: '14px 20px',
                                        fontSize: '13px',
                                        color: 'var(--dash-text-muted)'
                                    }}>{img.date}</td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <button
                                            className="btn-icon"
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: 'transparent'
                                            }}
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Upload Modal */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Upload de Arquivos"
            >
                <div className="space-y-6">
                    {/* Drag & Drop Area */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-[var(--dash-accent)] bg-[var(--dash-accent-bg)]/10' : 'border-white/10 hover:border-white/20'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            id="file-upload"
                            onChange={handleChange}
                        />
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[var(--dash-bg-secondary)] flex items-center justify-center">
                                <Cloud className="w-8 h-8 text-[var(--dash-accent)]" />
                            </div>
                            <div>
                                <p className="text-lg font-medium text-white mb-1">Arraste arquivos aqui</p>
                                <p className="text-sm text-[var(--dash-text-secondary)]">
                                    ou <label htmlFor="file-upload" className="text-[var(--dash-accent)] cursor-pointer hover:underline">selecione do computador</label>
                                </p>
                            </div>
                            <p className="text-xs text-[var(--dash-text-muted)]">
                                SVG, PNG, JPG ou GIF (max. 10MB)
                            </p>
                        </div>
                    </div>

                    {/* File List */}
                    {uploadingFiles.length > 0 && (
                        <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                            {uploadingFiles.map((file, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--dash-bg-secondary)] flex items-center justify-center flex-shrink-0">
                                        <ImageIcon className="w-5 h-5 text-[var(--dash-text-muted)]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                            <span className="text-xs text-[var(--dash-text-muted)]">{file.size}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--dash-accent)] transition-all duration-300"
                                                style={{ width: `${file.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    {file.status === 'completed' && (
                                        <div className="text-green-500">
                                            <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-500" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            onClick={() => setIsUploadModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--dash-text-secondary)] hover:bg-white/5 transition-colors"
                        >
                            Concluir
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
