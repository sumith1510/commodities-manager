** Commodities Manager (React + Vite + Tailwind) **

implemening the commodities management feature 

** Features **

Login:

Username/password login for two roles (Manager & Store Keeper).

Session persists in browser localStorage.

Dashboard:

Manager-only dashboard.

Displays KPIs: Total SKUs, Inventory Units, Average Price, and Low-stock Items.

View All Products:

Searchable and sortable table of products.

Accessible to both Manager and Store Keeper.

Add/Edit Product:

Manager can add new products or edit/delete existing ones.

Validation included for name, category, price, and stock.

Light/Dark Mode:

Toggle in header.

Choice saved in localStorage.

Role-based Menus:

Manager sees: Dashboard, Products, Add Product.

Store Keeper sees: Products only.

** Demo Credentials **

Manager: manager / manager123

Store Keeper: store / store123

** Tech Stack **

React 18

Vite

TailwindCSS

Data stored in localStorage (no backend required)

** Run Locally **

Clone the repository and install dependencies:

npm install
npm run dev


Open the printed http://localhost:5173/ in your browser.
** Build for Production **
npm run build
npm run preview
