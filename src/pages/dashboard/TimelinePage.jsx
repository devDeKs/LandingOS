import React from 'react';
import { Calendar } from 'lucide-react';

export default function TimelinePage() {
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--dash-text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                        Cronograma
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--dash-text-muted)' }}>
                        Acompanhe prazos e entregas
                    </p>
                </div>
            </div>

            <div className="flex-1 dashboard-card flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--dash-accent-bg)] flex items-center justify-center">
                        <Calendar className="w-8 h-8" style={{ color: 'var(--dash-accent)' }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--dash-text-primary)' }}>
                        Cronograma em Breve
                    </h3>
                    <p className="text-sm max-w-xs mx-auto" style={{ color: 'var(--dash-text-muted)' }}>
                        Esta funcionalidade está em desenvolvimento. Em breve você poderá visualizar e gerenciar prazos aqui.
                    </p>
                </div>
            </div>
        </div>
    );
}
