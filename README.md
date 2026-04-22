# The Block - Vehicle Auction Platform

A buyer-side vehicle auction prototype built for the OPENLANE coding challenge. Browse inventory, inspect vehicle details, and place bids on 200 vehicles.

## Prerequisites

- **Node.js** v20.x or later
- **npm** v10.x or later

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Robromano1/the-block-robert-romano.git
cd the-block-robert-romano

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

## Available Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the Vite dev server with HMR       |
| `npm run build`    | Type-check and build for production      |
| `npm run preview`  | Preview the production build locally     |
| `npm run test`     | Run tests in watch mode                  |
| `npm run test:run` | Run tests once (CI-friendly)             |
| `npm run lint`     | Run ESLint                               |

## Stack

- **React 19** with TypeScript
- **Vite 6** for bundling and dev server
- **Tailwind CSS 4** for styling
- **React Router 7** for client-side routing
- **Vitest** + **React Testing Library** for tests

## Project Structure

```
src/
  components/   # UI components (VehicleCard, BidForm, BuyNowButton, AuctionBadge, ImageGallery, ConditionBadge, etc.)
  context/      # React Context providers (BidContext)
  hooks/        # Custom hooks (useVehicles, useVehicleFilters, useBids, useVehicle, useCountdown)
  lib/          # Utility modules (auction status/timers, currency formatting)
  pages/        # Route components (InventoryPage, VehicleDetailPage)
  types/        # TypeScript interfaces and types
  test/         # Test setup
  App.tsx       # Root component with routing
  main.tsx      # Application entry point
data/
  vehicles.json # Dataset of 200 vehicles
```

## Features

- **Inventory browsing** — responsive grid of vehicle cards with key details at a glance
- **Search** — real-time text search across make, model, year, VIN, and lot number
- **Filters** — dropdown filters for make, body style, and province; price range inputs
- **Sorting** — sort by lot number, price, or year
- **Vehicle details** — full specs, condition report, damage notes, seller info, and image gallery
- **Bidding** — place bids with $100 minimum increment, confirmation step, and validation
- **Buy Now** — one-click purchase with confirmation for vehicles that support it
- **Auction status** — live countdown timers; badges (upcoming/live/ended) on cards and detail pages
- **Persistence** — bids are stored in localStorage and survive page refresh
- **Consistent state** — bids placed on detail pages are immediately reflected on inventory cards
- **Responsive** — mobile-first design that works on all screen sizes

## Design Decisions

- **Frontend-only** — all data is loaded from a static JSON file; no backend required
- **localStorage for bids** — simple persistence that demonstrates state management without needing a server
- **React Context for shared bid state** — bids placed on the detail page are reflected across the app via `getEffectiveBid` / `getEffectiveBidCount`
- **Auction time normalization** — synthetic dates are shifted relative to "now" so the prototype shows a realistic mix of upcoming, live, and ended auctions
- **Conditional actions** — bid form and Buy Now only appear for live auctions; upcoming and ended auctions show appropriate status messages
- **Tailwind CSS** — utility-first styling for rapid, consistent UI development
- **Accessible forms** — all inputs have associated labels, touch-friendly sizing, and no iOS auto-zoom
