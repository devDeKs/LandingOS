import React, { useState, useEffect } from 'react';
import { User, Bell, Palette, Shield, CreditCard, HelpCircle, Camera, Save, ChevronRight, Moon, Sun, Globe, Lock, Mail, Smartphone, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { supabase } from '../../lib/supabase';
import {
    ChangePasswordModal,
    TwoFactorModal,
    ActiveSessionsModal,
    RecoveryEmailModal
} from '../../components/dashboard/SecurityModals';

// Profile Section Component with state and save functionality
function ProfileSection({ userEmail, userName, userPhone, firstName, lastName, firstLetter, refreshUser, userId, avatarUrl }) {
    const [formFirstName, setFormFirstName] = useState(firstName);
    const [formLastName, setFormLastName] = useState(lastName);
    const [formPhone, setFormPhone] = useState(userPhone);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState(avatarUrl);
    const fileInputRef = React.useRef(null);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            setSaveMessage({ type: 'error', text: 'Por favor, selecione uma imagem.' });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setSaveMessage({ type: 'error', text: 'A imagem deve ter no máximo 2MB.' });
            return;
        }

        setUploading(true);
        setSaveMessage(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId);

            if (updateError) throw updateError;

            setCurrentAvatar(publicUrl);
            await refreshUser();
            setSaveMessage({ type: 'success', text: 'Foto atualizada com sucesso!' });
        } catch (err) {
            console.error('Upload error:', err);
            setSaveMessage({ type: 'error', text: 'Erro ao fazer upload: ' + err.message });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveMessage(null);

        try {
            const fullName = `${formFirstName} ${formLastName}`.trim();
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    phone: formPhone
                }
            });

            if (error) throw error;

            // Refresh user data in context
            await refreshUser();

            setSaveMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        } catch (err) {
            setSaveMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="settings-panel">
            <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                fontFamily: "'Outfit', sans-serif",
                color: 'var(--dash-text-primary)',
                marginBottom: '24px'
            }}>
                Informações do Perfil
            </h2>

            {/* Success/Error Message */}
            {saveMessage && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    background: saveMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${saveMessage.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    color: saveMessage.type === 'success' ? '#10b981' : '#ef4444',
                    fontSize: '14px'
                }}>
                    {saveMessage.text}
                </div>
            )}

            {/* Avatar Section - Neon Style with Upload */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '32px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '20px'
            }}>
                <div style={{ position: 'relative' }}>
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        style={{ display: 'none' }}
                    />
                    {/* Neon Glow Ring */}
                    <div style={{
                        position: 'absolute',
                        inset: '-4px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b5cf6, #a855f7, #d946ef)',
                        filter: 'blur(8px)',
                        opacity: 0.6,
                        animation: 'pulse 2s ease-in-out infinite'
                    }}></div>
                    {/* Avatar Circle - Shows image or initials */}
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        style={{
                            position: 'relative',
                            width: '88px',
                            height: '88px',
                            borderRadius: '50%',
                            background: '#1a1a2e',
                            border: '3px solid rgba(139, 92, 246, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                            fontWeight: '700',
                            color: '#a855f7',
                            textShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
                            cursor: uploading ? 'wait' : 'pointer',
                            overflow: 'hidden',
                            transition: 'all 0.2s'
                        }}>
                        {currentAvatar ? (
                            <img
                                src={currentAvatar}
                                alt="Avatar"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            firstLetter
                        )}
                        {/* Upload overlay */}
                        {uploading && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div className="animate-spin" style={{
                                    width: '24px',
                                    height: '24px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: '#a855f7',
                                    borderRadius: '50%'
                                }}></div>
                            </div>
                        )}
                    </div>
                    {/* Camera icon overlay */}
                    {!uploading && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: '2px solid #1a1a2e',
                                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)'
                            }}>
                            <Camera size={14} color="white" />
                        </div>
                    )}
                </div>
                <div>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--dash-text-primary)',
                        marginBottom: '4px'
                    }}>{userName || 'Usuário'}</h3>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--dash-text-muted)'
                    }}>{userEmail}</p>
                    <p style={{
                        fontSize: '12px',
                        color: 'var(--dash-text-muted)',
                        marginTop: '4px'
                    }}>Clique na foto para alterar</p>
                </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--dash-text-secondary)',
                        marginBottom: '8px'
                    }}>Nome</label>
                    <input
                        type="text"
                        value={formFirstName}
                        onChange={(e) => setFormFirstName(e.target.value)}
                        className="glass-input"
                    />
                </div>
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--dash-text-secondary)',
                        marginBottom: '8px'
                    }}>Sobrenome</label>
                    <input
                        type="text"
                        value={formLastName}
                        onChange={(e) => setFormLastName(e.target.value)}
                        className="glass-input"
                    />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--dash-text-secondary)',
                        marginBottom: '8px'
                    }}>Email</label>
                    <input
                        type="email"
                        value={userEmail}
                        className="glass-input"
                        disabled
                        style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--dash-text-secondary)',
                        marginBottom: '8px'
                    }}>Telefone</label>
                    <input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+55 11 99999-9999"
                        className="glass-input"
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
                style={{
                    marginTop: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: saving ? 0.7 : 1
                }}
            >
                {saving ? (
                    <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                ) : (
                    <Save className="w-4 h-4" />
                )}
                {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </div>
    );
}

