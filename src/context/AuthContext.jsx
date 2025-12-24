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
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);

            // Fetch profile if user exists
            if (session?.user) {
                await fetchProfile(session.user.id);
            }

            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event);
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setUserProfile(null);
                }

                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Fetch user profile from database
    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            setUserProfile(data || null);
        } catch (err) {
            console.error('Profile fetch error:', err);
        }
    };

    // Refresh user data (call this after updating user metadata)
    const refreshUser = async () => {
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        if (freshUser) {
            setUser(freshUser);
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
