import React from 'react';
import ReactDOM from 'react-dom/client';
import { FluidCalendar } from './components/Calendar';
import './index.css';

const today = new Date();

const startOfCurrentWeek = new Date(today);
startOfCurrentWeek.setDate(today.getDate() - today.getDay()); // Sunday
const currentYear = startOfCurrentWeek.getFullYear();
const currentMonth = startOfCurrentWeek.getMonth();
const startDay = startOfCurrentWeek.getDate();

const events = [
    // --- Sunday ---
    {
        id: 'sun-1', title: 'Sunday Brunch', type: 'default',
        start: new Date(currentYear, currentMonth, startDay, 10, 30),
        end: new Date(currentYear, currentMonth, startDay, 12, 0),
    },

    // --- Monday (Busy Morning Cluster) ---
    {
        id: 'mon-1', title: 'Sync with Engineering', type: 'default',
        start: new Date(currentYear, currentMonth, startDay + 1, 9, 0),
        end: new Date(currentYear, currentMonth, startDay + 1, 10, 0),
    },
    {
        id: 'mon-2', title: 'Design Review', type: 'rental',
        start: new Date(currentYear, currentMonth, startDay + 1, 9, 0),
        end: new Date(currentYear, currentMonth, startDay + 1, 10, 30),
    },
    {
        id: 'mon-3', title: 'Server Maintenance', type: 'maintenance',
        start: new Date(currentYear, currentMonth, startDay + 1, 9, 0),
        end: new Date(currentYear, currentMonth, startDay + 1, 11, 0),
    },
    {
        id: 'mon-4', title: 'Late Lunch', type: 'default',
        start: new Date(currentYear, currentMonth, startDay + 1, 14, 0),
        end: new Date(currentYear, currentMonth, startDay + 1, 15, 0),
    },

    // --- Tuesday (Late Night Cluster to test Upward Flip) ---
    {
        id: 'tue-1', title: 'Focus Time', type: 'default',
        start: new Date(currentYear, currentMonth, startDay + 2, 11, 0),
        end: new Date(currentYear, currentMonth, startDay + 2, 13, 0),
    },
    {
        id: 'tue-2', title: 'Deploy v2.0', type: 'maintenance',
        start: new Date(currentYear, currentMonth, startDay + 2, 22, 0),
        end: new Date(currentYear, currentMonth, startDay + 2, 23, 30),
    },
    {
        id: 'tue-3', title: 'Database Migration', type: 'maintenance',
        start: new Date(currentYear, currentMonth, startDay + 2, 22, 0),
        end: new Date(currentYear, currentMonth, startDay + 2, 23, 0),
    },
    {
        id: 'tue-4', title: 'Ops Standby', type: 'default',
        start: new Date(currentYear, currentMonth, startDay + 2, 22, 0),
        end: new Date(currentYear, currentMonth, startDay + 2, 23, 0),
    },

    // --- Wednesday ---
    {
        id: 'wed-1', title: 'Client Pitch: Acme Corp', type: 'rental',
        start: new Date(currentYear, currentMonth, startDay + 3, 14, 0),
        end: new Date(currentYear, currentMonth, startDay + 3, 15, 30),
    },
    {
        id: 'wed-2', title: 'Acme Q&A', type: 'default',
        start: new Date(currentYear, currentMonth, startDay + 3, 14, 30),
        end: new Date(currentYear, currentMonth, startDay + 3, 15, 0),
    },

    // --- Thursday (Massive cluster at 2 PM) ---
    {
        id: 'thu-1', title: 'All Hands', type: 'default',
        start: new Date(currentYear, currentMonth, startDay + 4, 14, 0),
        end: new Date(currentYear, currentMonth, startDay + 4, 15, 0),
    },
    {
        id: 'thu-2', title: 'QA Testing', type: 'rental',
        start: new Date(currentYear, currentMonth, startDay + 4, 14, 0),
        end: new Date(currentYear, currentMonth, startDay + 4, 16, 0),
    },
    {
        id: 'thu-3', title: 'Vendor Call', type: 'maintenance',
        start: new Date(currentYear, currentMonth, startDay + 4, 14, 0),
        end: new Date(currentYear, currentMonth, startDay + 4, 14, 30),
    },
    {
        id: 'thu-4', title: '1-on-1', type: 'default',
        start: new Date(currentYear, currentMonth, startDay + 4, 14, 0),
        end: new Date(currentYear, currentMonth, startDay + 4, 15, 0),
    },

    // --- Friday ---
    {
        id: 'fri-1', title: 'Wrap up', type: 'default',
        start: new Date(currentYear, currentMonth, startDay + 5, 16, 0),
        end: new Date(currentYear, currentMonth, startDay + 5, 17, 0),
    },
    {
        id: 'fri-2', title: 'Happy Hour', type: 'rental',
        start: new Date(currentYear, currentMonth, startDay + 5, 18, 0),
        end: new Date(currentYear, currentMonth, startDay + 5, 20, 0),
    },
];

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <div className="min-h-screen w-full px-8 py-4 bg-zinc-100 flex items-start justify-center">
            <FluidCalendar
                events={events}
                view="month"
                height={750}
                monthlyCalendar={{
                    // dayHeight: 130,
                }}
                weeklyCalendar={{
                    startHour: 0,
                    endHour: 24,
                    // dayHeight: 600,
                }}
            />
        </div>
    </React.StrictMode>,
);
