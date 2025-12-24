import React, { useState } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Mock events data
const mockEvents = [
    { id: 1, title: 'Reunião de Kickoff', type: 'meeting', date: '2025-01-15', time: '10:00', project: 'Landing Page Dr. Marcus' },
    { id: 2, title: 'Entrega do Design', type: 'delivery', date: '2025-01-20', time: '14:00', project: 'E-commerce Studio' },
    { id: 3, title: 'Review com Cliente', type: 'meeting', date: '2025-01-25', time: '15:30', project: 'Consult Pro Website' },
    { id: 4, title: 'Deploy Final', type: 'delivery', date: '2025-01-30', time: '18:00', project: 'Landing Page Dr. Marcus' },
];

const upcomingTasks = [
    { id: 1, title: 'Ajustar Hero Section', project: 'Dr. Marcus', dueIn: '2 dias' },
    { id: 2, title: 'Implementar formulário', project: 'Studio Design', dueIn: '5 dias' },
    { id: 3, title: 'Revisar SEO tags', project: 'Consult Pro', dueIn: '1 semana' },
];

export default function TimelinePage() {
    const { isDarkMode } = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());

    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const getEventTypeStyle = (type) => {
        switch (type) {
            case 'meeting': return isDarkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200';
            case 'delivery': return isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return isDarkMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Cronograma</h1>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Gerencie eventos e entregas dos projetos</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    Novo Evento
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Section */}
                <div className={`lg:col-span-2 rounded-2xl border p-6 ${isDarkMode ? 'bg-[#1A1A20] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
                            >
                                <ChevronLeft className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
                            >
                                <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="space-y-3">
                        {mockEvents.map((event) => (
                            <div
                                key={event.id}
                                className={`p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getEventTypeStyle(event.type)}`}>
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{event.title}</h3>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{event.project}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{event.date}</p>
                                        <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{event.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar - Upcoming Tasks */}
                <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-[#1A1A20] border-white/5' : 'bg-white border-slate-200'}`}>
                    <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Próximas Tarefas</h2>
                    <div className="space-y-3">
                        {upcomingTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}
                            >
                                <h3 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{task.title}</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{task.project}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                                        {task.dueIn}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
