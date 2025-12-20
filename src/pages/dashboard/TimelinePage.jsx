import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Flag, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import Modal from '../../components/dashboard/Modal';



const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const events = [
    {
        id: 1,
        title: 'Entrega Hero Section',
        project: 'Dr. Marcus',
        date: '2024-12-22',
        time: '14:00',
        type: 'deadline',
        color: '#f59e0b'
    },
    {
        id: 2,
        title: 'Call de Aprovação',
        project: 'JM Advogados',
        date: '2024-12-23',
        time: '10:00',
        type: 'meeting',
        color: '#3b82f6'
    },
    {
        id: 3,
        title: 'Lançamento Landing Page',
        project: 'Studio Design',
        date: '2024-12-25',
        time: '09:00',
        type: 'launch',
        color: '#10b981'
    },
    {
        id: 4,
        title: 'Revisão de Conteúdo',
        project: 'Consult Pro',
        date: '2024-12-27',
        time: '16:00',
        type: 'review',
        color: '#8b5cf6'
    }
];

const upcomingTasks = [
    { id: 1, title: 'Finalizar seção de preços', project: 'Dr. Marcus', priority: 'high', dueIn: '2 dias' },
    { id: 2, title: 'Revisar copy do hero', project: 'JM Advogados', priority: 'medium', dueIn: '3 dias' },
    { id: 3, title: 'Implementar formulário', project: 'Studio Design', priority: 'high', dueIn: '4 dias' },
    { id: 4, title: 'Otimizar imagens', project: 'Consult Pro', priority: 'low', dueIn: '5 dias' },
];

