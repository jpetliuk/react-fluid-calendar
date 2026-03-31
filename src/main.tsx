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
            contact: 'jane@acme.com',
            phone: '+1 (555) 987-6543',
            avatar: 'https://i.pravatar.cc/150?u=jane'
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
    },
    {
        id: 'evt-5',
        title: 'Rental: Pickup Ref #90',
        type: 'rental',
        start: new Date(currentYear, currentMonth, startDay + 1, 13, 0),
        end: new Date(currentYear, currentMonth, startDay + 1, 16, 0),
        status: 'Active',
        details: {
            name: 'Contract 0x82f'
        },
        asset: {
            name: 'Truck T-45',
            contract: 'Contract 0x82f'
        },
        customer: {
            name: 'Mike Smith',
            company: 'Smith & Co',
            phone: '+1 (555) 012-3456',
            avatar: 'https://i.pravatar.cc/150?u=mike'
        }
    },
    {
        id: 'evt-6',
        title: 'Marcos Phips (FL4312)',
        type: 'rental',
        status: 'Confirmed',
        start: new Date(currentYear, currentMonth, startDay + 2, 14, 0),
        end: new Date(currentYear, currentMonth, startDay + 2, 16, 0),
        details: {
            name: 'Contract #432414'
        },
        customer: {
            name: 'Mike Smith',
            company: 'Smith & Co',
            contact: 'mike@smith.co',
            phone: '+1 (555) 012-3456',

        },
        asset: {
            name: 'Truck T-45',
            id: 'T-45'
        },
        orderLink: '/orders/432414'
    }
];

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <div className="min-h-screen w-full px-8 py-4 bg-zinc-50 flex items-start justify-center">
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
