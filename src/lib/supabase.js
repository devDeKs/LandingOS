import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Configurações de segurança adicionais
        flowType: 'pkce', // Mais seguro que implicit flow
    },
    // Configurações globais de segurança
    global: {
        headers: {
            'X-Client-Info': 'landingos-dashboard',
        },
    },
});

// Função helper para validar senha forte
export const validatePasswordStrength = (password) => {
    const checks = {
        minLength: password.length >= 12,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    return {
        isValid: score >= 4 && checks.minLength,
        score,
        checks,
        message: score < 4
            ? 'A senha deve ter pelo menos 12 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.'
            : 'Senha forte!'
    };
};

// Função para sanitizar input (previne XSS)
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
};
