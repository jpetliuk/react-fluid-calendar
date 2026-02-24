import React, { useState } from 'react';
import { MonthCalendar } from './MonthCalendar';
import { WeekCalendar } from './WeekCalendar';
import type { FluidCalendarProps, ViewMode } from '../types';
import '../index.css';
import { cn } from '../utils/theme';


export const FluidCalendar: React.FC<FluidCalendarProps> = ({
    events = [],
    view: initialView = 'month',
    theme = 'light',
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
            className={cn(
                "bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg overflow-hidden flex flex-col text-zinc-900 dark:text-zinc-100",
                theme === 'dark' && "dark"
            )}
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