const settingsSections = [
    { id: 'profile', icon: User, label: 'Perfil' },
    { id: 'notifications', icon: Bell, label: 'Notificações' },
    { id: 'appearance', icon: Palette, label: 'Aparência' },
    { id: 'security', icon: Shield, label: 'Segurança' },
    { id: 'billing', icon: CreditCard, label: 'Cobrança' },
    { id: 'help', icon: HelpCircle, label: 'Ajuda' },
];

export default function SettingsPage() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { notificationSettings, toggleNotificationSetting } = useSettings();
    const { signOut, user, refreshUser, userProfile } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [isLoaded, setIsLoaded] = useState(false);

    // Estados para os modais de segurança
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
    const [showSessionsModal, setShowSessionsModal] = useState(false);
    const [showRecoveryEmailModal, setShowRecoveryEmailModal] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const renderContent = () => {
        // Get user data for profile section
        const userEmail = user?.email || '';
        const userName = user?.user_metadata?.full_name || '';
        const userPhone = user?.user_metadata?.phone || '';
        const [firstName, ...lastNameParts] = userName.split(' ');
        const lastName = lastNameParts.join(' ');
        const firstLetter = userName ? userName[0].toUpperCase() : userEmail[0]?.toUpperCase() || 'U';

        switch (activeSection) {
            case 'profile':
                return (
                    <ProfileSection
                        userEmail={userEmail}
                        userName={userName}
                        userPhone={userPhone}
                        firstName={firstName}
                        lastName={lastName}
                        firstLetter={firstLetter}
                        refreshUser={refreshUser}
                        userId={user?.id}
                        avatarUrl={userProfile?.avatar_url}
                    />
                );

            case 'appearance':
                return (
                    <div className="settings-panel">
                        <h2 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            fontFamily: "'Outfit', sans-serif",
                            color: 'var(--dash-text-primary)',
                            marginBottom: '24px'
                        }}>
                            Aparência
                        </h2>

                        {/* Theme Toggle */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '20px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '16px',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: 'var(--dash-accent-bg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {isDarkMode ? (
                                        <Moon className="w-5 h-5" style={{ color: 'var(--dash-accent)' }} />
                                    ) : (
                                        <Sun className="w-5 h-5" style={{ color: 'var(--dash-accent)' }} />
                                    )}
                                </div>
                                <div>
                                    <p style={{
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: 'var(--dash-text-primary)',
                                        marginBottom: '2px'
                                    }}>Tema do Sistema</p>
                                    <p style={{
                                        fontSize: '13px',
                                        color: 'var(--dash-text-muted)'
                                    }}>
                                        Atualmente usando o modo {isDarkMode ? 'escuro' : 'claro'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`theme-toggle ${isDarkMode ? 'active' : ''}`}
                            >
                                <span className="theme-toggle-knob"></span>
                            </button>
                        </div>

                        {/* Theme Preview Cards */}
                        <p style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--dash-text-secondary)',
                            marginBottom: '16px'
                        }}>Selecione um tema</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <button
                                onClick={() => isDarkMode && toggleTheme()}
                                style={{
                                    padding: '20px',
                                    borderRadius: '20px',
                                    border: `2px solid ${!isDarkMode ? 'var(--dash-accent)' : 'transparent'}`,
                                    background: '#f5f5f5',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{
                                    aspectRatio: '16/9',
                                    borderRadius: '12px',
                                    background: 'white',
                                    marginBottom: '16px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Sun className="w-8 h-8" style={{ color: '#f59e0b' }} />
                                </div>
                                <p style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#1a1a2e',
                                    textAlign: 'center'
                                }}>Modo Claro</p>
                            </button>
                            <button
                                onClick={() => !isDarkMode && toggleTheme()}
                                style={{
                                    padding: '20px',
                                    borderRadius: '20px',
                                    border: `2px solid ${isDarkMode ? 'var(--dash-accent)' : 'transparent'}`,
                                    background: '#1a1a35',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{
                                    aspectRatio: '16/9',
                                    borderRadius: '12px',
                                    background: '#252545',
                                    marginBottom: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Moon className="w-8 h-8" style={{ color: '#8b5cf6' }} />
                                </div>
                                <p style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#e5e5e5',
                                    textAlign: 'center'
                                }}>Modo Escuro</p>
                            </button>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="settings-panel">
                        <h2 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            fontFamily: "'Outfit', sans-serif",
                            color: 'var(--dash-text-primary)',
                            marginBottom: '24px'
                        }}>
                            Preferências de Notificação
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {notificationSettings.map((notif, index) => (
                                <div
                                    key={notif.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '18px 20px',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: '16px',
                                        transition: 'all 0.3s ease',
                                        opacity: 0,
                                        animation: 'fadeInUp 0.4s ease forwards',
                                        animationDelay: `${0.1 + index * 0.05}s`
                                    }}
                                >
                                    <div>
                                        <p style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: 'var(--dash-text-primary)',
                                            marginBottom: '4px'
                                        }}>{notif.label}</p>
                                        <p style={{
                                            fontSize: '13px',
                                            color: 'var(--dash-text-muted)'
                                        }}>{notif.description}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleNotificationSetting(notif.id)}
                                        className={`theme-toggle ${notif.enabled ? 'active' : ''}`}
                                    >
                                        <span className="theme-toggle-knob"></span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'security':
                const securityItems = [
                    { icon: Lock, label: 'Alterar Senha', description: 'Atualize sua senha de acesso', onClick: () => setShowPasswordModal(true) },
                    { icon: Smartphone, label: 'Autenticação em 2 Fatores', description: 'Adicione uma camada extra de segurança', onClick: () => setShowTwoFactorModal(true) },
                    { icon: Globe, label: 'Sessões Ativas', description: 'Gerencie dispositivos conectados', onClick: () => setShowSessionsModal(true) },
                    { icon: Mail, label: 'Email de Recuperação', description: 'Configure um email alternativo', onClick: () => setShowRecoveryEmailModal(true) },
                    { icon: LogOut, label: 'Sair da Conta', description: 'Encerrar sessão atual', onClick: signOut, danger: true },
                ];

                return (
                    <div className="settings-panel">
                        <h2 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            fontFamily: "'Outfit', sans-serif",
                            color: 'var(--dash-text-primary)',
                            marginBottom: '24px'
                        }}>
                            Segurança da Conta
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {securityItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={item.onClick}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '18px 20px',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: '16px',
                                        border: '1px solid transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        textAlign: 'left',
                                        width: '100%',
                                        opacity: 0,
                                        animation: 'fadeInUp 0.4s ease forwards',
                                        animationDelay: `${0.1 + index * 0.05}s`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = item.danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.05)';
                                        e.currentTarget.style.borderColor = item.danger ? 'rgba(239, 68, 68, 0.3)' : 'rgba(139, 92, 246, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '12px',
                                            background: item.danger ? 'rgba(239, 68, 68, 0.1)' : 'var(--dash-accent-bg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <item.icon className="w-5 h-5" style={{ color: item.danger ? '#ef4444' : 'var(--dash-accent)' }} />
                                        </div>
                                        <div>
                                            <p style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: item.danger ? '#ef4444' : 'var(--dash-text-primary)',
                                                marginBottom: '2px'
                                            }}>{item.label}</p>
                                            <p style={{
                                                fontSize: '13px',
                                                color: 'var(--dash-text-muted)'
                                            }}>{item.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5" style={{ color: item.danger ? '#ef4444' : 'var(--dash-text-muted)' }} />
                                </button>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="settings-panel">
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                {activeSection === 'billing' ? <CreditCard /> : <HelpCircle />}
                            </div>
                            <h3 className="empty-state-title">Em Desenvolvimento</h3>
                            <p className="empty-state-description">
                                Esta seção está sendo desenvolvida. Em breve você terá acesso completo a estas configurações.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`dashboard-page ${isLoaded ? 'loaded' : ''}`} style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <h1
                        className="text-2xl md:text-3xl font-normal tracking-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <span className="bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">Configurações</span>
                    </h1>
                    <p className="page-subtitle">
                        Gerencie suas preferências e conta
                    </p>
                </div>
            </div>

            {/* Settings Layout */}
            <div style={{ display: 'flex', gap: '32px' }}>
                {/* Sidebar Navigation */}
                <div
                    className="settings-sidebar"
                    style={{
                        width: '220px',
                        flexShrink: 0,
                        opacity: 0,
                        animation: 'fadeInUp 0.5s ease forwards',
                        animationDelay: '0.1s'
                    }}
                >
                    {settingsSections.map((section, index) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                            style={{
                                opacity: 0,
                                animation: 'fadeInUp 0.4s ease forwards',
                                animationDelay: `${0.15 + index * 0.05}s`
                            }}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ flex: 1 }}>
                    {renderContent()}
                </div>
            </div>

            {/* Security Modals */}
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />
            <TwoFactorModal
                isOpen={showTwoFactorModal}
                onClose={() => setShowTwoFactorModal(false)}
            />
            <ActiveSessionsModal
                isOpen={showSessionsModal}
                onClose={() => setShowSessionsModal(false)}
            />
            <RecoveryEmailModal
                isOpen={showRecoveryEmailModal}
                onClose={() => setShowRecoveryEmailModal(false)}
            />
        </div>
    );
}
