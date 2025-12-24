import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

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
    const [userProfile, setUserProfile] = useState(null);

    // Get user display name from metadata or email
    const getUserName = useCallback(() => {
        if (userProfile?.full_name) return userProfile.full_name;
        if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
        if (user?.email) return user.email.split('@')[0];
        return 'Usuário';
    }, [user, userProfile]);

    useEffect(() => {
        let mounted = true;

        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!mounted) return;

                setSession(session);
                setUser(session?.user ?? null);

                // Fetch profile if user exists (non-blocking)
                if (session?.user) {
                    fetchProfile(session.user.id);
                }
            } catch (err) {
                console.error('Session error:', err);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event);

                if (!mounted) return;

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    fetchProfile(session.user.id);
                } else {
                    setUserProfile(null);
                }

                setLoading(false);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Fetch user profile from database (non-blocking)
    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            // Profile might not exist yet - that's ok
            if (error && error.code !== 'PGRST116') {
                console.warn('Profile fetch warning:', error.message);
            }

            setUserProfile(data || null);
        } catch (err) {
            console.warn('Profile fetch error:', err);
            setUserProfile(null);
        }
    };

    // Refresh user data (call this after updating user metadata)
    const refreshUser = async () => {
        try {
            const { data: { user: freshUser } } = await supabase.auth.getUser();
            if (freshUser) {
                setUser(freshUser);
            }
        } catch (err) {
            console.error('Refresh user error:', err);
        }
    };

    const signOut = async () => {
        setUserProfile(null);
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            loading,
            signOut,
            userProfile,
            userName: getUserName(),
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};
