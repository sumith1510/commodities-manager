Commodities Manager (React + Vite + Tailwind)

This project implements the commodities management feature as per the given assignment requirements.

✨ Features & Points Mapping

A) Login (5 pts):

Username/password login for two roles (Manager & Store Keeper).

Session persists in browser localStorage.

B) Dashboard (30 pts):

Manager-only dashboard.

Displays KPIs:

Total SKUs

Total Inventory (units)

Average Price

Low-stock Items (< 20 units)

C) View All Products (10 pts):

Searchable and sortable table of products.

Accessible to both Manager and Store Keeper.

D) Add/Edit Product (15 pts, optional):

Manager can add new products or edit/delete existing ones.

Validation included for name, category, price, and stock.

Light/Dark Mode (15 pts):

Toggle in header.

Choice saved in localStorage.

Role-based Menus (Bonus 25 pts):

Manager sees: Dashboard, Products, Add Product.

Store Keeper sees: Products only.

🔑 Demo Credentials

Manager → manager / manager123

Store Keeper → store / store123

🛠️ Tech Stack

React 18

Vite

TailwindCSS

Data stored in localStorage (no backend required).

🚀 Run Locally

Clone the repository and install dependencies:

npm install
npm run dev


Open the printed http://localhost:5173/ in your browser.

📦 Build for Production
npm run build
npm run preview
