# The Block - Implementation Plan

## Context

OPENLANE coding challenge: build the **buyer side of a vehicle auction platform** as a web app. We have a dataset of 200 vehicles in `data/vehicles.json`. The goal is a working prototype demonstrating product thinking, craft, and technical quality — not a production system.

**Stack:** React + Vite + Tailwind CSS + TypeScript
**State:** React state + localStorage persistence (bids survive refresh)
**Scope:** Core requirements only — no stretch features initially

---

## Step 1: Project Scaffolding

Set up the foundation before building any features.

- Initialize Vite + React + TypeScript project
- Install and configure Tailwind CSS
- Copy `data/vehicles.json` into the app as a static import
- Set up project structure:
  ```
  src/
    components/     # Reusable UI components
    pages/          # Page-level components
    hooks/          # Custom hooks
    types/          # TypeScript interfaces
    data/           # Vehicle data import
    App.tsx
    main.tsx
  ```
- Set up React Router for navigation (inventory list ↔ vehicle detail)
- Verify dev server runs with a hello world

**Done when:** `npm run dev` serves a page with routing between `/` and `/vehicles/:id`

---

## Step 2: Vehicle Data Layer & Types

Define the data model and loading logic.

- Create `types/vehicle.ts` with a `Vehicle` interface matching the JSON schema
- Create a `hooks/useVehicles.ts` hook that loads and provides the vehicle data
- Create a `hooks/useBids.ts` hook that manages bid state:
  - Stores user bids in React state
  - Syncs to localStorage on change
  - Loads from localStorage on mount
  - Merges user bids with existing `current_bid`/`bid_count` from the dataset
- Define a `Bid` type: `{ vehicleId, amount, timestamp }`

**Done when:** Hooks return typed vehicle data and bid operations; bids persist across refresh

---

## Step 3: Inventory Browse & Search

Build the main listing page — the first thing a buyer sees.

- **Inventory grid/list:** Display vehicle cards showing:
  - Placeholder image
  - Year, make, model, trim
  - Odometer (km)
  - Current bid or starting bid
  - Bid count
  - Condition grade (visual indicator)
  - Location (city, province)
- **Search:** Text search across make, model, year, VIN, lot number
- **Responsive layout:** Grid on desktop (3-4 columns), stacks to 1-2 on mobile
- Each card links to `/vehicles/:id`

**Done when:** All 200 vehicles display, search filters in real-time, layout works on mobile and desktop

---

## Step 4: Vehicle Detail Page

The full vehicle inspection view for a buyer evaluating a purchase.

- **Image gallery:** Display placeholder images with navigation
- **Vehicle header:** Year make model trim, lot number, VIN
- **Specs section:** Engine, transmission, drivetrain, fuel type, odometer, body style, colors
- **Condition section:** Condition grade (visual), condition report text, damage notes list, title status
- **Auction info:** Starting bid, current bid, bid count, reserve price, buy now price (if available)
- **Seller info:** Selling dealership, location
- **Back to inventory** navigation
- Responsive: single column on mobile, multi-column layout on desktop

**Done when:** Clicking a vehicle card shows full details; all data fields are displayed clearly; responsive

---

## Step 5: Bidding Experience

The core interactive feature — placing bids on vehicles.

- **Bid form** on the vehicle detail page:
  - Shows current highest bid
  - Input for bid amount with validation:
    - Must be higher than current bid (or starting bid if no bids yet)
    - Must be a positive number
  - Submit button with confirmation
- **Bid feedback:**
  - Success state: update displayed current bid and bid count
  - Error state: show validation message
  - Visual indicator if bid meets/exceeds reserve price
  - Buy Now button if `buy_now_price` is set
- **Bid state reflects on inventory page:** updated bid amounts show on cards
- **localStorage persistence:** bids survive page refresh

**Done when:** User can place valid bids, see updated state, bids persist, validation prevents bad input

---

## Step 6: Polish & Responsiveness

Final pass to ensure craft and quality.

- Consistent spacing, typography, and color scheme
- Loading states and empty states
- Mobile-first responsive check on all pages
- Smooth transitions between pages
- Ensure all 200 vehicles render performantly (virtualization if needed, likely not for 200)
- Update the project README (based on SUBMISSION.md template) with:
  - Setup instructions
  - Tech decisions
  - Assumptions and scope

**Done when:** App looks intentional and polished; works well on mobile; README is complete

---

## Verification

After each step:
1. Run `npm run dev` and test in browser
2. Check mobile responsiveness via browser dev tools
3. Verify TypeScript compiles without errors (`npm run build`)

Final check:
- Clone fresh → `npm install` → `npm run dev` → full flow works
- Browse inventory → search → click vehicle → view details → place bid → see updated state → refresh → bid persists
