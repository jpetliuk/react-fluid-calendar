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
                            {event.status && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/30 dark:bg-sky-900/20 dark:text-sky-300 shrink-0">
                                    {event.status}
                                </span>
                            )}
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

                             {/* Detail Sections */}
                             <div className="mt-8 space-y-6">
                                 {event.displayGroups ? (
                                     event.displayGroups.map((group, idx) => (
                                         <div key={idx} className="flex items-start gap-4 group/item">
                                             {group.icon && (
                                                 <div 
                                                     className={cn(
                                                         "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border overflow-hidden transition-transform group-hover/item:scale-105",
                                                         (() => {
                                                             const colors: Record<string, string> = {
                                                                 blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
                                                                 indigo: 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800',
                                                                 amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
                                                                 rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800',
                                                                 emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
                                                                 zinc: 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-100 dark:border-zinc-700',
                                                             };
                                                             return colors[group.color || 'blue'] || (group.color?.startsWith('#') ? '' : colors.blue);
                                                         })()
                                                     )}
                                                     style={group.color?.startsWith('#') ? { backgroundColor: `${group.color}15`, color: group.color, borderColor: `${group.color}30` } : undefined}
                                                 >
                                                     {typeof group.icon === 'string' ? (
                                                         <img src={group.icon} alt={group.title || ''} className="w-full h-full object-cover" />
                                                     ) : group.icon}
                                                 </div>
                                             )}
                                             <div className="flex-1 min-w-0 pt-0.5">
                                                 {group.title && (
                                                     <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
                                                         {group.title}
                                                     </h3>
                                                 )}
                                                 <div className="space-y-1.5">
                                                     {group.fields.map((field, fIdx) => (
                                                         <div key={fIdx}>
                                                             {field.label && (
                                                                 <h4 className="text-[9px] font-bold text-zinc-400/80 dark:text-zinc-500/80 uppercase tracking-tight mb-0.5">
                                                                     {field.label}
                                                                 </h4>
                                                             )}
                                                             <div className="flex items-center gap-1.5 min-w-0">
                                                                 {field.icon && (
                                                                     <span className={cn(
                                                                         "shrink-0 flex items-center justify-center",
                                                                         field.size === 'large' ? "text-zinc-500 w-4 h-4" : "text-zinc-400 w-3.5 h-3.5"
                                                                     )}>
                                                                         {field.icon}
                                                                     </span>
                                                                 )}
                                                                 <div className={cn(
                                                                     "truncate",
                                                                     field.size === 'large' 
                                                                         ? "text-sm font-semibold text-zinc-900 dark:text-zinc-100" 
                                                                         : "text-xs text-zinc-500 dark:text-zinc-400"
                                                                 )}>
                                                                     {field.value}
                                                                 </div>
                                                             </div>
                                                         </div>
                                                     ))}
                                                 </div>
                                             </div>
                                         </div>
                                     ))
                                 ) : (
                                     <>
                                         {event.details && (
                                             <div className="flex items-start gap-4 group">
                                                 <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 group-hover:scale-105 transition-transform">
                                                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                                     </svg>
                                                 </div>
                                                 <div className="flex-1 min-w-0 pt-0.5">
                                                     <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Order Info</h3>
                                                     <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{event.details.name}</div>
                                                     <div className="text-xs text-zinc-500 dark:text-zinc-400">Order Reference</div>
                                                     {event.details.extraFields?.map((field, fIdx) => (
                                                         <div key={fIdx} className="mt-1.5">
                                                             {field.label && <h4 className="text-[9px] font-bold text-zinc-400/80 uppercase tracking-tight mb-0.5">{field.label}</h4>}
                                                             <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">{field.icon} {field.value}</div>
                                                         </div>
                                                     ))}
                                                 </div>
                                             </div>
                                         )}

                                         {event.customer && (
                                             <div className="flex items-start gap-4 pt-1">
                                                 {/* Customer Logo/Avatar */}
                                                 <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800 overflow-hidden">
                                                     {event.customer.avatar ? (
                                                         <img src={event.customer.avatar} alt={event.customer.name} className="w-full h-full object-cover" />
                                                     ) : (
                                                         <svg className="w-5 h-5 text-indigo-500/80 dark:text-indigo-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                         </svg>
                                                     )}
                                                 </div>
                                                 <div className="flex-1 min-w-0 pt-0.5">
                                                     <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Customer Profile</h3>
                                                     <div className="flex items-center gap-2 mb-0.5">
                                                         <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{event.customer.name}</div>
                                                     </div>
                                                     {event.customer.company && (
                                                         <div className="text-xs text-zinc-500 dark:text-zinc-400">{event.customer.company}</div>
                                                     )}

                                                     {(event.customer.contact || event.customer.phone || event.customer.extraFields) && (
                                                         <div className="mt-2 space-y-1.5">
                                                             {event.customer.contact && (
                                                                 <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                                                                     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                     </svg>
                                                                     <span className="text-xs font-medium">{event.customer.contact}</span>
                                                                 </div>
                                                             )}
                                                             {event.customer.phone && (
                                                                 <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                                                                     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                                     </svg>
                                                                     <span className="text-xs font-medium">{event.customer.phone}</span>
                                                                 </div>
                                                             )}
                                                             {event.customer.extraFields?.map((field, fIdx) => (
                                                                 <div key={fIdx} className="flex flex-col">
                                                                     {field.label && <h4 className="text-[9px] font-bold text-zinc-400/80 uppercase tracking-tight mb-0.5">{field.label}</h4>}
                                                                     <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">{field.icon} {field.value}</div>
                                                                 </div>
                                                             ))}
                                                         </div>
                                                     )}
                                                 </div>
                                             </div>
                                         )}

                                         {event.asset && (
                                             <div className="flex items-start gap-4 pt-1">
                                                 <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800 group-hover:scale-105 transition-transform">
                                                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                                     </svg>
                                                 </div>
                                                 <div className="flex-1 min-w-0 pt-0.5">
                                                     <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Assigned Unit</h3>
                                                     <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{event.asset.name}</div>
                                                     {event.asset.licensePlate && (
                                                         <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Plate: {event.asset.licensePlate}</div>
                                                     )}
                                                     {event.asset.id && (
                                                         <div className="text-[10px] text-zinc-400 dark:text-zinc-500">ID: {event.asset.id}</div>
                                                     )}
                                                     {event.asset.contract && (
                                                         <div className="text-[10px] text-zinc-400 dark:text-zinc-500">Contract: {event.asset.contract}</div>
                                                     )}
                                                     {event.asset.extraFields?.map((field, fIdx) => (
                                                         <div key={fIdx} className="mt-1">
                                                             {field.label && <h4 className="text-[9px] font-bold text-zinc-400/80 uppercase tracking-tight mb-0.5">{field.label}</h4>}
                                                             <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">{field.icon} {field.value}</div>
                                                         </div>
                                                     ))}
                                                 </div>
                                             </div>
                                         )}

                                         {event.extraGroups?.map((group, gIdx) => (
                                             <div key={gIdx} className="flex items-start gap-4 group/item">
                                                 {group.icon && (
                                                     <div 
                                                         className={cn(
                                                             "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border overflow-hidden transition-transform group-hover/item:scale-105",
                                                             (() => {
                                                                 const colors: Record<string, string> = {
                                                                     blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
                                                                     indigo: 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800',
                                                                     amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
                                                                     rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800',
                                                                     emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
                                                                     zinc: 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-100 dark:border-zinc-700',
                                                                 };
                                                                 return colors[group.color || 'blue'] || (group.color?.startsWith('#') ? '' : colors.blue);
                                                             })()
                                                         )}
                                                         style={group.color?.startsWith('#') ? { backgroundColor: `${group.color}15`, color: group.color, borderColor: `${group.color}30` } : undefined}
                                                     >
                                                         {typeof group.icon === 'string' ? (
                                                             <img src={group.icon} alt={group.title || ''} className="w-full h-full object-cover" />
                                                         ) : group.icon}
                                                     </div>
                                                 )}
                                                 <div className="flex-1 min-w-0 pt-0.5">
                                                     {group.title && (
                                                         <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
                                                             {group.title}
                                                         </h3>
                                                     )}
                                                     <div className="space-y-1.5">
                                                         {group.fields.map((field, fIdx) => (
                                                             <div key={fIdx}>
                                                                 {field.label && (
                                                                     <h4 className="text-[9px] font-bold text-zinc-400/80 dark:text-zinc-500/80 uppercase tracking-tight mb-0.5">
                                                                         {field.label}
                                                                     </h4>
                                                                 )}
                                                                 <div className="flex items-center gap-1.5 min-w-0">
                                                                     {field.icon && (
                                                                         <span className={cn(
                                                                             "shrink-0 flex items-center justify-center",
                                                                             field.size === 'large' ? "text-zinc-500 w-4 h-4" : "text-zinc-400 w-3.5 h-3.5"
                                                                         )}>
                                                                             {field.icon}
                                                                         </span>
                                                                     )}
                                                                     <div className={cn(
                                                                         "truncate",
                                                                         field.size === 'large' 
                                                                             ? "text-sm font-semibold text-zinc-900 dark:text-zinc-100" 
                                                                             : "text-xs text-zinc-500 dark:text-zinc-400"
                                                                     )}>
                                                                         {field.value}
                                                                     </div>
                                                                 </div>
                                                             </div>
                                                         ))}
                                                     </div>
                                                 </div>
                                             </div>
                                         ))}
                                     </>
                                 )}

                                 {(event.location || event.notes) && (
                                     <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 space-y-4">
                                         {event.location && (
                                             <div className="flex items-start gap-4">
                                                 <div className="w-5 h-5 flex items-center justify-center shrink-0 text-zinc-400">
                                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                     </svg>
                                                 </div>
                                                 <div className="text-sm text-zinc-600 dark:text-zinc-300">{event.location}</div>
                                             </div>
                                         )}

                                         {event.notes && (
                                             <div className="flex items-start gap-4">
                                                 <div className="w-5 h-5 flex items-center justify-center shrink-0 text-zinc-400">
                                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                                                     </svg>
                                                 </div>
                                                 <div className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed italic">{event.notes}</div>
                                             </div>
                                         )}
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
