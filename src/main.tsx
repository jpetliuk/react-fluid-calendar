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
        id: 'test-1',
        title: 'Test: Basic Rental',
        type: 'rental',
        status: 'Active',
        start: new Date(currentYear, currentMonth, startDay + 1, 9, 0),
        end: new Date(currentYear, currentMonth, startDay + 1, 12, 0),
        customer: {
            name: 'John Test',
            link: 'https://example.com/customer/john',
            company: 'Testing Inc',
            phone: '+1 (555) 000-0000',
        },
        asset: {
            name: 'Standard Unit',
            link: 'https://example.com/asset/unit-001',
            id: 'UNIT-001'
        },
        details: {
            name: 'CONTRACT-ABC',
            link: 'https://example.com/order/abc'
        }
    },
    {
        id: 'test-2',
        title: 'Test: Extra Fields',
        type: 'rental',
        status: 'Audit',
        start: new Date(currentYear, currentMonth, startDay + 1, 13, 0),
        end: new Date(currentYear, currentMonth, startDay + 1, 16, 0),
        customer: {
            name: 'Extra Field User',
            extraFields: [
                { label: 'License', value: 'ABC-123', icon: '🪪' },
                { label: 'Company Name', value: 'Custom Hidden Label Co', hideLabel: true },
                { value: '+1 (555) 999-8888', icon: '💬', size: 'subtle' } // Replicating phone style with chat icon
            ]
        },
        asset: {
            name: 'Heavy Asset',
            extraFields: [
                { label: 'Plate', value: 'TEST-77', size: 'small' }
            ]
        },
        details: {
            name: 'Extra Fields Order',
            extraFields: [
                { label: 'Priority', value: 'High' }
            ]
        }
    },
    {
        id: 'test-3',
        title: 'Test: Extra Groups',
        type: 'maintenance',
        start: new Date(currentYear, currentMonth, startDay + 2, 10, 0),
        end: new Date(currentYear, currentMonth, startDay + 2, 14, 0),
        asset: {
            name: 'Maintenance Unit'
        },
        extraGroups: [
            {
                title: 'Technical Specs',
                color: 'amber',
                icon: '⚙️',
                fields: [
                    { label: 'Engine', value: 'V8 Turbo', size: 'large' },
                    { label: 'Last Service', value: '2 days ago' }
                ]
            }
        ]
    },
    {
        id: 'test-4',
        title: 'Test: Full Display Override',
        type: 'custom',
        color: '#8b5cf6', // Violet
        start: new Date(currentYear, currentMonth, startDay + 3, 10, 0),
        end: new Date(currentYear, currentMonth, startDay + 3, 15, 0),
        displayGroups: [
            {
                title: 'Custom Layout Block',
                color: '#8b5cf6',
                icon: '✨',
                fields: [
                    { value: 'This event ignores standard sections', size: 'large' },
                    { label: 'Feature', value: 'Custom UI Rendering' },
                    { label: 'Status', value: 'Verified', icon: '✅' }
                ]
            }
        ]
    },
    {
        id: 'test-5',
        title: 'Test: Multi-day Event',
        type: 'rental',
        start: new Date(currentYear, currentMonth, startDay + 4, 10, 0),
        end: new Date(currentYear, currentMonth, startDay + 6, 17, 0),
        notes: 'Testing how multi-day events span across the calendar views.'
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
