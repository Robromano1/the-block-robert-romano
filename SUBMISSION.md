# The Block - Vehicle Auction Platform

## How to Run

```bash
# Clone the repository
git clone https://github.com/Robromano1/the-block-robert-romano.git
cd the-block-robert-romano

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

Other available commands:

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run build`    | Type-check and build for production  |
| `npm run test`     | Run tests in watch mode              |
| `npm run test:run` | Run tests once (CI-friendly)         |
| `npm run lint`     | Run ESLint                           |

## Time Spent

Roughly 6-7 hours across two sessions. The first session focused on core functionality (browsing, search, filters, vehicle details, bidding). The second session focused on polish, bug fixes, auction status features, Buy Now, and test coverage. I used Claude Code as an AI assistant throughout — it handled boilerplate and repetitive tasks while I focused on product decisions, architecture, and code review.

## Assumptions and Scope

**Included:**
- Full browse/search/filter experience with real-time text search and multi-faceted filtering
- Vehicle detail pages with image gallery, specs, condition reports, and seller info
- Bidding with validation, confirmation step, and localStorage persistence
- Auction status system (upcoming/live/ended) with live countdown timers
- Buy Now flow for the 39 vehicles that support it
- Bid state reflected consistently across cards and detail pages
- Responsive design for desktop and mobile
- 137 unit/component tests across 9 test files

**Intentionally skipped:**
- Authentication and user accounts (per challenge assumptions)
- Backend/API — this is a frontend-only prototype reading from the static JSON dataset
- Seller workflows, checkout, and payments
- Real-time updates (WebSocket, polling) — bids are local-only

**Simplified:**
- Auction times are normalized relative to "now" so the static dataset produces a realistic mix of upcoming, live, and ended auctions
- Buy Now records a bid at the buy-now price rather than modeling a separate purchase entity
- Single bid per vehicle per user (latest bid overwrites)

## Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS 4, React Router 7
- **Build:** Vite 6
- **Testing:** Vitest, React Testing Library, happy-dom

No backend, database, or external services required.

## What I Built

A buyer-side vehicle auction prototype where users can browse 200 vehicles, search and filter the inventory, view detailed vehicle information, and participate in auctions through bidding or Buy Now.

The core experience follows a natural buyer flow: browse the inventory grid, narrow results with search/filters, click into a vehicle for full details, and take action (bid or buy). Auction status is surfaced throughout — cards show compact badges, detail pages show countdowns, and the available actions change based on whether an auction is upcoming, live, or ended.

**Key features:**
- Inventory grid with search, filters (make, body style, province, price range), and sorting
- Vehicle detail pages with image gallery, specifications, condition grades, damage notes, and seller info
- Bid form with $100 minimum increment validation, two-step confirmation, and success feedback
- Buy Now button with confirmation flow for vehicles that support it
- Auction status badges with live countdown timers (upcoming/live/ended)
- localStorage persistence — bids survive page refresh
- Bid state reflected on both detail pages and inventory cards

## Notable Decisions

**Auction time normalization.** The dataset has synthetic dates clustered around April 1-6, 2026. Rather than having all auctions appear as "upcoming" or "ended," I calculate a time offset from the midpoint of all auction starts to shift them relative to the current time. This creates a realistic distribution: some upcoming, some live with countdowns, and some ended — making the prototype feel like an active marketplace.

**Bid confirmation flow.** Placing a bid is a consequential action. I added a review/confirm step before recording the bid to prevent accidental submissions and build buyer trust. The same pattern carries through to Buy Now.

**Conditional UI based on auction state.** The bid form only appears for live auctions. Upcoming auctions show a "bidding has not started" message. Ended auctions show "this auction has ended." The Buy Now button only appears for live auctions that have a buy-now price. This prevents confusing interactions and makes the auction lifecycle clear.

**localStorage over a backend.** Given the frontend-only constraint, localStorage is the simplest way to persist bids across page navigations and refreshes. The BidContext layer abstracts the storage mechanism, so swapping in an API would be straightforward.

**Effective bid merging.** Cards and detail pages both call `getEffectiveBid` / `getEffectiveBidCount` from BidContext to merge user bids with the dataset's existing bid data. This ensures the UI is consistent everywhere — a bid placed on the detail page immediately reflects on the inventory card.

## Testing

**137 tests across 9 test files**, all passing:

| Test file | Tests | What it covers |
| --- | --- | --- |
| `useBids.test.ts` | 17 | Bid validation, minimum increment, localStorage persistence, effective bid/count merging |
| `useVehicleFilters.test.ts` | 18 | Search, filter combinations, sorting, price range, filter reset |
| `BidForm.test.tsx` | 12 | Form rendering, validation errors, confirmation flow, cancel, success state, pre-filled input, comma-formatted input |
| `BuyNowButton.test.tsx` | 6 | Button rendering, confirmation flow, cancel, success state, callback invocation |
| `AuctionBadge.test.tsx` | 7 | Compact/full variants, status labels, countdown display for upcoming/live, no countdown for ended |
| `auction.test.ts` | 20 | Time normalization, auction status at boundaries, time remaining decomposition, format output |
| `VehicleCard.test.tsx` | 12 | Card rendering, bid display, condition badge, links, image alt text |
| `InventoryPage.test.tsx` | 9 | Page rendering, vehicle count, search filtering, empty state, filter reset |
| `VehicleDetailPage.test.tsx` | 36 | Full detail page rendering, bid placement, specs, condition, seller info |

Tests use `vi.useFakeTimers()` for auction time logic, mock `localStorage` for bid persistence, and `vi.mock` for the vehicle data module to isolate auction calculations from the real dataset.

Additionally, I used Playwright MCP for manual browser testing throughout development — verifying the UI visually, testing all interactive flows end-to-end, and catching a bid form UX bug (empty input field despite showing a placeholder) that unit tests alone wouldn't have surfaced.

## What I'd Do With More Time

- **My Bids page** — a dedicated view showing all vehicles the user has bid on, with bid status (winning/outbid) and quick navigation back to the detail page
- **Sort by auction ending soonest** — surface the most urgent auctions to drive engagement
- **Keyboard navigation** — arrow keys for image gallery, Escape to close confirmation dialogs
- **Skeleton loading states** — placeholder UI while data loads instead of blank screens
- **URL-persisted filters** — encode search/filter state in query params so filtered views are shareable and survive refresh
- **Accessibility audit** — full screen reader testing, ARIA live regions for countdown updates and bid confirmations
- **E2E test suite** — formalize the Playwright testing into a CI-runnable suite covering the critical buyer flows
- **Backend API** — replace localStorage with a real persistence layer, enable multi-user bidding with optimistic updates and conflict resolution
