import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

const defaultNotificationSettings = [
    { id: 'approvals', label: 'Aprovações', description: 'Receba notificações quando um projeto for aprovado', enabled: true },
    { id: 'comments', label: 'Comentários', description: 'Receba notificações de novos comentários', enabled: true },
    { id: 'deadlines', label: 'Alertas de Prazo', description: 'Notificações para prazos próximos', enabled: true },
    { id: 'system', label: 'Resumo Semanal', description: 'Receba um resumo semanal de atividades', enabled: false },
];

export const SettingsProvider = ({ children }) => {
    // Carregar configurações do localStorage ou usar padrão
    const [notificationSettings, setNotificationSettings] = useState(() => {
        const saved = localStorage.getItem('notificationSettings');
        return saved ? JSON.parse(saved) : defaultNotificationSettings;
    });

    // Salvar no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    }, [notificationSettings]);

    const toggleNotificationSetting = (id) => {
        setNotificationSettings(prev =>
            prev.map(setting =>
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
    };

    const isNotificationEnabled = (id) => {
        const setting = notificationSettings.find(s => s.id === id);
        return setting ? setting.enabled : true; // Default to true if setting doesn't exist
    };

    return (
        <SettingsContext.Provider value={{
            notificationSettings,
            toggleNotificationSetting,
            isNotificationEnabled
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
