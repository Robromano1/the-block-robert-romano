# The Block - Vehicle Auction Platform

A buyer-side vehicle auction prototype built for the OPENLANE coding challenge. Browse inventory, inspect vehicle details, and place bids on 200 vehicles.

## Prerequisites

- **Node.js** v20.x or later
- **npm** v10.x or later

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/the-block-robert-romano.git
cd the-block-robert-romano

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

## Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR       |
| `npm run build`   | Type-check and build for production      |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint                               |

## Stack

- **React 19** with TypeScript
- **Vite 6** for bundling and dev server
- **Tailwind CSS 4** for styling
- **React Router 7** for client-side routing

## Project Structure

```
src/
  components/   # Reusable UI components
  pages/        # Page-level route components
  hooks/        # Custom React hooks
  types/        # TypeScript interfaces and types
  lib/          # Shared utilities and helpers
  App.tsx       # Root component with routing
  main.tsx      # Application entry point
data/
  vehicles.json # Dataset of 200 vehicles
```
