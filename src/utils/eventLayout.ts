import type { CalendarEvent } from '../types';

export interface LayoutEvent extends CalendarEvent {
    top: number;
    height: number;
    left: number;
    width: number;
}

/**
 * Basic collision detection and layout for day view.
 * For Month view, we typically stack events vertically.
 */
export const layoutEventsForDay = (events: CalendarEvent[]): LayoutEvent[] => {
    // Placeholder logic for now, will expand for true layout engine
    return events.map((event, index) => ({
        ...event,
        top: index * 20, // Simple stacking
        height: 20,
        left: 0,
        width: 100
    }));
};

/**
 * Groups events by day for the Month view rendering
 */
export const groupEventsByDay = (events: CalendarEvent[]) => {
    const groups: Record<string, CalendarEvent[]> = {};

    events.forEach(event => {
        const dateKey = event.start.toDateString();
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(event);
    });

    return groups;
};
