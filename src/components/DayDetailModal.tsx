import React, { useEffect, useRef, useState } from 'react';
import { format, isSameMinute, startOfDay } from 'date-fns';
import { cn } from './Calendar';
import { EventDetailModal } from './EventDetailModal';
import type { CalendarEvent } from '../types';

interface DayDetailModalProps {
    day: Date;
    events: CalendarEvent[];
    onClose: () => void;
    renderEvent?: (event: CalendarEvent) => React.ReactNode;
}

function eventTypeStyle(type?: string) {
    if (type === 'maintenance') {
        return {
            pill: 'bg-rose-100 text-rose-700 border-rose-200',
            dot: 'bg-rose-500',
            label: 'Maintenance',
        };
    }
    if (type === 'rental') {
        return {
            pill: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            dot: 'bg-indigo-500',
            label: 'Rental',
        };
    }
    return {
        pill: 'bg-zinc-100 text-zinc-600 border-zinc-200',
        dot: 'bg-zinc-400',
        label: type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Event',
    };
}

function formatEventTime(start: Date, end: Date): string {
    const allDay =
        isSameMinute(start, startOfDay(start)) &&
        isSameMinute(end, startOfDay(end));
    if (allDay) return 'All day';
    return `${format(start, 'h:mm a')} – ${format(end, 'h:mm a')}`;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
    day,
    events,
    onClose,
    renderEvent,
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    // Trap focus inside modal on open
    useEffect(() => {
        panelRef.current?.focus();
    }, []);

    const isToday =
        format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ animation: 'day-modal-backdrop-in 220ms ease forwards' }}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
            aria-label={`Events for ${format(day, 'MMMM d, yyyy')}`}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

            {/* Panel */}
            <div
                ref={panelRef}
                tabIndex={-1}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 flex flex-col outline-none"
                style={{
                    animation: 'day-modal-panel-in 260ms cubic-bezier(0.34,1.56,0.64,1) forwards',
                    maxHeight: '80vh',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-5 pb-3 shrink-0">
                    <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">
                            {format(day, 'EEEE')}
                        </p>
                        <h2 className="text-2xl font-bold text-zinc-900 leading-tight">
                            {format(day, 'd')}
                            {' '}
                            <span className="text-zinc-400 font-light text-xl">
                                {format(day, 'MMMM yyyy')}
                            </span>
                        </h2>
                        {isToday && (
                            <span className="inline-block mt-1 text-[10px] font-semibold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                                TODAY
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all shrink-0 mt-0.5"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-zinc-100 mx-5" />

                {/* Event list */}
                <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
                    {events.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-3xl mb-2">📅</div>
                            <p className="text-sm text-zinc-400">No events this day</p>
                        </div>
                    ) : (
                        events.map(event => {
                            if (renderEvent) {
                                return (
                                    <div key={event.id}>
                                        {renderEvent(event)}
                                    </div>
                                );
                            }

                            const style = eventTypeStyle(event.type);
                            return (
                                <div
                                    key={event.id}
                                    onClick={() => setSelectedEvent(event)}
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors group cursor-pointer"
                                >
                                    {/* Color dot */}
                                    <div className={cn('w-2.5 h-2.5 rounded-full mt-1.5 shrink-0', style.dot)} />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-800 leading-tight">
                                            {event.title}
                                        </p>
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                            {formatEventTime(event.start, event.end)}
                                        </p>
                                    </div>

                                    {/* Type badge */}
                                    <span className={cn(
                                        'text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0',
                                        style.pill
                                    )}>
                                        {style.label}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer count */}
                {events.length > 0 && (
                    <div className="px-5 py-3 border-t border-zinc-100 shrink-0">
                        <p className="text-xs text-zinc-400 text-right">
                            {events.length} {events.length === 1 ? 'event' : 'events'}
                        </p>
                    </div>
                )}
            </div>

            {/* Event Detail Modal (Nested) */}
            {selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    renderEvent={renderEvent}
                />
            )}
        </div>
    );
};
