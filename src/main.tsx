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
    },
    {
        id: 'evt-7',
        title: 'Premium Rental: Custom Flex',
        type: 'rental',
        status: 'Priority',
        start: new Date(currentYear, currentMonth, startDay + 4, 10, 0),
        end: new Date(currentYear, currentMonth, startDay + 4, 15, 0),
        displayGroups: [
            {
                title: 'Business Client',
                icon: 'https://i.pravatar.cc/150?u=dynamic',
                color: 'indigo',
                fields: [
                    { value: 'Sarah Williams', size: 'large' },
                    { label: 'Organization', value: 'Global Logistics', size: 'small' },
                    { 
                        value: '+1 (555) 777-8888', 
                        size: 'small', 
                        icon: (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                        )
                    },
                    { 
                        value: 'sarah@global.com', 
                        size: 'small', 
                        icon: (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        )
                    }
                ]
            },
            {
                title: 'Vehicle Specs',
                icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                ),
                color: '#f59e0b', // Amber hex for custom feel
                fields: [
                    { value: 'Mercedes-Benz Sprinter', size: 'large' },
                    { label: 'VIN', value: 'WDB9066331S123456', size: 'small' },
                    { label: 'PLATE', value: 'LOGI-77', size: 'small' }
                ]
            }
        ]
    },
    {
        id: 'evt-8',
        title: 'Rental: Standard w/ Extra Fields',
        type: 'rental',
        status: 'Audit Required',
        start: new Date(currentYear, currentMonth, startDay + 5, 11, 0),
        end: new Date(currentYear, currentMonth, startDay + 5, 14, 0),
        customer: {
            name: 'Robert Fox',
            company: 'Fox Fleet Services',
            avatar: 'https://i.pravatar.cc/150?u=robert',
            extraFields: [
                { 
                    label: 'Driving License', 
                    value: 'DL-99201-B', 
                    icon: (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                        </svg>
                    )
                }
            ]
        },
        asset: {
            name: 'Heavy Duty Trailer',
            id: 'TRL-009',
            licensePlate: 'FX-99-LR',
            contract: 'C-9001-A',
            extraFields: [
                {
                    label: 'Last Inspection',
                    value: 'March 15, 2026',
                    icon: (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                }
            ]
        },
        details: {
            name: 'Internal Audit Ref #A90'
        }
    },
    {
        id: 'evt-9',
        title: 'Rental: International Delivery',
        type: 'rental',
        status: 'Customs Clear',
        start: new Date(currentYear, currentMonth, startDay + 6, 8, 0),
        end: new Date(currentYear, currentMonth, startDay + 6, 12, 0),
        customer: {
            name: 'Hans Müller',
            company: 'Berlin Logistics GmbH',
            contact: 'hans@berlin-log.de',
            avatar: 'https://i.pravatar.cc/150?u=hans'
        },
        asset: {
            name: 'Export Container X-10'
        },
        extraGroups: [
            {
                title: 'Regional Info',
                icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.104 7.531l1.503-.939A2.25 2.25 0 017 6.242a2.25 2.25 0 011.393.45l2.214 1.77a2.25 2.25 0 001.393.45H12" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.008v.008H12V12z" />
                    </svg>
                ),
                color: 'emerald',
                fields: [
                    { label: 'Country', value: 'Germany', icon: '🇩🇪' },
                    { label: 'Timezone', value: 'CET (UTC+1)' },
                    { label: 'Customs Ref', value: 'DE-99-BL-01', size: 'small' }
                ]
            }
        ]
    },
    {
        id: 'evt-10',
        title: 'Enterprise Rental: VIP Fleet',
        type: 'rental',
        status: 'Priority',
        start: new Date(currentYear, currentMonth, startDay + 5, 9, 0),
        end: new Date(currentYear, currentMonth, startDay + 6, 17, 0),
        customer: {
            name: 'Sarah Chen',
            company: 'Chen Global Holdings',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
            extraFields: [
                { 
                    label: 'VIP Status', 
                    value: 'Platinum Tier', 
                    icon: (
                        <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    ),
                    size: 'large'
                }
            ]
        },
        asset: {
            name: 'Executive Sprinter Limo',
            licensePlate: 'VIP-CHEN-1',
            contract: 'C-88229-B',
            extraFields: [
                {
                    label: 'Configuration',
                    value: '12-Seater / Luxury',
                    size: 'small'
                }
            ]
        },
        extraGroups: [
            {
                title: 'Rental Policy',
                color: '#4f46e5', // Direct Indigo Hex
                icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.040 12.02 12.02 0 00-3.138 2.31c-.961.96-1.54 2.27-1.54 3.706 0 1.436.579 2.748 1.54 3.706C2.26 16.666 3.733 18.064 5.382 19.056c1.649.99 3.42 1.542 5.236 1.84a12.02 12.02 0 002.764 0c1.816-.298 3.587-.85 5.236-1.84 1.649-.992 3.123-2.39 4.122-4.35a11.95 11.95 0 001.54-3.706 11.95 11.95 0 00-1.54-3.706 12.02 12.02 0 00-3.138-2.31z" />
                    </svg>
                ),
                fields: [
                    { label: 'Insurance', value: 'Full Comprehensive', size: 'large' },
                    { label: 'Fuel Policy', value: 'Full to Full (98 Octane)', size: 'small' },
                    { label: 'Mileage Limit', value: 'Unlimited', icon: '∞', size: 'small' }
                ]
            },
            {
                title: 'Technical Compliance',
                color: '#ec4899', // Rose Pink
                icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                    </svg>
                ),
                fields: [
                    { label: 'Tire Pressure', value: 'Front: 3.2 | Rear: 3.5 bar', size: 'small' },
                    { label: 'Telematics ID', value: 'T-800-CH-01', size: 'small' },
                    {
                        label: 'Verification Status',
                        value: 'Cloud Verified',
                        size: 'large',
                        icon: (
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        )
                    }
                ]
            }
        ]
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
