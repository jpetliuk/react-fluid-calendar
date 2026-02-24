import React, { useEffect, useRef } from 'react';
import { format, isSameMinute, startOfDay } from 'date-fns';
import { cn } from '../utils/theme';
import type { CalendarEvent } from '../types';

interface EventDetailModalProps {
    event: CalendarEvent;
    onClose: () => void;
    renderEvent?: (event: CalendarEvent) => React.ReactNode;
}

function eventTypeStyle(type?: string) {
    if (type === 'maintenance') {
        return {
            pill: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
            dot: 'bg-rose-500',
            label: 'Maintenance',
        };
    }
    if (type === 'rental') {
        return {
            pill: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
            dot: 'bg-indigo-500',
            label: 'Rental',
        };
    }
    return {
        pill: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
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

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
    event,
    onClose,
    renderEvent,
}) => {
    const panelRef = useRef<HTMLDivElement>(null);

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

    const style = eventTypeStyle(event.type);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ animation: 'day-modal-backdrop-in 220ms ease forwards' }}
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
            aria-modal="true"
            role="dialog"
            aria-label={`Details for ${event.title}`}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

            {/* Panel */}
            <div
                ref={panelRef}
                tabIndex={-1}
                className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 flex flex-col outline-none overflow-hidden"
                style={{
                    animation: 'day-modal-panel-in 260ms cubic-bezier(0.34,1.56,0.64,1) forwards',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 mb-3">
                            <div
                                className={cn('w-2.5 h-2.5 rounded-full shrink-0', !event.color && style.dot)}
                                style={event.color ? { backgroundColor: event.color } : undefined}
                            />
                            <span
                                className={cn(
                                    'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border dark:border-zinc-700/50 shrink-0',
                                    !event.color && style.pill
                                )}
                                style={event.color ? { backgroundColor: `${event.color}15`, color: event.color, borderColor: `${event.color}30` } : undefined}
                            >
                                {style.label}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-all shrink-0 -mt-2 -mr-2"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>

                    {renderEvent ? renderEvent(event) : (
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-1">
                                {event.title}
                            </h2>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                {format(event.start, 'EEEE, MMMM d, yyyy')}
                            </p>
                            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
                                {formatEventTime(event.start, event.end)}
                            </p>

                            {/* Rental Specific Details */}
                            <div className="mt-6 space-y-4">
                                {event.customer && (
                                    <div>
                                        <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Customer</h3>
                                        <div className="text-sm text-zinc-800 dark:text-zinc-200">
                                            <div className="font-medium">{event.customer.name}</div>
                                            {event.customer.company && <div className="text-zinc-500">{event.customer.company}</div>}
                                            {event.customer.contact && <div className="text-zinc-500">{event.customer.contact}</div>}
                                        </div>
                                    </div>
                                )}

                                {event.asset && (
                                    <div>
                                        <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Asset</h3>
                                        <div className="text-sm text-zinc-800 dark:text-zinc-200">
                                            <div className="font-medium">{event.asset.name}</div>
                                            {(event.asset.licensePlate || event.asset.id) && (
                                                <div className="text-zinc-500 mt-0.5">
                                                    {event.asset.licensePlate && <span>Plate: {event.asset.licensePlate}</span>}
                                                    {event.asset.licensePlate && event.asset.id && <span className="mx-2 text-zinc-300">•</span>}
                                                    {event.asset.id && <span>ID: {event.asset.id}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {event.location && (
                                    <div>
                                        <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Location</h3>
                                        <div className="text-sm text-zinc-800 dark:text-zinc-200">{event.location}</div>
                                    </div>
                                )}

                                {event.notes && (
                                    <div>
                                        <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Notes</h3>
                                        <div className="text-sm text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-700/50 leading-relaxed">{event.notes}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                {event.orderLink && (
                    <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800/50">
                        <a
                            href={event.orderLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                            View Full Order
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};
