import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Check, AlertCircle, Loader2, Shield, Copy, Smartphone, Monitor, MapPin, Clock, Trash2, Mail, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Estilos compartilhados
const modalStyles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
    },
    container: {
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(30, 30, 46, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
    title: {
        fontSize: '20px',
        fontWeight: '600',
        color: 'white',
        fontFamily: "'Outfit', sans-serif",
    },
    closeBtn: {
        padding: '8px',
        borderRadius: '12px',
        background: 'transparent',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.5)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    content: {
        padding: '24px',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s ease',
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '8px',
    },
    button: {
        width: '100%',
        padding: '14px 24px',
        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    secondaryButton: {
        width: '100%',
        padding: '14px 24px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    dangerButton: {
        width: '100%',
        padding: '14px 24px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        color: '#ef4444',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
};

// Componente de Input com visibilidade de senha
const PasswordInput = ({ label, value, onChange, placeholder, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={modalStyles.label}>{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={{
                        ...modalStyles.input,
                        paddingRight: '48px',
                        borderColor: error ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        padding: '4px',
                    }}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {error && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{error}</p>
            )}
        </div>
    );
};

// Indicador de força da senha
const PasswordStrengthIndicator = ({ password, validatePasswordStrength }) => {
    const { score, checks } = validatePasswordStrength(password);
    const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];

    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '2px',
                            background: i < score ? colors[score - 1] : 'rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.entries(checks).map(([key, valid]) => (
                    <span
                        key={key}
                        style={{
                            fontSize: '11px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: valid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            color: valid ? '#10b981' : 'rgba(255, 255, 255, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        {valid && <Check size={10} />}
                        {key === 'minLength' && '12+ caracteres'}
                        {key === 'hasUpperCase' && 'Maiúscula'}
                        {key === 'hasLowerCase' && 'Minúscula'}
                        {key === 'hasNumbers' && 'Número'}
                        {key === 'hasSpecialChar' && 'Especial'}
                    </span>
                ))}
            </div>
        </div>
    );
};

