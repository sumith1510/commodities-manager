import React, { useEffect, useMemo, useState } from "react";

/**
 * Commodities Manager – Single File React App
 * Features implemented per instructions:
 * A) Login (5 pts)
 * B) Dashboard (30 pts) – visible only to Manager
 * C) View all products (10 pts)
 * D) Add/Edit Product (15 pts) [Optional] – enabled for Manager only
 * 2) Light/Dark mode toggle (15 pts)
 * 3) Role‑based access to menu options (Bonus: 25 pts)
 *
 * Demo credentials:
 *   Manager → username: manager  | password: manager123 | role: Manager
 *   Store Keeper → username: store | password: store123   | role: Store Keeper
 * Data persisted in localStorage (products + current user + theme).
 */

const LS_KEYS = {
  products: "cm_products_v1",
  user: "cm_user_v1",
  theme: "cm_theme_v1",
};

const DEFAULT_PRODUCTS = [
  { id: crypto.randomUUID(), name: "Wheat", category: "Grain", price: 22.5, stock: 120, unit: "kg" },
  { id: crypto.randomUUID(), name: "Rice", category: "Grain", price: 28.9, stock: 90, unit: "kg" },
  { id: crypto.randomUUID(), name: "Coffee Beans", category: "Beverage", price: 180.0, stock: 35, unit: "kg" },
  { id: crypto.randomUUID(), name: "Palm Oil", category: "Oil", price: 96.0, stock: 70, unit: "L" },
];

const USERS = [
  { username: "manager", password: "manager123", role: "Manager", name: "A. Manager" },
  { username: "store", password: "store123", role: "Store Keeper", name: "S. Keeper" },
];

function classNames(...arr) {
  return arr.filter(Boolean).join(" ");
}

// ---- Theme hook ----
function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(LS_KEYS.theme) || "light");
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(LS_KEYS.theme, theme);
  }, [theme]);
  return { theme, setTheme };
}

// ---- Auth hook ----
function useAuth() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(LS_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  });

  function login(username, password) {
    const match = USERS.find(u => u.username === username && u.password === password);
    if (!match) throw new Error("Invalid username or password");
    const clean = { username: match.username, role: match.role, name: match.name };
    localStorage.setItem(LS_KEYS.user, JSON.stringify(clean));
    setUser(clean);
  }

  function logout() {
    localStorage.removeItem(LS_KEYS.user);
    setUser(null);
  }

  return { user, login, logout };
}

// ---- Products hook ----
function useProducts() {
  const [products, setProducts] = useState(() => {
    const raw = localStorage.getItem(LS_KEYS.products);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LS_KEYS.products, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem(LS_KEYS.products, JSON.stringify(products));
  }, [products]);

  function addProduct(p) {
    setProducts(prev => [{ ...p, id: crypto.randomUUID() }, ...prev]);
  }
  function updateProduct(id, updates) {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  }
  function deleteProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  return { products, addProduct, updateProduct, deleteProduct };
}

// ---- UI Components ----
function Shell({ children, user, onLogout, theme, setTheme }) {
  const items = [
    { key: "dashboard", label: "Dashboard", roles: ["Manager"] },
    { key: "products", label: "Products", roles: ["Manager", "Store Keeper"] },
    { key: "add", label: "Add Product", roles: ["Manager"] },
  ];
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    if (user?.role === "Store Keeper") setActive("products");
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors">
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <div>
              <h1 className="text-lg font-semibold">Commodities Manager</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Role: {user.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 grid md:grid-cols-5 gap-6">
        <aside className="md:col-span-1">
          <nav className="space-y-1">
            {items
              .filter(i => i.roles.includes(user.role))
              .map(i => (
                <button
                  key={i.key}
                  className={
                    "w-full text-left px-3 py-2 rounded-xl border text-sm " +
                    (active === i.key
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent"
                      : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800")
                  }
                  onClick={() => setActive(i.key)}
                >
                  {i.label}
                </button>
              ))}
          </nav>
        </aside>
        <main className="md:col-span-4">{children(active)}</main>
      </div>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500">
        Built for the take‑home challenge • Light/Dark • Role‑based menus
      </footer>
    </div>
  );
}

function MetricCard({ title, value, caption }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
      <div className="text-sm text-zinc-500 dark:text-zinc-400">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {caption && <div className="text-xs mt-1 text-zinc-500">{caption}</div>}
    </div>
  );
}

