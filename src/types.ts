import type React from 'react';

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string;
    type?: 'rental' | 'maintenance' | string;
    [key: string]: any;
}

export type ViewMode = 'month' | 'week';

// Settings for the MonthCalendar view
export interface MonthlyCalendarSettings {
    dayHeight?: number;  // Height of each day cell row in px (default: fills container)
}

// Settings for the WeekCalendar view
export interface WeeklyCalendarSettings {
    dayHeight?: number;  // Total height of the 24-hour time grid in px (default 600)
    startHour?: number;  // First hour shown (0-23, default 0)
    endHour?: number;    // Last hour shown (1-24, default 24)
}

export interface FluidCalendarProps {
    events: CalendarEvent[];
    view?: ViewMode;                            // Initial view (default 'month')
    onViewChange?: (view: ViewMode) => void;
    width?: string | number;                    // CSS width (default '100%')
    height?: string | number;                   // CSS height (default 'auto')
    monthlyCalendar?: MonthlyCalendarSettings;
    weeklyCalendar?: WeeklyCalendarSettings;
    renderEvent?: (event: CalendarEvent) => React.ReactNode;
}