// ========== MODAL: ALTERAR SENHA ==========
export const ChangePasswordModal = ({ isOpen, onClose }) => {
    const { changePassword, validatePasswordStrength } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setError('');

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        const passwordCheck = validatePasswordStrength(newPassword);
        if (!passwordCheck.isValid) {
            setError(passwordCheck.message);
            return;
        }

        setLoading(true);
        const result = await changePassword(currentPassword, newPassword);
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }, 2000);
        } else {
            setError(result.error);
        }
    };

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess(false);
    };

    useEffect(() => {
        if (!isOpen) resetForm();
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            ...modalStyles.overlay,
                            background: 'transparent',
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={modalStyles.container}
                        >
                            <div style={modalStyles.header}>
                                <h3 style={modalStyles.title}>Alterar Senha</h3>
                                <button
                                    onClick={onClose}
                                    style={modalStyles.closeBtn}
                                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={modalStyles.content}>
                                {success ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{ textAlign: 'center', padding: '32px 0' }}
                                    >
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 16px',
                                        }}>
                                            <Check size={32} style={{ color: '#10b981' }} />
                                        </div>
                                        <p style={{ color: '#10b981', fontWeight: '600' }}>
                                            Senha alterada com sucesso!
                                        </p>
                                    </motion.div>
                                ) : (
                                    <>
                                        <PasswordInput
                                            label="Senha Atual"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Digite sua senha atual"
                                        />

                                        <PasswordInput
                                            label="Nova Senha"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Digite a nova senha"
                                        />

                                        {newPassword && (
                                            <PasswordStrengthIndicator
                                                password={newPassword}
                                                validatePasswordStrength={validatePasswordStrength}
                                            />
                                        )}

                                        <PasswordInput
                                            label="Confirmar Nova Senha"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirme a nova senha"
                                            error={confirmPassword && newPassword !== confirmPassword ? 'As senhas não coincidem' : ''}
                                        />

                                        {error && (
                                            <div style={{
                                                padding: '12px 16px',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                borderRadius: '12px',
                                                marginBottom: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                            }}>
                                                <AlertCircle size={18} style={{ color: '#ef4444' }} />
                                                <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                                            style={{
                                                ...modalStyles.button,
                                                opacity: loading || !currentPassword || !newPassword || !confirmPassword ? 0.5 : 1,
                                                cursor: loading ? 'wait' : 'pointer',
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Alterando...
                                                </>
                                            ) : (
                                                <>
                                                    <Shield size={18} />
                                                    Alterar Senha
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// ========== MODAL: AUTENTICAÇÃO 2FA ==========
export const TwoFactorModal = ({ isOpen, onClose }) => {
    const { setup2FA, verify2FA, listMFAFactors, disable2FA } = useAuth();
    const [step, setStep] = useState('loading'); // loading, setup, verify, active
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [factorId, setFactorId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            checkMFAStatus();
        }
    }, [isOpen]);

    const checkMFAStatus = async () => {
        setStep('loading');
        const result = await listMFAFactors();

        if (result.success && result.factors?.totp?.length > 0) {
            setFactorId(result.factors.totp[0].id);
            setStep('active');
        } else {
            setStep('setup');
        }
    };

    const handleSetup = async () => {
        setLoading(true);
        setError('');

        const result = await setup2FA();
        setLoading(false);

        if (result.success) {
            setQrCode(result.data.qrCode);
            setSecret(result.data.secret);
            setFactorId(result.data.factorId);
            setStep('verify');
        } else {
            setError(result.error);
        }
    };

    const handleVerify = async () => {
        if (verificationCode.length !== 6) {
            setError('O código deve ter 6 dígitos.');
            return;
        }

        setLoading(true);
        setError('');

        const result = await verify2FA(factorId, verificationCode);
        setLoading(false);

        if (result.success) {
            setStep('active');
        } else {
            setError(result.error);
        }
    };

    const handleDisable = async () => {
        setLoading(true);
        const result = await disable2FA(factorId);
        setLoading(false);

        if (result.success) {
            setStep('setup');
            setQrCode('');
            setSecret('');
            setFactorId('');
        } else {
            setError(result.error);
        }
    };

    const copySecret = () => {
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const resetModal = () => {
        setStep('loading');
        setQrCode('');
        setSecret('');
        setVerificationCode('');
        setError('');
    };

    useEffect(() => {
        if (!isOpen) resetModal();
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        ...modalStyles.overlay,
                        background: 'transparent',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        style={modalStyles.container}
                    >
                        <div style={modalStyles.header}>
                            <h3 style={modalStyles.title}>Autenticação em 2 Fatores</h3>
                            <button
                                onClick={onClose}
                                style={modalStyles.closeBtn}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={modalStyles.content}>
                            {step === 'loading' && (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <Loader2 size={32} className="animate-spin" style={{ color: '#8b5cf6', margin: '0 auto' }} />
                                    <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '16px' }}>Verificando status...</p>
                                </div>
                            )}

                            {step === 'setup' && (
                                <>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        borderRadius: '16px',
                                        marginBottom: '20px',
                                    }}>
                                        <Shield size={48} style={{ color: '#8b5cf6', margin: '0 auto 12px' }} />
                                        <h4 style={{ color: 'white', marginBottom: '8px' }}>Proteja sua conta</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                                            Adicione uma camada extra de segurança usando um app autenticador como Google Authenticator ou Authy.
                                        </p>
                                    </div>

                                    {error && (
                                        <div style={{
                                            padding: '12px 16px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            borderRadius: '12px',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}>
                                            <AlertCircle size={18} style={{ color: '#ef4444' }} />
                                            <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleSetup}
                                        disabled={loading}
                                        style={modalStyles.button}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Configurando...
                                            </>
                                        ) : (
                                            <>
                                                <Shield size={18} />
                                                Ativar 2FA
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {step === 'verify' && (
                                <>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '20px' }}>
                                        Escaneie o QR code com seu app autenticador:
                                    </p>

                                    <div style={{
                                        background: 'white',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        textAlign: 'center',
                                        marginBottom: '20px',
                                    }}>
                                        {qrCode ? (
                                            <img src={qrCode} alt="QR Code" style={{ maxWidth: '200px', margin: '0 auto' }} />
                                        ) : (
                                            <div style={{ width: '200px', height: '200px', background: '#f0f0f0', margin: '0 auto' }} />
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={modalStyles.label}>Ou insira o código manualmente:</label>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '12px 16px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                        }}>
                                            <code style={{ flex: 1, color: '#8b5cf6', fontSize: '13px', wordBreak: 'break-all' }}>
                                                {secret}
                                            </code>
                                            <button
                                                onClick={copySecret}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: copied ? '#10b981' : 'rgba(255,255,255,0.5)',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={modalStyles.label}>Código de verificação</label>
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="000000"
                                            maxLength={6}
                                            style={{
                                                ...modalStyles.input,
                                                textAlign: 'center',
                                                fontSize: '24px',
                                                letterSpacing: '8px',
                                                fontFamily: 'monospace',
                                            }}
                                        />
                                    </div>

                                    {error && (
                                        <div style={{
                                            padding: '12px 16px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            borderRadius: '12px',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}>
                                            <AlertCircle size={18} style={{ color: '#ef4444' }} />
                                            <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleVerify}
                                        disabled={loading || verificationCode.length !== 6}
                                        style={{
                                            ...modalStyles.button,
                                            opacity: verificationCode.length !== 6 ? 0.5 : 1,
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Verificando...
                                            </>
                                        ) : (
                                            'Verificar e Ativar'
                                        )}
                                    </button>
                                </>
                            )}

                            {step === 'active' && (
                                <>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: '16px',
                                        marginBottom: '20px',
                                    }}>
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 12px',
                                        }}>
                                            <Shield size={32} style={{ color: '#10b981' }} />
                                        </div>
                                        <h4 style={{ color: '#10b981', marginBottom: '8px' }}>2FA Ativo</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                                            Sua conta está protegida com autenticação em dois fatores.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleDisable}
                                        disabled={loading}
                                        style={modalStyles.dangerButton}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Desativando...
                                            </>
                                        ) : (
                                            'Desativar 2FA'
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ========== MODAL: SESSÕES ATIVAS ==========
export const ActiveSessionsModal = ({ isOpen, onClose }) => {
    const { getActiveSessions, revokeSession, revokeAllOtherSessions, activeSessions } = useAuth();
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadSessions();
        }
    }, [isOpen]);

    const loadSessions = async () => {
        setLoading(true);
        await getActiveSessions();
        setLoading(false);
    };

    const handleRevoke = async (sessionId) => {
        setRevoking(sessionId);
        await revokeSession(sessionId);
        setRevoking(null);
    };

    const handleRevokeAll = async () => {
        setRevoking('all');
        await revokeAllOtherSessions();
        setRevoking(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Agora';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min atrás`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        ...modalStyles.overlay,
                        background: 'transparent',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ ...modalStyles.container, maxWidth: '520px' }}
                    >
                        <div style={modalStyles.header}>
                            <h3 style={modalStyles.title}>Sessões Ativas</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={loadSessions}
                                    style={{ ...modalStyles.closeBtn, marginRight: '4px' }}
                                    title="Atualizar"
                                >
                                    <RefreshCw size={18} />
                                </button>
                                <button
                                    onClick={onClose}
                                    style={modalStyles.closeBtn}
                                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div style={{ ...modalStyles.content, maxHeight: '400px', overflowY: 'auto' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <Loader2 size={32} className="animate-spin" style={{ color: '#8b5cf6', margin: '0 auto' }} />
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                        {activeSessions.map((session) => (
                                            <div
                                                key={session.id}
                                                style={{
                                                    padding: '16px',
                                                    background: session.current ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                                    border: session.current ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                                                    borderRadius: '16px',
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '12px',
                                                            background: 'rgba(255, 255, 255, 0.05)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            {session.device.includes('Mobile') || session.device.includes('iOS') || session.device.includes('Android') ? (
                                                                <Smartphone size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
                                                            ) : (
                                                                <Monitor size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p style={{ color: 'white', fontWeight: '500', fontSize: '14px', marginBottom: '4px' }}>
                                                                {session.device}
                                                                {session.current && (
                                                                    <span style={{
                                                                        marginLeft: '8px',
                                                                        padding: '2px 8px',
                                                                        background: 'rgba(139, 92, 246, 0.2)',
                                                                        borderRadius: '6px',
                                                                        fontSize: '11px',
                                                                        color: '#a78bfa',
                                                                    }}>
                                                                        Atual
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                    <MapPin size={12} />
                                                                    {session.location}
                                                                </span>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                    <Clock size={12} />
                                                                    {formatDate(session.lastActive)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {!session.current && (
                                                        <button
                                                            onClick={() => handleRevoke(session.id)}
                                                            disabled={revoking === session.id}
                                                            style={{
                                                                padding: '8px',
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                color: '#ef4444',
                                                                cursor: 'pointer',
                                                            }}
                                                            title="Encerrar sessão"
                                                        >
                                                            {revoking === session.id ? (
                                                                <Loader2 size={16} className="animate-spin" />
                                                            ) : (
                                                                <Trash2 size={16} />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {activeSessions.filter(s => !s.current).length > 0 && (
                                        <button
                                            onClick={handleRevokeAll}
                                            disabled={revoking === 'all'}
                                            style={modalStyles.dangerButton}
                                        >
                                            {revoking === 'all' ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Encerrando...
                                                </>
                                            ) : (
                                                'Encerrar Todas as Outras Sessões'
                                            )}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ========== MODAL: EMAIL DE RECUPERAÇÃO ==========
export const RecoveryEmailModal = ({ isOpen, onClose }) => {
    const { user, updateRecoveryEmail, sendRecoveryEmail } = useAuth();
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [mode, setMode] = useState('view'); // view, edit

    const handleUpdate = async () => {
        if (!newEmail) {
            setError('Digite um email válido.');
            return;
        }

        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            setError('Formato de email inválido.');
            return;
        }

        setLoading(true);
        setError('');

        const result = await updateRecoveryEmail(newEmail);
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                setMode('view');
                setSuccess(false);
                setNewEmail('');
            }, 2000);
        } else {
            setError(result.error);
        }
    };

    const handleSendTest = async () => {
        setLoading(true);
        const result = await sendRecoveryEmail(user?.email || '');
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(result.error);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setMode('view');
            setNewEmail('');
            setError('');
            setSuccess(false);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        ...modalStyles.overlay,
                        background: 'transparent',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        style={modalStyles.container}
                    >
                        <div style={modalStyles.header}>
                            <h3 style={modalStyles.title}>Email de Recuperação</h3>
                            <button
                                onClick={onClose}
                                style={modalStyles.closeBtn}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={modalStyles.content}>
                            {success ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ textAlign: 'center', padding: '32px 0' }}
                                >
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                    }}>
                                        <Check size={32} style={{ color: '#10b981' }} />
                                    </div>
                                    <p style={{ color: '#10b981', fontWeight: '600' }}>
                                        {mode === 'edit' ? 'Email de confirmação enviado!' : 'Email de teste enviado!'}
                                    </p>
                                </motion.div>
                            ) : mode === 'view' ? (
                                <>
                                    <div style={{
                                        padding: '20px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: '16px',
                                        marginBottom: '20px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                            <div style={{
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '12px',
                                                background: 'rgba(139, 92, 246, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <Mail size={22} style={{ color: '#8b5cf6' }} />
                                            </div>
                                            <div>
                                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '2px' }}>
                                                    Email atual
                                                </p>
                                                <p style={{ color: 'white', fontWeight: '500' }}>
                                                    {user?.email || 'joao@empresa.com'}
                                                </p>
                                            </div>
                                        </div>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                                            Este email será usado para recuperar sua conta caso você perca o acesso.
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={() => setMode('edit')}
                                            style={{ ...modalStyles.button, flex: 1 }}
                                        >
                                            Alterar Email
                                        </button>
                                        <button
                                            onClick={handleSendTest}
                                            disabled={loading}
                                            style={{ ...modalStyles.secondaryButton, flex: 1 }}
                                        >
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Enviar Teste'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={modalStyles.label}>Novo Email de Recuperação</label>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder="novo@email.com"
                                            style={modalStyles.input}
                                        />
                                    </div>

                                    {error && (
                                        <div style={{
                                            padding: '12px 16px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            borderRadius: '12px',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}>
                                            <AlertCircle size={18} style={{ color: '#ef4444' }} />
                                            <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={() => {
                                                setMode('view');
                                                setNewEmail('');
                                                setError('');
                                            }}
                                            style={{ ...modalStyles.secondaryButton, flex: 1 }}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            disabled={loading || !newEmail}
                                            style={{
                                                ...modalStyles.button,
                                                flex: 1,
                                                opacity: !newEmail ? 0.5 : 1,
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Salvando...
                                                </>
                                            ) : (
                                                'Salvar'
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
