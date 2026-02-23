import React, { useState, useRef } from 'react';
import {
    startOfWeek, addDays, addWeeks, subWeeks,
    format, isToday, isSameDay
} from 'date-fns';
import { cn } from './Calendar';
import { EventDetailModal } from './EventDetailModal';
import type { CalendarEvent, WeeklyCalendarSettings } from '../types';

interface WeekCalendarProps {
    currentDate: Date;
    events: CalendarEvent[];
    settings?: WeeklyCalendarSettings;
    view: 'month' | 'week';
    onViewChange: (view: 'month' | 'week') => void;
    renderEvent?: (event: CalendarEvent) => React.ReactNode;
}

const ALL_HOURS = Array.from({ length: 24 }, (_, i) => i);
const TIME_COL_WIDTH = 56; // px

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
    currentDate,
    events,
    settings,
    view,
    onViewChange,
    renderEvent,
}) => {
    const startHour = settings?.startHour ?? 0;
    const endHour = settings?.endHour ?? 24;
    const hours = ALL_HOURS.slice(startHour, endHour);
    const totalHours = endHour - startHour;

    const [displayDate, setDisplayDate] = useState(currentDate);
    const [labelAnimating, setLabelAnimating] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [outgoingWeekStart, setOutgoingWeekStart] = useState<Date | null>(null);
    const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
    const [flippedCluster, setFlippedCluster] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleClusterEnter = (clusterId: string, clusterEvents: CalendarEvent[]) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setHoveredCluster(clusterId);

        // Smart Flip logic: check if the expanded cluster would overflow the bottom of the scroll container
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const containerBottom = container.scrollTop + container.clientHeight;

            // Calculate anchor top position in pixels relative to the scroll container's content height
            const anchor = clusterEvents[0];
            const s = Math.max(anchor.start.getHours() + anchor.start.getMinutes() / 60, startHour);
            let e = anchor.end.getHours() + anchor.end.getMinutes() / 60;
            if (e <= s) e = s + 1;

            const dayHeight = settings?.dayHeight ?? 600;
            const topPct = (s - startHour) / totalHours;
            const anchorTopPx = topPct * dayHeight;

            // Constrain card height to exactly 1 hour block minus 4px margin
            const baseCardHeightPx = (dayHeight / totalHours) - 4;
            const expandedCardHeightPx = Math.max(baseCardHeightPx, 48);

            // Total height of the expanded cluster
            const expandedHeight = clusterEvents.length * (expandedCardHeightPx + 2);

            // If the bottom of the expanded cluster goes past the visible bottom, flip it!
            if (anchorTopPx + expandedHeight > containerBottom) {
                setFlippedCluster(clusterId);
            } else {
                setFlippedCluster(null);
            }
        }
    };
    const handleClusterLeave = () => {
        hoverTimeout.current = setTimeout(() => {
            setHoveredCluster(null);
            setFlippedCluster(null);
        }, 80);
    };

    const weekStart = startOfWeek(displayDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const ANIM_MS = 320;

    const navigate = (dir: 'next' | 'prev') => {
        if (labelAnimating) return;
        setDirection(dir);
        setOutgoingWeekStart(startOfWeek(displayDate));
        setLabelAnimating(true);
        setDisplayDate(d => dir === 'next' ? addWeeks(d, 1) : subWeeks(d, 1));
        setTimeout(() => {
            setOutgoingWeekStart(null);
            setLabelAnimating(false);
        }, ANIM_MS);
    };

    // Group events into overlap clusters.
    // Instead of a rolling cluster end (which drags a 3pm event into a 2pm cluster just because it overlaps a 2:45 event),
    // we group events into the cluster ONLY if they overlap with the anchor (the first event in the cluster) visually.
    const computeClusters = (dayEvents: CalendarEvent[]): CalendarEvent[][] => {
        if (dayEvents.length === 0) return [];

        const visualEnd = (ev: CalendarEvent) =>
            Math.max(ev.end.getTime(), ev.start.getTime() + 60 * 60 * 1000);

        const sorted = [...dayEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
        const clusters: CalendarEvent[][] = [];
        let current: CalendarEvent[] = [sorted[0]];
        let anchorEnd = visualEnd(sorted[0]);

        for (let i = 1; i < sorted.length; i++) {
            const ev = sorted[i];
            // Only join the cluster if this event overlaps the anchor's visual block
            if (ev.start.getTime() < anchorEnd) {
                current.push(ev);
            } else {
                clusters.push(current);
                current = [ev];
                anchorEnd = visualEnd(ev);
            }
        }
        clusters.push(current);
        return clusters;
    };

    // Returns one style per event for both collapsed and expanded states.
    // Collapsed: all cards at the same top, each card 4px further right, later cards on top.
    // Expanded (Normal): cards stacked down with 2px gaps, top card stays on top.
    // Expanded (Flipped): cards stacked up with 2px gaps, top card stays on top.
    const getClusterStyles = (
        cluster: CalendarEvent[],
        isHovered: boolean,
        isFlipped: boolean
    ): React.CSSProperties[] => {
        const anchor = cluster[0];
        const dayHeight = settings?.dayHeight ?? 600;

        const s = Math.max(anchor.start.getHours() + anchor.start.getMinutes() / 60, startHour);
        let e = anchor.end.getHours() + anchor.end.getMinutes() / 60;
        if (e <= s) e = s + 1;

        const topPct = ((s - startHour) / totalHours) * 100;

        // Constrain card height to exactly 1 hour block minus 4px vertical margin
        const cardHeightPx = (dayHeight / totalHours) - 4;

        return cluster.map((_, idx) => {
            // Expand the card on hover if it's too small to read the details
            const heightPx = isHovered ? Math.max(cardHeightPx, 48) : cardHeightPx;

            const base: React.CSSProperties = {
                position: 'absolute',
                height: `${heightPx}px`,
                transition: 'height 220ms ease, top 220ms cubic-bezier(0.34,1.2,0.64,1), left 220ms cubic-bezier(0.34,1.2,0.64,1), right 220ms cubic-bezier(0.34,1.2,0.64,1)',
            };

            if (isHovered) {
                // Expanded
                const offsetPx = idx * (heightPx + 2);
                const sign = isFlipped ? -1 : 1; // Stack up or down
                return {
                    ...base,
                    // Add 2px offset from grid line
                    top: `calc(${topPct}% + ${sign * offsetPx}px + 2px)`,
                    left: '2px',
                    right: '6px',
                    // Keep card 0 slightly higher zIndex so clicking feels right
                    zIndex: 20 + (cluster.length - idx),
                };
            } else {
                // Collapsed (Original): each card 8px further right, later cards on top
                const offsetPx = Math.min(idx * 8, 40);
                return {
                    ...base,
                    top: `calc(${topPct}% + 2px)`,
                    left: `calc(2px + ${offsetPx}px)`,
                    right: '6px',
                    zIndex: 10 + idx,
                };
            }
        });
    };



    const formatHour = (h: number) => {
        if (h === 0) return '12 AM';
        if (h < 12) return `${h} AM`;
        if (h === 12) return '12 PM';
        return `${h - 12} PM`;
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0">
                <div className="flex items-center gap-3">
                    {/* Prev / Next */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => navigate('prev')}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 transition-all"
                            aria-label="Previous week"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => navigate('next')}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 transition-all"
                            aria-label="Next week"
                        >
                            →
                        </button>
                    </div>
                    {/* Animated week label */}
                    <div className="relative" style={{ perspective: '600px' }}>
                        {/* Outgoing label */}
                        {outgoingWeekStart && (
                            <div
                                className="absolute inset-0 flex items-center pointer-events-none"
                                style={{
                                    animation: `${direction === 'next' ? 'roll-out-up' : 'roll-out-down'} ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1) forwards`,
                                    transformOrigin: direction === 'next' ? 'center top' : 'center bottom',
                                }}
                            >
                                <h2 className="text-xl font-bold text-zinc-800 tracking-tight whitespace-nowrap">
                                    Week of {format(outgoingWeekStart, 'MMM d')}{' '}
                                    <span className="text-zinc-400 font-light">{format(outgoingWeekStart, 'yyyy')}</span>
                                </h2>
                            </div>
                        )}
                        {/* Incoming label */}
                        <h2
                            className="text-xl font-bold text-zinc-800 tracking-tight whitespace-nowrap"
                            style={labelAnimating ? {
                                animation: `${direction === 'next' ? 'roll-in-down' : 'roll-in-up'} ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1) forwards`,
                                transformOrigin: direction === 'next' ? 'center bottom' : 'center top',
                            } : {}}
                        >
                            Week of {format(weekStart, 'MMM d')}{' '}
                            <span className="text-zinc-400 font-light">{format(weekStart, 'yyyy')}</span>
                        </h2>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg">
                    <button
                        onClick={() => onViewChange('month')}
                        className={cn('px-3 py-1 rounded-md text-sm font-medium transition-all', view === 'month' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700')}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => onViewChange('week')}
                        className={cn('px-3 py-1 rounded-md text-sm font-medium transition-all', view === 'week' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700')}
                    >
                        Week
                    </button>
                </div>
            </div>

            {/* Day-of-week labels — fixed height */}
            <div className="flex shrink-0 border-t border-b border-zinc-100">
                {/* Spacer for time column */}
                <div style={{ width: TIME_COL_WIDTH }} className="shrink-0 border-r border-zinc-100 bg-zinc-50/30" />
                {/* Day headers */}
                <div className="flex-1 grid grid-cols-7">
                    {days.map(day => (
                        <div
                            key={day.toISOString()}
                            className={cn(
                                'flex flex-col items-center py-2 border-r border-zinc-100 last:border-r-0',
                                isToday(day) && 'bg-indigo-50/40'
                            )}
                        >
                            <span className={cn('text-[10px] uppercase font-bold tracking-wider mb-1', isToday(day) ? 'text-indigo-500' : 'text-zinc-400')}>
                                {format(day, 'EEE')}
                            </span>
                            <span className={cn(
                                'text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full',
                                isToday(day) ? 'bg-indigo-600 text-white' : 'text-zinc-700'
                            )}>
                                {format(day, 'd')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Time grid — fills available height, scrolls inner content */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto min-h-0"
            >
                <div
                    className="flex min-w-full relative"
                    style={{ minHeight: settings?.dayHeight ?? 600 }}
                >
                    {/* Time column */}
                    <div
                        className="shrink-0 border-r border-zinc-100 bg-zinc-50/30 relative"
                        style={{ width: TIME_COL_WIDTH }}
                    >
                        {hours.map((hour, idx) => (
                            <div
                                key={hour}
                                className={cn(
                                    'absolute w-full flex items-start justify-end pr-2 text-[10px] font-medium text-zinc-400',
                                    idx > 0 && '-translate-y-2'
                                )}
                                style={{ top: `${(idx / totalHours) * 100}%` }}
                            >
                                {formatHour(hour)}
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    <div className="flex-1 grid grid-cols-7 relative">
                        {/* Horizontal hour lines */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col">
                            {hours.map(hour => (
                                <div key={hour} className="flex-1 border-t border-zinc-100" />
                            ))}
                        </div>

                        {/* Day columns */}
                        {days.map(day => {
                            const dayEvents = events.filter(e => isSameDay(e.start, day));
                            const clusters = computeClusters(dayEvents);
                            return (
                                <div
                                    key={day.toISOString()}
                                    className={cn(
                                        'relative border-r border-zinc-100 last:border-r-0 h-full overflow-visible',
                                        isToday(day) && 'bg-indigo-50/10'
                                    )}
                                >
                                    {clusters.map(cluster => {
                                        const clusterId = cluster[0].id;
                                        const isHovered = hoveredCluster === clusterId;

                                        const isFlipped = flippedCluster === clusterId;

                                        return (
                                            <React.Fragment key={clusterId}>
                                                {cluster.map((event, idx) => {
                                                    const style = getClusterStyles(cluster, isHovered, isFlipped)[idx];
                                                    return renderEvent ? (
                                                        <div
                                                            key={event.id}
                                                            className="absolute"
                                                            style={style}
                                                            onMouseEnter={() => handleClusterEnter(clusterId, cluster)}
                                                            onMouseLeave={handleClusterLeave}
                                                            onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                                                        >
                                                            {renderEvent(event)}
                                                        </div>
                                                    ) : (
                                                        <div
                                                            key={event.id}
                                                            className={cn(
                                                                'absolute rounded-md p-0.5 px-1.5 text-[10px] sm:text-xs border shadow-sm flex flex-col justify-start overflow-visible cursor-pointer',
                                                                // Invisible pseudo-element hitbox extension to bridge gaps so hover state doesn't drop
                                                                'after:absolute after:-bottom-2 after:-right-2 after:-left-2 after:-top-2 after:bg-transparent -after:z-10',
                                                                event.type === 'maintenance'
                                                                    ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
                                                                    : 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100'
                                                            )}
                                                            style={style}
                                                            onMouseEnter={() => handleClusterEnter(clusterId, cluster)}
                                                            onMouseLeave={handleClusterLeave}
                                                            onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                                                        >
                                                            <div className="font-semibold leading-tight line-clamp-1">{event.title}</div>
                                                            {isHovered && (
                                                                <div className="text-[9px] opacity-70 truncate mt-0.5">{format(event.start, 'h:mm a')}</div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Event Detail Modal */}
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
