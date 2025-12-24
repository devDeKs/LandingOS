import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Shield, LogIn, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(null);
    const [checkingRole, setCheckingRole] = useState(true);

    useEffect(() => {
        const checkAdminRole = async () => {
            if (!user) {
                setIsAdmin(false);
                setCheckingRole(false);
                return;
            }

            try {
                // Step 1: Get profile with role_id
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, role_id')
                    .eq('id', user.id)
                    .single();

                if (profileError || !profile?.role_id) {
                    setIsAdmin(false);
                    setCheckingRole(false);
                    return;
                }

                // Step 2: Get role name
                const { data: role, error: roleError } = await supabase
                    .from('roles')
                    .select('name')
                    .eq('id', profile.role_id)
                    .single();

                if (roleError) {
                    setIsAdmin(false);
                } else {
                    const isAdminRole = role?.name === 'admin' || role?.name === 'super_admin';
                    setIsAdmin(isAdminRole);
                }
            } catch (err) {
                console.error('Role check error:', err);
                setIsAdmin(false);
            } finally {
                setCheckingRole(false);
            }
        };

        if (!loading) {
            checkAdminRole();
        }
    }, [user, loading]);

    // Show loading while checking auth
    if (loading || checkingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-violet-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Verificando permissões...</p>
                </div>
            </div>
        );
    }

    // Not logged in - redirect to admin login
    if (!user) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Not an admin - show access denied
    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F] text-white relative overflow-hidden">
                {/* Background */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10 text-center max-w-md px-6">
                    {/* Shield Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center">
                        <Shield className="w-12 h-12 text-red-400" />
                    </div>

                    <h1 className="text-3xl font-bold mb-4 text-white">
                        Acesso Restrito
                    </h1>
                    <p className="text-slate-400 mb-2">
                        Esta área é exclusiva para administradores.
                    </p>
                    <p className="text-slate-500 text-sm mb-8">
                        Sua conta não possui permissões de administrador.
                    </p>

                    <div className="flex flex-col gap-3">
                        <a
                            href="/dashboard"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-500 transition-colors"
                        >
                            Ir para Dashboard
                        </a>
                        <a
                            href="/admin/login"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                        >
                            <LogIn className="w-4 h-4" />
                            Login como Admin
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}
