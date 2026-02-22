# Project Specification: Modern Infinite Calendar

## 1. Overview
We are building a **next-generation React Calendar library** to serve as a modern replacement for `react-big-calendar`.
The goal is to keep the familiar Month/Week/Day concepts but modernize the UX with **infinite scrolling**, **high-density event support**, and a **premium UI**.

**Package Name:** `react-fluid-calendar`
**Core Philosophy:** "Don't paginate, just scroll." + "Handle 50 events gracefully."

## 2. Technical Stack
- **Framework:** React + Vite (Library Mode)
- **Styling:** Tailwind CSS (internal, with prefix/scope to prevent conflicts) or CSS-in-JS (Emotion). *Recommendation: Tailwind for rapid modern UI dev.*
- **State/Logic:** `tanstack-virtual` (for infinite scrolling/virtualization) + `date-fns`.
- **Icons:** `lucide-react`.

## 3. Key Features to Build

### A. Infinite Scrolling (The "Wow" Factor)
- **Vertical Infinite Month:** instead of clicking "Next Month", the user scrolls down to see the next weeks continuously (like standard mobile calendars).
- **Horizontal Infinite Week/Day:** infinite panning across time.
- Implementation: Use virtualizer to render only the visible dates in the DOM.

### B. High-Density Event Handling (The "Better" Part)
Standard calendars fail when a day has 20+ events. We will implement:
1.  **Auto-Expanding Cells:** A setting to allow rows to grow if they have many events (instead of a fixed height "Show +10 more").
2.  **Clustered View:** If 10 events are identical (e.g., "Rental"), group them visually: *"10 Rentals (Click to expand)"*.
3.  **Prioritization:** Always show "Important" events first, collapse routine ones.

### C. View Modes & Settings
1.  **Period vs. Date Mode:**
    - *Period Mode:* Events render as continuous bars spanning multiple days (Gantt-style segments within the month grid).
    - *Date Mode:* Events render as individual points (dots/times) on specific days (Pick-up / Drop-off).
2.  **Layouts:**
    - **Month (Infinite)**
    - **Week (Time Grid)**
    - **Resource (Timeline)** - *Optional but highly requested.*

### D. Modern UI/UX
- **Glassmorphism & Blaque:** Use modern transparency, blur, and subtle borders.
- **Micro-interactions:** Smooth hover effects, drag-and-drop with "snap" animations.
- **Theming:** Full CSS variable support for colors/fonts.

## 4. Architecture for the Agent

1.  **Core Component (`<Calendar />`):**
    - Props: `events[]`, `view`, `onDateChange`, `renderEvent`.
    - Internal State: `visibleDateRange` (managed by scroll position).
2.  **Virtualizer Setup:**
    - Create a "Grid" where Rows = Weeks.
    - Dynamically load current/prev/next weeks as the user scrolls.
3.  **Event Layout Engine:**
    - Algorithm to sort and position events within a single day cell to minimize gaps and overlaps.
    - *Challenge:* In "Period Mode", an event spanning 3 days must look connected across the week row boundaries if using a Grid layout.

## 5. Mock Data Structure
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  // Custom fields
  type: 'rental' | 'maintenance'; 
}
```

---
*Pass this spec to the new agent. Emphasis on **TanStack Virtual** for the scrolling mechanism.*
