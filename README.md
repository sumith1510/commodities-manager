# Commodities Manager (React + Vite + Tailwind)

This project implements the **commodities management** feature exactly as requested.

## Features Mapping

- **A) Login (5 pts):** username/password (demo users below). Persists session.
- **B) Dashboard (30 pts):** **Manager-only** dashboard with KPI cards: Total SKUs, Inventory Units, Average Price, Low‑stock items.
- **C) View all products (10 pts):** searchable, sortable table. Visible to **Manager & Store Keeper**.
- **D) Add/Edit Product (15 pts) [Optional]:** Manager can Add/Edit/Delete products via modal form with validation.
- **(2) Light/Dark mode (15 pts):** toggle in header; persisted in localStorage.
- **(3) Role-based access to menu (Bonus):** menu items filtered by role; Store Keeper cannot see Dashboard/Add.

## Demo Credentials

- Manager → `manager` / `manager123`
- Store Keeper → `store` / `store123`

## Tech

- React 18, Vite, TailwindCSS. Data stored in `localStorage` (no backend).

## Run Locally

```bash
npm install
npm run dev
```
Open the printed localhost URL.

## Build

```bash
npm run build
npm run preview
```

---

