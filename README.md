# React Fluid Calendar

A modern, infinite-scrolling calendar for React.

## Features
- **Infinite Scrolling**: Powered by `tanstack-virtual`.
- **High Performance**: Renders only visible elements.
- **Tailwind CSS**: Built with modern utility classes.
- **Customizable**: Flexible styling and event rendering.

## Installation

```bash
npm install react-fluid-calendar

# Peer Dependencies
This library requires React 19+.
```bash
npm install react@^19.0.0 react-dom@^19.0.0
``` date-fns react react-dom
```

## Usage

```tsx
import { Calendar } from 'react-fluid-calendar';
import 'react-fluid-calendar/dist/style.css'; // If styles are extracted

function App() {
  const events = [
    {
      id: '1',
      title: 'Meeting',
      start: new Date(),
      end: new Date(),
    }
  ];

  return (
    <div style={{ height: '800px' }}>
      <Calendar events={events} />
    </div>
  );
}
```

## License
MIT