export default function TimelinePage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateEvent = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsEventModalOpen(false);
        }, 1500);
    };


    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];

        // Previous month days
        for (let i = 0; i < startingDay; i++) {
            const prevDate = new Date(year, month, -startingDay + i + 1);
            days.push({ date: prevDate, isCurrentMonth: false });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        }

        return days;
    };

    const formatDateKey = (date) => {
        return date.toISOString().split('T')[0];
    };

    const hasEvent = (date) => {
        return events.some(e => e.date === formatDateKey(date));
    };

    const getEventColor = (date) => {
        const event = events.find(e => e.date === formatDateKey(date));
        return event?.color;
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#8b5cf6';
        }
    };

    return (
        <div className={`dashboard-page ${isLoaded ? 'loaded' : ''}`} style={{ height: '100%' }}>
            {/* Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-title">Cronograma</h1>
                    <p className="page-subtitle">
                        Acompanhe prazos e entregas
                    </p>
                </div>
                <div className="page-header-right">
                    <button onClick={() => setIsEventModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus className="w-4 h-4" />
                        Novo Evento
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
                {/* Calendar */}
                <div className="glass-panel" style={{ animationDelay: '0.1s' }}>
                    {/* Calendar Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '24px'
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            fontFamily: "'Outfit', sans-serif",
                            color: 'var(--dash-text-primary)'
                        }}>
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-icon" onClick={prevMonth}>
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="btn-icon" onClick={nextMonth}>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Week Days */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        marginBottom: '12px'
                    }}>
                        {weekDays.map(day => (
                            <div
                                key={day}
                                style={{
                                    textAlign: 'center',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: 'var(--dash-text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    padding: '8px'
                                }}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px'
                    }}>
                        {getDaysInMonth(currentDate).map((day, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedDate(day.date)}
                                style={{
                                    aspectRatio: '1',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    background: isSelected(day.date)
                                        ? 'var(--dash-accent)'
                                        : isToday(day.date)
                                            ? 'var(--dash-accent-bg)'
                                            : 'transparent',
                                    border: isToday(day.date) && !isSelected(day.date)
                                        ? '1px solid var(--dash-accent)'
                                        : '1px solid transparent',
                                    color: isSelected(day.date)
                                        ? 'white'
                                        : day.isCurrentMonth
                                            ? 'var(--dash-text-primary)'
                                            : 'var(--dash-text-muted)',
                                    opacity: day.isCurrentMonth ? 1 : 0.4,
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected(day.date)) {
                                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected(day.date)) {
                                        e.currentTarget.style.background = isToday(day.date)
                                            ? 'var(--dash-accent-bg)'
                                            : 'transparent';
                                    }
                                }}
                            >
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: isToday(day.date) ? '600' : '400'
                                }}>
                                    {day.date.getDate()}
                                </span>
                                {hasEvent(day.date) && (
                                    <div style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: isSelected(day.date) ? 'white' : getEventColor(day.date),
                                        marginTop: '4px'
                                    }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Upcoming Events */}
                    <div className="glass-panel" style={{ animationDelay: '0.2s' }}>
                        <h3 className="glass-panel-title" style={{ marginBottom: '16px' }}>
                            Próximos Eventos
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {events.map((event, index) => (
                                <div
                                    key={event.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '14px',
                                        padding: '14px',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: '14px',
                                        borderLeft: `3px solid ${event.color}`,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        opacity: 0,
                                        animation: 'fadeInUp 0.4s ease forwards',
                                        animationDelay: `${0.2 + index * 0.05}s`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: `${event.color}20`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Calendar className="w-4 h-4" style={{ color: event.color }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: 'var(--dash-text-primary)',
                                            marginBottom: '4px'
                                        }}>{event.title}</p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: 'var(--dash-text-muted)'
                                        }}>{event.project} · {event.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="glass-panel" style={{ animationDelay: '0.3s' }}>
                        <h3 className="glass-panel-title" style={{ marginBottom: '16px' }}>
                            Tarefas Pendentes
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {upcomingTasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 14px',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: '12px',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        opacity: 0,
                                        animation: 'fadeInUp 0.4s ease forwards',
                                        animationDelay: `${0.35 + index * 0.05}s`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                    }}
                                >
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        border: '2px solid rgba(255, 255, 255, 0.2)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            color: 'var(--dash-text-primary)',
                                            marginBottom: '2px'
                                        }}>{task.title}</p>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <span style={{
                                                fontSize: '11px',
                                                color: 'var(--dash-text-muted)'
                                            }}>{task.project}</span>
                                            <span style={{
                                                width: '4px',
                                                height: '4px',
                                                borderRadius: '50%',
                                                background: 'var(--dash-text-muted)'
                                            }} />
                                            <span style={{
                                                fontSize: '11px',
                                                color: getPriorityColor(task.priority)
                                            }}>{task.dueIn}</span>
                                        </div>
                                    </div>
                                    <Flag
                                        className="w-3.5 h-3.5"
                                        style={{ color: getPriorityColor(task.priority) }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Event Modal */}
            <Modal
                isOpen={isEventModalOpen}
                onClose={() => setIsEventModalOpen(false)}
                title="Novo Evento"
            >
                <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Título do Evento</label>
                        <input
                            type="text"
                            placeholder="Ex: Reunião com Cliente"
                            className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[var(--dash-accent)] transition-colors"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Data</label>
                            <input
                                type="date"
                                className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[var(--dash-accent)] transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Hora</label>
                            <input
                                type="time"
                                className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[var(--dash-accent)] transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Projeto Vinculado</label>
                        <select className="w-full bg-[var(--dash-bg-primary)] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[var(--dash-accent)] transition-colors appearance-none">
                            <option value="">Selecione um projeto...</option>
                            <option value="marc">Dr. Marcus - Landing Page</option>
                            <option value="jm">JM Advogados</option>
                            <option value="studio">Studio Design</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--dash-text-secondary)] mb-1.5">Tipo</label>
                        <div className="flex gap-2">
                            {['deadline', 'meeting', 'review'].map(type => (
                                <button
                                    type="button"
                                    key={type}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:bg-white/5 transition-all text-[var(--dash-text-muted)] focus:border-[var(--dash-accent)] focus:text-[var(--dash-accent)]"
                                >
                                    {type === 'deadline' ? 'Deadline' : type === 'meeting' ? 'Reunião' : 'Revisão'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsEventModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--dash-text-secondary)] hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Adicionar Evento
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
