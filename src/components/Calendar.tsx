import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MonthCalendar } from './MonthCalendar';
import { WeekCalendar } from './WeekCalendar';
import type { FluidCalendarProps, ViewMode } from '../types';
import '../index.css';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export const FluidCalendar: React.FC<FluidCalendarProps> = ({
    events = [],
    view: initialView = 'month',
    onViewChange,
    width = '100%',
    height,
    monthlyCalendar,
    weeklyCalendar,
    renderEvent,
}) => {
    const [view, setView] = useState<ViewMode>(initialView);
    const currentDate = new Date();

    const handleViewChange = (v: ViewMode) => {
        setView(v);
        onViewChange?.(v);
    };

    return (
        <div
            className="bg-white rounded-xl border border-zinc-200 shadow-lg overflow-hidden flex flex-col"
            style={{ width, height: height ?? 'auto' }}
        >
            {view === 'month' && (
                <MonthCalendar
                    currentDate={currentDate}
                    events={events}
                    settings={monthlyCalendar}
                    view={view}
                    onViewChange={handleViewChange}
                    renderEvent={renderEvent}
                />
            )}
            {view === 'week' && (
                <WeekCalendar
                    currentDate={currentDate}
                    events={events}
                    settings={weeklyCalendar}
                    view={view}
                    onViewChange={handleViewChange}
                    renderEvent={renderEvent}
                />
            )}
        </div>
    );
};
