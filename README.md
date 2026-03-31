# React Fluid Calendar

![Calendar Demo](https://raw.githubusercontent.com/jpetliuk/react-fluid-calendar/main/assets/demo_video.gif)

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

## Advanced Event Detail UI

The `react-fluid-calendar` now features a highly flexible dynamic rendering system for event details. You can choose to extend our built-in categories or completely redefine the modal's layout.

### Option 1: Extend Built-in Categories with `extraFields`
Add custom fields (like "Driving License" or "VIN") to predefined sections.

```tsx
const event: CalendarEvent = {
  customer: {
    name: 'Robert Fox',
    extraFields: [
      { label: 'Driving License', value: 'DL-99201-B', icon: <LicenseIcon /> }
    ]
  },
  asset: {
    name: 'Heavy Duty Trailer',
    extraFields: [
       { label: 'Last Inspection', value: 'March 15, 2026' }
    ]
  }
};
```

### Option 2: Add Custom Categories with `extraGroups`
Add entirely new sections alongside the standard categories.

```tsx
const event: CalendarEvent = {
  extraGroups: [
    {
      title: 'Regional Info',
      color: 'emerald',
      fields: [
        { label: 'Country', value: 'Germany', icon: '🇩🇪' },
        { label: 'Timezone', value: 'CET (UTC+1)' }
      ]
    }
  ]
};
```

### Option 3: Completely Custom Layout with `displayGroups`
If `displayGroups` is provided, the modal layout is completely replaced with your custom-ordered sections, supporting custom colors and icons.

```tsx
const event: CalendarEvent = {
  displayGroups: [
    {
      title: 'Business Client',
      color: 'indigo', // indigo, blue, amber, rose, emerald, zinc, or hex #XXXXXX
      icon: 'https://avatar-url.com/sarah.png',
      fields: [
        { value: 'Sarah Williams', size: 'large' },
        { label: 'Organization', value: 'Global Logistics' },
        { value: '+1 (555) 777-8888', icon: <PhoneIcon /> }
      ]
    }
  ]
};
```

### High-Density Enterprise Example
You can mix text sizes, direct Hex codes, and even animated React components as icons to create professional interfaces:

```tsx
const event: CalendarEvent = {
  title: 'Enterprise Rental: VIP Fleet',
  extraGroups: [
    {
      title: 'Rental Policy',
      color: '#4f46e5', // Direct Hex support
      icon: <PolicyIcon />,
      fields: [
        { label: 'Insurance', value: 'Full Comprehensive', size: 'large' },
        { label: 'Mileage Limit', value: 'Unlimited', icon: '∞', size: 'small' }
      ]
    },
    {
      title: 'Technical Compliance',
      color: '#ec4899',
      icon: <ShieldIcon />,
      fields: [
        { label: 'Telematics ID', value: 'T-800-CH-01', size: 'small' },
        {
          label: 'Verification Status',
          value: 'Cloud Verified',
          size: 'large',
          icon: <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        }
      ]
    }
  ]
}
```

---

## Technical Details

The `CalendarEvent` type is highly extensible:

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
        phone?: string;   // Phone number
        avatar?: string;  // Image URL for profile logo/icon
        extraFields?: DisplayField[]; // Add custom labels here
    };
    asset?: {
        name: string;
        licensePlate?: string;
        contract?: string;
        id?: string;
        extraFields?: DisplayField[]; // Add custom labels here
    };
    details?: {
       name: string;
       extraFields?: DisplayField[]; // Add custom labels here
    };

    displayGroups?: DisplayGroup[]; // Replace whole UI with custom groups
}

export interface DisplayField {
    label?: string;
    value: React.ReactNode;
    icon?: React.ReactNode; 
    size?: 'small' | 'large'; 
}

export interface DisplayGroup {
    title?: string;
    icon?: React.ReactNode;
    fields: DisplayField[];
    color?: string; // blue, indigo, amber, rose, emerald, zinc, or hex #XXXXXX
}
```


## Features

- **Blazing Fast**: Designed with internal dictionary lookups, keeping renders O(N) instead of O(N * 35). Handles tens of thousands of calendar elements without locking up the UI.
- **Dynamic Animations**: Includes beautifully crafted cylinder rolling date transitions when navigating left/right.
- **Smart Stacking**: Event chips automatically expand intelligently, and clusters flip directions when near the bottom of the screen to remain visible.
- **Built-in Modals**: Includes out-of-the-box modals for clicking on entire days, or clicking on specific events to view extended customer, location, and metadata details.

## License
MIT