function Dashboard({ products }) {
  const totalSKUs = products.length;
  const inventory = useMemo(() => products.reduce((sum, p) => sum + Number(p.stock || 0), 0), [products]);
  const avgPrice = useMemo(() => (products.length ? (products.reduce((s, p) => s + Number(p.price || 0), 0) / products.length) : 0).toFixed(2), [products]);
  const lowStock = useMemo(() => products.filter(p => Number(p.stock) < 20).length, [products]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total SKUs" value={totalSKUs} />
        <MetricCard title="Inventory (units)" value={inventory} />
        <MetricCard title="Average Price" value={`$${avgPrice}`} />
        <MetricCard title="Low‑stock Items" value={lowStock} caption="(< 20 in stock)" />
      </div>
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
        <h3 className="font-medium mb-2">Insights</h3>
        <ul className="list-disc ml-5 text-sm space-y-1 text-zinc-700 dark:text-zinc-300">
          <li>Track low‑stock items and restock proactively to avoid stock‑outs.</li>
          <li>Use the Add/Edit screen to keep pricing and inventory up to date.</li>
          <li>Switch to Dark mode from the header to reduce eye strain.</li>
        </ul>
      </div>
    </div>
  );
}

function ProductsTable({ products, onEdit, canEdit, onDelete }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState({ key: "name", dir: "asc" });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const data = s
      ? products.filter(p =>
          [p.name, p.category, p.unit].some(v => String(v).toLowerCase().includes(s))
        )
      : products;
    const sorted = [...data].sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [products, q, sort]);

  function toggleSort(key) {
    setSort(prev => ({ key, dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc" }));
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="p-4 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <input
          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
          placeholder="Search by name, category or unit…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-900/60">
            <tr className="text-left">
              {[
                ["name", "Product"],
                ["category", "Category"],
                ["price", "Price"],
                ["stock", "Stock"],
                ["unit", "Unit"],
              ].map(([key, label]) => (
                <th key={key} className="px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort(key)}>
                  <div className="inline-flex items-center gap-1">
                    {label}
                    {sort.key === key && <span>{sort.dir === "asc" ? "▲" : "▼"}</span>}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">${Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">{p.unit}</td>
                <td className="px-4 py-3 text-right">
                  {canEdit && (
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-zinc-500" colSpan={6}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial || { name: "", category: "", price: "", stock: "", unit: "kg" }
  );
  const [err, setErr] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "name" ? value : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.category) return setErr("Name and category are required");
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (Number.isNaN(price) || price < 0) return setErr("Price must be a non‑negative number");
    if (!Number.isInteger(stock) || stock < 0) return setErr("Stock must be a non‑negative integer");
    onSubmit({ ...form, price, stock });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {err && (
        <div className="rounded-xl bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-4 py-2 text-sm">
          {err}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
            placeholder="e.g., Maize"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
            placeholder="e.g., Grain"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Price</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
            placeholder="e.g., 25.50"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Stock</label>
          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
            placeholder="e.g., 100"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Unit</label>
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
          >
            <option value="kg">kg</option>
            <option value="L">L</option>
            <option value="ton">ton</option>
            <option value="bag">bag</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="submit" className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
          Save
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    try {
      onLogin(username, password);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-3xl">🌾</span>
          <h1 className="text-xl font-semibold">Commodities Manager</h1>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Sign in as <span className="font-medium">Manager</span> or <span className="font-medium">Store Keeper</span>.
        </p>
        {err && (
          <div className="rounded-xl bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-4 py-2 text-sm mb-3">
            {err}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="manager or store"
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="manager123 or store123"
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="w-full rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 py-2">
            Sign in
          </button>
        </form>
        <div className="mt-4 text-xs text-zinc-500">
          Demo • manager/manager123 • store/store123
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { theme, setTheme } = useTheme();
  const { user, login, logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [editing, setEditing] = useState(null);

  if (!user) return <Login onLogin={login} />;

  return (
    <Shell user={user} onLogout={logout} theme={theme} setTheme={setTheme}>
      {(active) => {
        if (active === "dashboard" && user.role !== "Manager") {
          return (
            <div className="rounded-2xl border border-yellow-300 bg-yellow-50 text-yellow-900 dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-200 p-5">
              Only managers can view the dashboard.
            </div>
          );
        }

        if (active === "dashboard") {
          return <Dashboard products={products} />;
        }

        if (active === "add") {
          return (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Add new product</h2>
              <ProductForm
                onSubmit={(p) => {
                  addProduct(p);
                }}
                onCancel={() => window.history.back()}
              />
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Products</h2>
              {user.role === "Manager" && (
                <button
                  onClick={() => setEditing({})}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  + New
                </button>
              )}
            </div>

            <ProductsTable
              products={products}
              canEdit={user.role === "Manager"}
              onEdit={(p) => setEditing(p)}
              onDelete={deleteProduct}
            />

            {editing !== null && (
              <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
                <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{editing.id ? "Edit product" : "Add product"}</h3>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700"
                    >
                      Close
                    </button>
                  </div>
                  <ProductForm
                    initial={editing.id ? editing : undefined}
                    onSubmit={(p) => {
                      if (editing.id) updateProduct(editing.id, p);
                      else addProduct(p);
                      setEditing(null);
                    }}
                    onCancel={() => setEditing(null)}
                  />
                </div>
              </div>
            )}
          </div>
        );
      }}
    </Shell>
  );
}
