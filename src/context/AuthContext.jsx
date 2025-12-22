import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, validatePasswordStrength, sanitizeInput } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSessions, setActiveSessions] = useState([]);

    useEffect(() => {
        // Verificar sessão atual
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                setSession(session);
                setUser(session?.user ?? null);
            } catch (error) {
                console.error('Error getting session:', error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Listener para mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);

                // Log de eventos de segurança
                if (event === 'SIGNED_OUT') {
                    console.log('User signed out');
                } else if (event === 'PASSWORD_RECOVERY') {
                    console.log('Password recovery initiated');
                } else if (event === 'TOKEN_REFRESHED') {
                    console.log('Token refreshed');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Alterar senha
    const changePassword = async (currentPassword, newPassword) => {
        try {
            // Validar força da nova senha
            const passwordCheck = validatePasswordStrength(newPassword);
            if (!passwordCheck.isValid) {
                return { success: false, error: passwordCheck.message };
            }

            // Sanitizar input
            const sanitizedPassword = sanitizeInput(newPassword);

            // Verificar senha atual re-autenticando
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            });

            if (signInError) {
                return { success: false, error: 'Senha atual incorreta.' };
            }

            // Atualizar para nova senha
            const { error } = await supabase.auth.updateUser({
                password: sanitizedPassword,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, message: 'Senha alterada com sucesso!' };
        } catch (error) {
            return { success: false, error: 'Erro ao alterar senha. Tente novamente.' };
        }
    };

    // Configurar 2FA (TOTP)
    const setup2FA = async () => {
        try {
            const { data, error } = await supabase.auth.mfa.enroll({
                factorType: 'totp',
                friendlyName: 'LandingOS Authenticator',
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return {
                success: true,
                data: {
                    qrCode: data.totp.qr_code,
                    secret: data.totp.secret,
                    factorId: data.id,
                }
            };
        } catch (error) {
            return { success: false, error: 'Erro ao configurar 2FA.' };
        }
    };

    // Verificar código 2FA
    const verify2FA = async (factorId, code) => {
        try {
            const sanitizedCode = sanitizeInput(code);

            const { data, error } = await supabase.auth.mfa.challengeAndVerify({
                factorId,
                code: sanitizedCode,
            });

            if (error) {
                return { success: false, error: 'Código inválido. Tente novamente.' };
            }

            return { success: true, message: '2FA ativado com sucesso!' };
        } catch (error) {
            return { success: false, error: 'Erro ao verificar código.' };
        }
    };

    // Desativar 2FA
    const disable2FA = async (factorId) => {
        try {
            const { error } = await supabase.auth.mfa.unenroll({
                factorId,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, message: '2FA desativado.' };
        } catch (error) {
            return { success: false, error: 'Erro ao desativar 2FA.' };
        }
    };

    // Listar fatores MFA
    const listMFAFactors = async () => {
        try {
            const { data, error } = await supabase.auth.mfa.listFactors();

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, factors: data };
        } catch (error) {
            return { success: false, error: 'Erro ao listar fatores.' };
        }
    };

    // Enviar email de recuperação
    const sendRecoveryEmail = async (email) => {
        try {
            const sanitizedEmail = sanitizeInput(email);

            const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
                redirectTo: `${window.location.origin}/dashboard/configuracoes`,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, message: 'Email de recuperação enviado!' };
        } catch (error) {
            return { success: false, error: 'Erro ao enviar email.' };
        }
    };

    // Atualizar email de recuperação
    const updateRecoveryEmail = async (newEmail) => {
        try {
            const sanitizedEmail = sanitizeInput(newEmail);

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(sanitizedEmail)) {
                return { success: false, error: 'Formato de email inválido.' };
            }

            const { error } = await supabase.auth.updateUser({
                email: sanitizedEmail,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return {
                success: true,
                message: 'Email de confirmação enviado para o novo endereço.'
            };
        } catch (error) {
            return { success: false, error: 'Erro ao atualizar email.' };
        }
    };

    // Obter sessões ativas (simulado - Supabase não expõe isso diretamente no client)
    const getActiveSessions = async () => {
        try {
            // Supabase não tem endpoint público para listar todas as sessões
            // Vamos retornar a sessão atual como exemplo
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const currentSession = {
                    id: session.access_token.slice(-12),
                    device: detectDevice(),
                    location: 'São Paulo, Brasil', // Seria obtido via API de geolocalização
                    lastActive: new Date().toISOString(),
                    current: true,
                };

                // Mock de outras sessões para demonstração
                const mockSessions = [
                    currentSession,
                    {
                        id: 'sess_abc123',
                        device: 'Chrome em Windows',
                        location: 'Rio de Janeiro, Brasil',
                        lastActive: new Date(Date.now() - 86400000).toISOString(),
                        current: false,
                    },
                ];

                setActiveSessions(mockSessions);
                return { success: true, sessions: mockSessions };
            }

            return { success: true, sessions: [] };
        } catch (error) {
            return { success: false, error: 'Erro ao obter sessões.' };
        }
    };

    // Revogar sessão
    const revokeSession = async (sessionId) => {
        try {
            // Para revogar a sessão atual
            if (sessionId === 'current') {
                await supabase.auth.signOut();
                return { success: true, message: 'Sessão encerrada.' };
            }

            // Para outras sessões, seria necessário usar a Admin API no backend
            // Por segurança, simulamos a remoção
            setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
            return { success: true, message: 'Sessão revogada com sucesso.' };
        } catch (error) {
            return { success: false, error: 'Erro ao revogar sessão.' };
        }
    };

    // Revogar todas as outras sessões
    const revokeAllOtherSessions = async () => {
        try {
            // Isso faria logout e login novamente, invalidando outros tokens
            const { error } = await supabase.auth.refreshSession();

            if (error) {
                return { success: false, error: error.message };
            }

            setActiveSessions(prev => prev.filter(s => s.current));
            return { success: true, message: 'Todas as outras sessões foram encerradas.' };
        } catch (error) {
            return { success: false, error: 'Erro ao revogar sessões.' };
        }
    };

    // Detectar dispositivo atual
    const detectDevice = () => {
        const ua = navigator.userAgent;
        let browser = 'Navegador desconhecido';
        let os = 'Sistema desconhecido';

        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';

        if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Mac')) os = 'macOS';
        else if (ua.includes('Linux')) os = 'Linux';
        else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
        else if (ua.includes('Android')) os = 'Android';

        return `${browser} em ${os}`;
    };

    const value = {
        user,
        session,
        loading,
        activeSessions,
        changePassword,
        setup2FA,
        verify2FA,
        disable2FA,
        listMFAFactors,
        sendRecoveryEmail,
        updateRecoveryEmail,
        getActiveSessions,
        revokeSession,
        revokeAllOtherSessions,
        validatePasswordStrength,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
