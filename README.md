# React Fluid Calendar

<video src="./assets/demo_video.mov" width="100%" autoplay loop muted></video>

A fluid, modern, and highly-customizable React calendar component designed for flexibility and scale. Features animated transitions, week & month views, custom event rendering, and more.

## Installation

```bash
npm install react-fluid-calendar
```

Note: This component expects TailwindCSS to be configured in your project for styling. Ensure `react-fluid-calendar` is added to your content paths if necessary.

## Quick Start

```tsx
import React, { useState } from 'react';
import { FluidCalendar, CalendarEvent } from 'react-fluid-calendar';
import 'react-fluid-calendar/dist/style.css'; 

export default function App() {
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Quarterly Review',
      start: new Date(2026, 1, 15, 10, 0),
      end: new Date(2026, 1, 15, 11, 30),
      color: '#4f46e5' // Customize your event colors easily!
    }
  ]);

  return (
    <div style={{ height: '800px', padding: '20px' }}>
      <FluidCalendar 
        events={events} 
        view="month" 
        monthlyCalendar={{ dayHeight: 120 }}
        weeklyCalendar={{ startHour: 6, endHour: 22 }}
      />
    </div>
  );
}
```

## Customizing Events

The `CalendarEvent` type accepts additional optional properties, making it great for specialized scheduling architectures like rental businesses or fleet management. 

Custom `color` properties will be applied automatically to the event cards.

```tsx
export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string; // Automatically styles the backgrounds/borders
    type?: 'rental' | 'maintenance' | string;
    status?: string; // Now displays as a badge in the event modal
    
    // Optional Extended fields ready out-of-the-box
    customer?: {
        name: string;
        company?: string;
        contact?: string; // Email address
        phone?: string;   // Phone number now displays with icon
        avatar?: string;  // Image URL for profile logo/icon
    };
    asset?: {
        name: string;
        licensePlate?: string;
        id?: string;
        contract?: string; // Displays as a reference in the modal
    };
    details?: {
        name: string; // Displays as a main Reference Detail section
    };
    location?: string;
    notes?: string;
    orderLink?: string; // Displays as a "View Full Order" button

    [key: string]: any; // Store any additional metadata you want!
}
```

The event detail modal has been updated with a cleaner, premium integrated layout that highlights Customer Profiles, Assigned Units, and Order References with consistent icons and typography.


## Features

- **Blazing Fast**: Designed with internal dictionary lookups, keeping renders O(N) instead of O(N * 35). Handles tens of thousands of calendar elements without locking up the UI.
- **Dynamic Animations**: Includes beautifully crafted cylinder rolling date transitions when navigating left/right.
- **Smart Stacking**: Event chips automatically expand intelligently, and clusters flip directions when near the bottom of the screen to remain visible.
- **Built-in Modals**: Includes out-of-the-box modals for clicking on entire days, or clicking on specific events to view extended customer, location, and metadata details.

## License
MIT
