import React from 'react';
import { Bell, Check } from 'lucide-react';

const notifications = [
    { id: 1, type: 'approval', title: 'Projeto Aprovado', message: 'Dr. Marcus aprovou a Hero Section', time: 'Há 2 horas', read: false },
    { id: 2, type: 'comment', title: 'Novo Comentário', message: 'Cliente deixou feedback no design', time: 'Há 4 horas', read: false },
    { id: 3, type: 'upload', title: 'Upload Concluído', message: '5 novas imagens adicionadas', time: 'Há 6 horas', read: true },
    { id: 4, type: 'deadline', title: 'Prazo Próximo', message: 'Entrega do projeto em 2 dias', time: 'Há 1 dia', read: true },
];

export default function NotificationsPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--dash-text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                        Notificações
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--dash-text-muted)' }}>
                        {notifications.filter(n => !n.read).length} não lidas
                    </p>
                </div>
                <button className="btn-secondary text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Marcar todas como lidas
                </button>
            </div>

            <div className="space-y-3">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className={`dashboard-card p-4 flex items-start gap-4 transition-all ${!notif.read ? 'border-l-4 border-l-[var(--dash-accent)]' : ''}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'approval' ? 'bg-green-500/10 text-green-500' :
                                notif.type === 'comment' ? 'bg-purple-500/10 text-purple-500' :
                                    notif.type === 'upload' ? 'bg-blue-500/10 text-blue-500' :
                                        'bg-orange-500/10 text-orange-500'
                            }`}>
                            <Bell className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="font-medium text-sm" style={{ color: 'var(--dash-text-primary)' }}>
                                    {notif.title}
                                </h3>
                                <span className="text-xs flex-shrink-0" style={{ color: 'var(--dash-text-muted)' }}>
                                    {notif.time}
                                </span>
                            </div>
                            <p className="text-sm mt-0.5" style={{ color: 'var(--dash-text-muted)' }}>
                                {notif.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
