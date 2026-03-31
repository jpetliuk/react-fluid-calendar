import type React from 'react';

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string;
    type?: 'rental' | 'maintenance' | string;

    // Rental specific fields
    customer?: {
        name: string;
        company?: string;
        contact?: string; // email
        phone?: string;
        avatar?: string; // image URL
        extraFields?: DisplayField[];
    };
    asset?: {
        name: string;
        licensePlate?: string;
        id?: string;
        contract?: string;
        extraFields?: DisplayField[];
    };
    details?: {
        name: string;
        extraFields?: DisplayField[];
    };
    status?: string;
    location?: string;
    notes?: string;
    orderLink?: string;

    /**
     * Highly flexible display configuration for the event modal.
     * If provided, these groups will be rendered instead of the default layout.
     */
    displayGroups?: DisplayGroup[];

    /**
     * Extra custom groups to be appended to the standard layout.
     * Use this if you want to keep the default sections (Customer, Asset, etc.)
     * but add additional categorized information.
     */
    extraGroups?: DisplayGroup[];

    [key: string]: unknown;
}

/**
 * A highly flexible display field for the event modal.
 * Can be used to show IDs, license plates, contact info, etc.
 */
export interface DisplayField {
    label?: string;
    value: React.ReactNode;
    icon?: React.ReactNode; // Optional small icon next to the value
    size?: 'small' | 'large'; // 'large' is roughly text-sm bold, 'small' is text-xs
}

/**
 * A group of fields to be displayed in the event modal.
 * Includes a section title and optional icon theme.
 */
export interface DisplayGroup {
    title?: string;
    icon?: React.ReactNode;
    fields: DisplayField[];
    /** Theme color for the group icon background (e.g. 'blue', 'indigo', 'amber' or a hex code) */
    color?: string;
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
    theme?: 'light' | 'dark';                   // Visual theme (default 'light')
    onViewChange?: (view: ViewMode) => void;
    width?: string | number;                    // CSS width (default '100%')
    height?: string | number;                   // CSS height (default 'auto')
    monthlyCalendar?: MonthlyCalendarSettings;
    weeklyCalendar?: WeeklyCalendarSettings;
    renderEvent?: (event: CalendarEvent) => React.ReactNode;
}
