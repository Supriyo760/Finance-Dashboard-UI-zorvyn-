# Zorvyn Finance Dashboard

**Live Demo:** [https://finance-dashboard-zorvyn-three.vercel.app/](https://finance-dashboard-zorvyn-three.vercel.app/)

A clean, interactive, and fully responsive frontend dashboard built for managing and exploring financial transactions. 

## Overview of Approach

The goal of this project was to design a highly intuitive, premium interface focusing on user experience, modular components, and native CSS flexibility without relying on complex heavy CSS frameworks like Tailwind. 

I chose **React 18** with **Vite** as the build engine for speed, and managed the global state identically to standard Flux paradigms using `useReducer` and the **React Context API**.

The application fulfills all of the core criteria (Dashboard Overview, Transactions, Role-Based Access, and State Management) while taking advantage of numerous stretch goals such as Dark Mode, Local Storage persistence, simulated API environments, and CSV Exports.

## Features

*   **Financial Overview:** High-level summary computations (Total Balance, Income, Expenses) built on top of live mathematical reducers from the transactions payload.
*   **Data Visualizations:** 
    *   *Balance Trend*: A reactive mathematical area chart tracking exact chronological balance curves day-by-day.
    *   *Expenses by Category*: A dynamically populated donut chart breaking down exactly where money is being spent.
*   **Transactions Ledger:** Interactive table supporting real-time text-array searching, type filtering, CSV downloading, and bi-directional column sorting.
*   **Simulated RBAC (Roles):** Toggle between `Viewer` (read-only view) and `Admin` (grants permission to insert custom new mock transactions and delete records).
*   **Insights Engine:** Automatically computes your top spending category and your aggregate savings rate efficiency.
*   **Dark Mode & Theming:** Utilizes an architecture of native CSS design tokens (variables) that allow the entire interface to securely swap palettes into a deep-neon aesthetic utilizing `data-theme` DOM tags.
*   **Mock API & Loading Skeleton Delay:** Initial mounts trigger an 800ms Promise-like delay to replicate natural suspense states, showcasing responsive CSS keyframe pulsing animations before rendering the final graphs.

## Tech Stack
- **Framework:** React + TypeScript (Bootstrapped with Vite)
- **Styling:** Vanilla CSS (Built out via scoped Variables and custom Utility tokens)
- **Data Visualization:** `recharts`
- **Icons:** `lucide-react`
- **Utilities:** `date-fns` for chronological math

## Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Copy or clone the repository to your local machine.
2. Open your terminal in the root directory.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Your terminal will present a `localhost` URL (default is usually `http://localhost:5173/`). Open this in your browser to interact with the dashboard!

## Notes
- Data is securely persisted strictly to your browser's `localStorage`. If you desire to wipe the data or test the initial mock loading sequence, simply trigger a clear on your browser's Application/Local Storage cache, or manually delete elements using the `Admin` role options.
