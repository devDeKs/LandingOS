import React, { createContext, useContext, useState, useEffect } from 'react';
import { FolderKanban, XCircle, Users, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminNotificationContext = createContext();

export const useAdminNotifications = () => {
    const context = useContext(AdminNotificationContext);
    if (!context) {
        throw new Error('useAdminNotifications must be used within an AdminNotificationProvider');
    }
    return context;
};

// Default notification settings for admin
const defaultAdminNotificationSettings = [
    { id: 'newProjects', label: 'Novos Projetos', description: 'Alertas quando novos projetos forem criados', enabled: true },
    { id: 'rejectedProjects', label: 'Projetos Recusados', description: 'Alertas quando clientes recusarem cards', enabled: true },
    { id: 'newClients', label: 'Novos Clientes', description: 'Notificar quando novos clientes se cadastrarem', enabled: true },
    { id: 'messages', label: 'Mensagens', description: 'Alertas de novas mensagens no chat', enabled: false },
];

// Sample notifications for admin
const sampleAdminNotifications = [
    {
        id: 1,
        title: 'Novo Projeto Criado',
        message: 'O projeto "Landing Page Dr. Silva" foi criado e aguarda aprovação do cliente.',
        time: 'Há 10 min',
        read: false,
        icon: FolderKanban,
        color: '#8b5cf6',
        bg: 'rgba(139, 92, 246, 0.1)',
        categoryId: 'newProjects'
    },
    {
        id: 2,
        title: 'Card Recusado',
        message: 'O cliente "Tech Solutions" recusou a Hero Section. Motivo: "Precisa de mais destaque no CTA".',
        time: 'Há 1 hora',
        read: false,
        icon: XCircle,
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.1)',
        categoryId: 'rejectedProjects'
    },
    {
        id: 3,
        title: 'Novo Cliente Cadastrado',
        message: 'Marina Costa se cadastrou na plataforma para o projeto "Consultório Premium".',
        time: 'Há 2 horas',
        read: false,
        icon: Users,
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)',
        categoryId: 'newClients'
    },
    {
        id: 4,
        title: 'Nova Mensagem',
        message: 'Dr. Marcus enviou uma mensagem sobre alterações no projeto.',
        time: 'Há 3 horas',
        read: true,
        icon: MessageSquare,
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.1)',
        categoryId: 'messages'
    },
    {
        id: 5,
        title: 'Projeto Aprovado',
        message: 'O cliente "JM Advogados" aprovou todas as seções do projeto.',
        time: 'Há 5 horas',
        read: true,
        icon: CheckCircle2,
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)',
        categoryId: 'newProjects'
    },
    {
        id: 6,
        title: 'Atenção Necessária',
        message: 'O projeto "E-commerce Fashion" está com prazo de entrega para amanhã.',
        time: 'Há 1 dia',
        read: true,
        icon: AlertCircle,
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
        categoryId: 'newProjects'
    }
];

export const AdminNotificationProvider = ({ children }) => {
    // Load settings from localStorage
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('adminNotificationSettings');
        return saved ? JSON.parse(saved) : defaultAdminNotificationSettings;
    });

    // Notifications state
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('adminNotifications');
        return saved ? JSON.parse(saved) : sampleAdminNotifications;
    });

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('adminNotificationSettings', JSON.stringify(settings));
    }, [settings]);

    // Save notifications to localStorage (to persist read state)
    useEffect(() => {
        localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    }, [notifications]);

    // Toggle a setting
    const toggleSetting = (id) => {
        setSettings(prev =>
            prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
        );
    };

    // Check if a category is enabled
    const isEnabled = (categoryId) => {
        const setting = settings.find(s => s.id === categoryId);
        return setting ? setting.enabled : true;
    };

    // Get filtered notifications based on settings
    const getFilteredNotifications = () => {
        return notifications.filter(n => isEnabled(n.categoryId));
    };

    // Get unread count
    const getUnreadCount = () => {
        return getFilteredNotifications().filter(n => !n.read).length;
    };

    // Mark all as read
    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    // Clear all notifications
    const clearAll = () => {
        setNotifications([]);
    };

    // Add a new notification
    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
    };

    return (
        <AdminNotificationContext.Provider value={{
            settings,
            toggleSetting,
            isEnabled,
            notifications: getFilteredNotifications(),
            allNotifications: notifications,
            unreadCount: getUnreadCount(),
            markAllRead,
            clearAll,
            addNotification
        }}>
            {children}
        </AdminNotificationContext.Provider>
    );
};
