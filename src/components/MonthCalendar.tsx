import React, { useState, useMemo } from 'react';
import {
    startOfMonth, startOfWeek, addDays, addMonths, subMonths,
    format, isSameMonth, isToday, isSameDay
} from 'date-fns';
import { cn } from '../utils/theme';
import { DayDetailModal } from './DayDetailModal';
import type { CalendarEvent, MonthlyCalendarSettings } from '../types';

interface MonthCalendarProps {
    currentDate: Date;
    events: CalendarEvent[];
    settings?: MonthlyCalendarSettings;
    view: 'month' | 'week';
    onViewChange: (view: 'month' | 'week') => void;
    renderEvent?: (event: CalendarEvent) => React.ReactNode;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ANIM_MS = 320;

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
    currentDate,
    events,
    settings,
    view,
    onViewChange,
    renderEvent,
}) => {
    const [displayDate, setDisplayDate] = useState(currentDate);
    const [labelAnimating, setLabelAnimating] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [outgoingDate, setOutgoingDate] = useState<Date | null>(null);
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const navigate = (dir: 'next' | 'prev') => {
        if (labelAnimating) return;
        setDirection(dir);
        setOutgoingDate(displayDate);
        setLabelAnimating(true);
        setDisplayDate(d => dir === 'next' ? addMonths(d, 1) : subMonths(d, 1));
        setTimeout(() => {
            setOutgoingDate(null);
            setLabelAnimating(false);
        }, ANIM_MS);
    };

    const monthStart = startOfMonth(displayDate);
    const gridStart = startOfWeek(monthStart);
    const days = Array.from({ length: 35 }, (_, i) => addDays(gridStart, i));

    // Memoize the grouping of events by day string to turn an O(N*35) operation into O(N)
    const eventsByDay = useMemo(() => {
        const grouped: Record<string, CalendarEvent[]> = {};
        for (const event of events) {
            const dateStr = format(event.start, 'yyyy-MM-dd');
            if (!grouped[dateStr]) grouped[dateStr] = [];
            grouped[dateStr].push(event);
        }
        return grouped;
    }, [events]);

    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-zinc-950">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0">
                <div className="flex items-center gap-3">
                    {/* Prev / Next buttons */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => navigate('prev')}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all"
                            aria-label="Previous month"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => navigate('next')}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all"
                            aria-label="Next month"
                        >
                            →
                        </button>
                    </div>

                    {/* Animated label — only "February 2026" rolls */}
                    <div className="relative" style={{ perspective: '600px' }}>
                        {/* Outgoing label — overlaid absolutely during animation */}
                        {outgoingDate && (
                            <div
                                className="absolute inset-0 flex items-center pointer-events-none"
                                style={{
                                    animation: `${direction === 'next' ? 'roll-out-up' : 'roll-out-down'} ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1) forwards`,
                                    transformOrigin: direction === 'next' ? 'center top' : 'center bottom',
                                }}
                            >
                                <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight whitespace-nowrap">
                                    {format(outgoingDate, 'MMMM')}{' '}
                                    <span className="text-zinc-400 dark:text-zinc-500 font-light">{format(outgoingDate, 'yyyy')}</span>
                                </h2>
                            </div>
                        )}
                        {/* Incoming label — always in normal flow, always visible */}
                        <h2
                            className="text-xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight whitespace-nowrap"
                            style={labelAnimating ? {
                                animation: `${direction === 'next' ? 'roll-in-down' : 'roll-in-up'} ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1) forwards`,
                                transformOrigin: direction === 'next' ? 'center bottom' : 'center top',
                            } : {}}
                        >
                            {format(displayDate, 'MMMM')}{' '}
                            <span className="text-zinc-400 dark:text-zinc-500 font-light">{format(displayDate, 'yyyy')}</span>
                        </h2>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
                    <button
                        onClick={() => onViewChange('month')}
                        className={cn('px-3 py-1 rounded-md text-sm font-medium transition-all', view === 'month' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200')}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => onViewChange('week')}
                        className={cn('px-3 py-1 rounded-md text-sm font-medium transition-all', view === 'week' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200')}
                    >
                        Week
                    </button>
                </div>
            </div>

            {/* Day-of-week labels */}
            <div className="grid grid-cols-7 border-t border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                {DAY_NAMES.map(name => (
                    <div key={name} className="py-2 text-center text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase border-r border-zinc-100 dark:border-zinc-800 last:border-r-0">
                        {name}
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div
                className={cn(
                    'grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800',
                    !settings?.dayHeight && 'flex-1 min-h-0'
                )}
                style={settings?.dayHeight
                    ? { gridTemplateRows: `repeat(5, ${settings.dayHeight}px)` }
                    : { gridTemplateRows: 'repeat(5, 1fr)' }
                }
            >
                {days.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayEvents = eventsByDay[dateStr] || [];
                    const isCurrentMonth = isSameMonth(day, displayDate);
                    const today = isToday(day);

                    return (
                        <div
                            key={day.toISOString()}
                            onClick={() => setSelectedDay(day)}
                            className={cn(
                                'border-r border-t border-zinc-100 dark:border-zinc-800 last:border-r-0 p-2 overflow-hidden flex flex-col min-h-0 transition-colors cursor-pointer group',
                                !isCurrentMonth && 'bg-zinc-50/60 dark:bg-zinc-900/40',
                                today && isCurrentMonth && 'bg-indigo-50/30 dark:bg-indigo-900/20',
                                'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            )}
                        >
                            <span className={cn(
                                'text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1 shrink-0 transition-transform group-hover:scale-110',
                                today ? 'bg-indigo-600 text-white' : isCurrentMonth ? 'text-zinc-700 dark:text-zinc-200' : 'text-zinc-300 dark:text-zinc-600'
                            )}>
                                {format(day, 'd')}
                            </span>

                            <div className="flex flex-col gap-0.5 overflow-hidden">
                                {dayEvents.slice(0, 3).map(event =>
                                    renderEvent ? renderEvent(event) : (
                                        <div
                                            key={event.id}
                                            className={cn(
                                                'text-[10px] px-1.5 py-0.5 rounded truncate border',
                                                !event.color && (event.type === 'maintenance'
                                                    ? 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-300'
                                                    : 'bg-indigo-50 border-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300')
                                            )}
                                            style={event.color ? { backgroundColor: `${event.color}15`, color: event.color, borderColor: `${event.color}30` } : undefined}
                                        >
                                            {event.title}
                                        </div>
                                    )
                                )}
                                {dayEvents.length > 3 && (
                                    <button
                                        onClick={e => { e.stopPropagation(); setSelectedDay(day); }}
                                        className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 pl-1 mt-0.5 text-left transition-colors"
                                    >
                                        +{dayEvents.length - 3} more
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Day detail modal */}
            {selectedDay && (
                <DayDetailModal
                    day={selectedDay}
                    events={events.filter(e => isSameDay(e.start, selectedDay))}
                    onClose={() => setSelectedDay(null)}
                    renderEvent={renderEvent}
                />
            )}
        </div>
    );
};
