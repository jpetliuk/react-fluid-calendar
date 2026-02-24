import React from 'react';
import ReactDOM from 'react-dom/client';
import { FluidCalendar } from './components/Calendar';
import type { CalendarEvent } from './types';
import './index.css';

const today = new Date();

const startOfCurrentWeek = new Date(today);
startOfCurrentWeek.setDate(today.getDate() - today.getDay()); // Sunday
const currentYear = startOfCurrentWeek.getFullYear();
const currentMonth = startOfCurrentWeek.getMonth();
const startDay = startOfCurrentWeek.getDate();

const events: CalendarEvent[] = [
    {
        id: 'evt-1',
        title: 'Weekly Standup',
        type: 'default',
        start: new Date(currentYear, currentMonth, startDay + 1, 10, 0),
        end: new Date(currentYear, currentMonth, startDay + 1, 11, 0),
    },
    {
        id: 'evt-2',
        title: 'Equipment Maintenance',
        type: 'maintenance',
        start: new Date(currentYear, currentMonth, startDay + 2, 14, 0),
        end: new Date(currentYear, currentMonth, startDay + 2, 16, 0),
        asset: {
            name: 'Forklift A-1',
            id: 'FL-001'
        },
        notes: 'Quarterly inspection'
    },
    {
        id: 'evt-3',
        title: 'Client Rental: Acme Corp',
        type: 'rental',
        start: new Date(currentYear, currentMonth, startDay + 3, 9, 0),
        end: new Date(currentYear, currentMonth, startDay + 5, 17, 0),
        customer: {
            name: 'Jane Doe',
            company: 'Acme Corp',
            contact: 'jane@acme.com'
        },
        location: 'Main Warehouse',
        orderLink: '/orders/12345'
    },
    {
        id: 'evt-4',
        title: 'Company Holiday Party',
        type: 'default',
        start: new Date(currentYear, currentMonth, startDay + 4, 18, 0),
        end: new Date(currentYear, currentMonth, startDay + 4, 22, 0),
        color: '#10b981', // Emerald green
        notes: 'Holiday party for all staff. Food will be provided!'
    }
];

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <div className="min-h-screen w-full px-8 py-4 bg-zinc-950 flex items-start justify-center">
            <FluidCalendar
                events={events}
                theme="light"
                view="week"
                height={750}
                monthlyCalendar={{
                    // dayHeight: 130,
                }}
                weeklyCalendar={{
                    startHour: 4,
                    endHour: 24,
                    // dayHeight: 900,
                }}
            />
        </div>
    </React.StrictMode>,
);
