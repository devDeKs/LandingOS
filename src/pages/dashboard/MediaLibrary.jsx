import React, { useState, useEffect } from 'react';
import { Grid, List, Search, Image as ImageIcon, Eye, Download, Loader2, FolderOpen, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function MediaLibrary() {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch images from client's projects
    const fetchImages = async () => {
        if (!user) return;

        setLoading(true);
        try {
            // Fetch all projects for this client that have images
            const { data: projectsData, error } = await supabase
                .from('projects')
                .select('id, name, image_url, category, created_at, updated_at')
                .eq('client_id', user.id)
                .is('deleted_at', null)
                .not('image_url', 'is', null)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            // Transform projects to image items
            const imageItems = (projectsData || [])
                .filter(p => p.image_url && p.image_url.trim() !== '')
                .map(project => ({
                    id: project.id,
                    name: project.name,
                    url: project.image_url,
                    project: project.name,
                    category: project.category || 'Geral',
                    date: formatDate(project.updated_at || project.created_at)
                }));

            setImages(imageItems);

            // Extract unique categories for filter
            const uniqueCategories = [...new Set(imageItems.map(img => img.category))];
            setCategories(['Todos', ...uniqueCategories]);

        } catch (err) {
            console.error('Error fetching images:', err);
        } finally {
            setLoading(false);
            setIsLoaded(true);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    useEffect(() => {
        fetchImages();
    }, [user]);

    // Filter images
    const filteredImages = images.filter(img => {
        const matchesCategory = selectedCategory === 'Todos' || img.category === selectedCategory;
        const matchesSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Download image
    const handleDownload = async (url, name) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = name || 'image';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Download error:', err);
            // Fallback: open in new tab
            window.open(url, '_blank');
        }
    };

    return (
        <div className={`dashboard-page ${isLoaded ? 'loaded' : ''}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1
                        className="text-2xl md:text-3xl font-normal tracking-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <span className="bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">Biblioteca de Mídia</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {loading ? 'Carregando...' : `${filteredImages.length} ${filteredImages.length === 1 ? 'imagem' : 'imagens'} dos seus projetos`}
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Search & View Toggle */}
                <div className="flex items-center gap-3 ml-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar imagens..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/50 w-52"
                        />
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>
                    <div className="flex items-center rounded-xl overflow-hidden border border-white/10 bg-white/5">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-violet-500/20 text-violet-400' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-violet-500/20 text-violet-400' : 'text-slate-500 hover:text-white'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
                </div>
            ) : filteredImages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <FolderOpen className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Nenhuma imagem encontrada</h3>
                    <p className="text-slate-400 text-sm max-w-sm">
                        {searchQuery
                            ? 'Nenhuma imagem corresponde à sua busca.'
                            : 'As imagens dos seus projetos aparecerão aqui quando anexadas pelos administradores.'
                        }
                    </p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredImages.map((img, index) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all"
                        >
                            <div className="aspect-square">
                                <img
                                    src={img.url}
                                    alt={img.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x400?text=Imagem';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setPreviewImage(img)}
                                        className="p-2.5 rounded-xl bg-white/90 text-slate-900 hover:bg-white transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDownload(img.url, img.name)}
                                        className="p-2.5 rounded-xl bg-white/90 text-slate-900 hover:bg-white transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-white truncate">{img.name}</p>
                                <p className="text-xs text-slate-500">{img.project} · {img.date}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Imagem</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Projeto</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Categoria</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Data</th>
                                <th className="w-20"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredImages.map((img, index) => (
                                <motion.tr
                                    key={img.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={img.url}
                                                alt={img.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/48x48?text=Img';
                                                }}
                                            />
                                            <span className="text-sm font-medium text-white">{img.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">{img.project}</td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                            {img.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">{img.date}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setPreviewImage(img)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(img.url, img.name)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={previewImage.url}
                            alt={previewImage.name}
                            className="max-w-full max-h-[75vh] object-contain rounded-2xl"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">{previewImage.name}</p>
                                    <p className="text-slate-400 text-sm">{previewImage.project}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDownload(previewImage.url, previewImage.name)}
                                        className="p-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="text-sm font-medium">Baixar</span>
                                    </button>
                                    <button
                                        onClick={() => window.open(previewImage.url, '_blank')}
                                        className="p-2.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
