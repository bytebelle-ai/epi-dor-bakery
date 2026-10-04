import { supabase } from "./supabase";
import { FormEvent, useEffect, useState } from "react";

type Navigate = (path: string) => void;

const menu = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/orders", "Orders"],
  ["/admin/products", "Products"],
  ["/admin/categories", "Categories"],
  ["/admin/customers", "Customers"],
  ["/admin/settings", "Settings"],
];

const adminProducts = [
  ["Classic Chocolate Brownie", "Brownies", "₹129", "Available"],
  ["Classic Cheesecake", "Cheesecakes", "₹799 – ₹1599", "Available"],
  ["Pistachio White Cookie", "Cookies", "₹799", "Available"],
  ["Chocolate Tub Cake", "Tub Cakes", "₹749", "Available"],
  ["Classic Chocolate Cake", "Celebration Cakes", "₹799 – ₹1599", "Available"],
];

function AdminMark() {
  return <div className="admin-mark"><strong>Épi d’Or</strong><span>ADMINISTRATION</span></div>;
}

export function AdminLogin({ navigate, forgot = false }: { navigate: Navigate; forgot?: boolean }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (forgot) { setSent(true); return; }
    const form = event.currentTarget;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;
    const password = (form.querySelector('input[type="password"]') as HTMLInputElement).value;
    setBusy(true);
    setError("");
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError || !data.user) { setBusy(false); setError("Invalid email or password."); return; }
    const { data: adminRow } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
    if (!adminRow) { await supabase.auth.signOut(); setBusy(false); setError("This account is not an admin."); return; }
    setBusy(false);
    navigate("/admin/dashboard");
  };
  return <main className="admin-auth">
    <section className="admin-auth-brand"><AdminMark /><div><p className="eyebrow light">BAKERY MANAGEMENT</p><h1>Crafted with care.<br /><em>Managed with clarity.</em></h1></div><small>Frontend administration preview</small></section>
    <section className="admin-auth-form"><div>
      <p className="eyebrow">{forgot ? "RECOVERY" : "SECURE AREA"}</p><h2>{forgot ? "Reset Admin Password" : "Épi d’Or Admin"}</h2><p>{forgot ? "Enter the authorized admin email to prepare a reset link." : "Sign in to manage your bakery."}</p>
      <div className="prototype-note">Frontend preview only — no admin credentials are submitted or stored.</div>
      {sent ? <div className="recovery-success"><div className="success-seal">✓</div><h3>Reset State Ready</h3><p>No email was sent. This screen is ready for backend integration.</p><button className="btn" onClick={() => navigate("/admin/login")}>Return to Login</button></div> :
      <form onSubmit={submit}><label className="field">Email<input required type="email" autoComplete="email" /></label>{!forgot && <label className="field">Password<input required type="password" autoComplete="current-password" /></label>}{error && <p role="alert" style={{ color: "#b3261e", margin: "0 0 12px" }}>{error}</p>}<button className="btn" type="submit" disabled={busy}>{forgot ? "Send Reset Link" : busy ? "Signing in..." : "Login to Dashboard"}</button></form>}
      {!forgot && <button className="admin-forgot" onClick={() => navigate("/admin/forgot-password")}>Forgot Password?</button>}
    </div></section>
  </main>;
}

function AdminShell({ path, navigate, logout, children }: { path: string; navigate: Navigate; logout: () => void; children: React.ReactNode }) {
  const [confirmSwitch, setConfirmSwitch] = useState(false);
  return <main className="admin-app">
    <aside className="admin-sidebar"><AdminMark /><nav>{menu.map(([href, label]) => <button className={path.startsWith(href) ? "active" : ""} key={href} onClick={() => navigate(href)}><i />{label}</button>)}</nav><div className="admin-side-foot"><span>UI PREVIEW MODE</span><button onClick={() => setConfirmSwitch(true)}>Switch / Change Access</button><button onClick={logout}>Logout</button></div></aside>
    <section className="admin-workspace"><header><div><span className="admin-mobile-logo">Épi d’Or Admin</span></div><div className="admin-tools"><button aria-label="Notifications">○</button><span><i>EA</i><small>Admin Preview<b>Administrator</b></small></span><button onClick={() => setConfirmSwitch(true)}>Switch Access</button><button onClick={logout}>Logout</button></div></header>{children}</section>
    {confirmSwitch && <div className="admin-switch-layer" role="dialog" aria-modal="true" aria-labelledby="admin-switch-title"><button aria-label="Cancel" className="admin-switch-scrim" onClick={() => setConfirmSwitch(false)} /><section><p className="eyebrow">LEAVE ADMIN AREA</p><h2 id="admin-switch-title">Change access?</h2><p>Leaving the admin dashboard should end or revalidate the admin session when secure authentication is connected.</p><div><button className="admin-secondary" onClick={() => setConfirmSwitch(false)}>Stay Here</button><button className="admin-primary" onClick={() => navigate("/select-role")}>Continue</button></div></section></div>}
  </main>;
}

function PageHead({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: React.ReactNode }) {
  return <div className="admin-page-head"><div><p>{eyebrow}</p><h1>{title}</h1><span>{copy}</span></div>{action}</div>;
}

export function AdminApp({ path, navigate, logout }: { path: string; navigate: Navigate; logout: () => void }) {
  let screen: React.ReactNode;
  if (path.includes("/orders/")) screen = <AdminOrderDetail navigate={navigate} />;
  else if (path === "/admin/orders") screen = <AdminOrders navigate={navigate} />;
  else if (path === "/admin/products/add") screen = <ProductForm navigate={navigate} />;
  else if (path.includes("/admin/products/edit")) screen = <ProductForm navigate={navigate} edit />;
  else if (path === "/admin/products") screen = <AdminProducts navigate={navigate} />;
  else if (path === "/admin/categories") screen = <AdminCategories />;
  else if (path === "/admin/customers") screen = <AdminCustomers />;
  else if (path === "/admin/settings") screen = <AdminSettings />;
  else screen = <AdminDashboard navigate={navigate} />;
  return <AdminShell path={path} navigate={navigate} logout={logout}>{screen}</AdminShell>;
}

function AdminDashboard({ navigate }: { navigate: Navigate }) {
  const stats = [["Today’s Orders", "—"], ["Pending Orders", "—"], ["Total Orders", "—"], ["Revenue", "—"], ["Products", "36"], ["Unavailable Products", "—"]];
  return <div className="admin-page"><PageHead eyebrow="OVERVIEW" title="Good morning, Admin" copy="Here’s what is happening at Épi d’Or today." /><div className="admin-notice">Live order and revenue data will appear after the backend is connected.</div><div className="stat-grid">{stats.map(([label, value], i) => <article key={label}><span>0{i + 1}</span><strong>{value}</strong><p>{label}</p></article>)}</div><div className="admin-split"><section className="admin-table-card"><div className="table-title"><h2>Recent orders</h2><button onClick={() => navigate("/admin/orders")}>View all</button></div><EmptyAdmin text="No live orders connected" /></section><section className="quick-actions"><h2>Quick actions</h2><button onClick={() => navigate("/admin/products/add")}>Add a product <b>+</b></button><button onClick={() => navigate("/admin/orders")}>Review orders <b>→</b></button><button onClick={() => navigate("/admin/settings")}>Bakery settings <b>→</b></button></section></div></div>;
}

function AdminOrders({ navigate }: { navigate: Navigate }) {
  return <div className="admin-page"><PageHead eyebrow="ORDER MANAGEMENT" title="Orders" copy="Review fulfilment and update order progress." /><div className="admin-filters"><input placeholder="Search order or customer" /><select><option>All statuses</option><option>New</option><option>Confirmed</option><option>Preparing</option><option>Ready</option><option>Completed</option><option>Cancelled</option></select></div><div className="admin-table-card"><table><thead><tr><th>Order</th><th>Customer</th><th>Products</th><th>Total</th><th>Status</th><th /></tr></thead><tbody><tr><td>Preview 001</td><td>Sample customer</td><td>Classic Chocolate Cake</td><td>₹799</td><td><span className="table-status">Preparing</span></td><td><button onClick={() => navigate("/admin/orders/1")}>View →</button></td></tr></tbody></table></div></div>;
}

function AdminOrderDetail({ navigate }: { navigate: Navigate }) {
  return <div className="admin-page"><button className="admin-back" onClick={() => navigate("/admin/orders")}>← Back to orders</button><PageHead eyebrow="ORDER PREVIEW" title="Preview 001" copy="Sample order detail for interface review." action={<select className="status-select" defaultValue="Preparing"><option>New</option><option>Confirmed</option><option>Preparing</option><option>Ready</option><option>Completed</option><option>Cancelled</option></select>} /><div className="admin-detail-grid"><section className="admin-table-card"><h2>Products</h2><div className="admin-line-item"><div className="sample-thumb" /><span><strong>Classic Chocolate Cake</strong><small>500 g · Quantity 1</small></span><b>₹799</b></div><div className="admin-total"><span>Total</span><strong>₹799</strong></div></section><aside className="admin-info-card"><h2>Customer</h2><p>Sample customer</p><p>Contact details pending connection</p><h2>Fulfilment</h2><p>Pickup or delivery details</p><h2>Customization</h2><p>No customization shown in this sample.</p></aside></div></div>;
}

function AdminProducts({ navigate }: { navigate: Navigate }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");

  useEffect(() => {
    supabase
      .from("products")
      .select("id,name,category,variants,active,sort_order")
      .order("sort_order")
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setRows(data ?? []);
        setLoading(false);
      });
  }, []);

  const price = (variants: { price: number }[]) => {
    const n = (variants ?? []).map((v) => v.price);
    if (n.length === 0) return "-";
    const lo = Math.min(...n);
    const hi = Math.max(...n);
    return lo === hi ? `\u20B9${lo}` : `\u20B9${lo} \u2013 \u20B9${hi}`;
  };

  const shown = rows.filter(
    (p) =>
      (category === "All categories" || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase()),
  );

  return <div className="admin-page"><PageHead eyebrow="CATALOGUE" title="Products" copy="Manage menu items, pricing and availability." action={<button className="admin-primary" onClick={() => navigate("/admin/products/add")}>+ Add Product</button>} />
    <div className="admin-filters">
      <input placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>All categories</option>
        {["Brownies", "Cheesecakes", "Cookies", "Tub Cakes", "Celebration Cakes", "Sugar-Free Goodies", "Breads", "Savour Jars"].map((x) => <option key={x}>{x}</option>)}
      </select>
    </div>
    {error && <p role="alert" style={{ color: "#b3261e" }}>Could not load products: {error}</p>}
    {loading ? <p>Loading products...</p> :
    <div className="admin-table-card"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Availability</th><th /></tr></thead><tbody>
      {shown.map((p) => <tr key={p.id}><td><strong>{p.name}</strong></td><td>{p.category}</td><td>{price(p.variants)}</td><td><span className="available">{p.active ? "Available" : "Hidden"}</span></td><td><button onClick={() => navigate(`/admin/products/edit/${p.id}`)}>Edit</button></td></tr>)}
    </tbody></table></div>}
  </div>;
}
type VariantRow = { label: string; price: string };

function ProductForm({ navigate, edit = false }: { navigate: Navigate; edit?: boolean }) {
  const editId = edit ? decodeURIComponent(window.location.pathname.split("/").filter(Boolean).pop() ?? "") : "";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [active, setActive] = useState(true);
  const [variants, setVariants] = useState<VariantRow[]>([{ label: "", price: "" }]);
  const [loading, setLoading] = useState(edit);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!edit) return;
    supabase.from("products").select("*").eq("id", editId).maybeSingle().then(({ data, error: err }) => {
      if (err || !data) setError(err?.message ?? "Product not found.");
      else {
        setName(data.name);
        setDescription(data.description);
        setCategory(data.category);
        setImage(data.image);
        setActive(data.active);
        const rows = (data.variants ?? []).map((v: { label: string; price: number }) => ({ label: v.label, price: String(v.price) }));
        setVariants(rows.length > 0 ? rows : [{ label: "", price: "" }]);
      }
      setLoading(false);
    });
  }, []);

  const setVariant = (i: number, key: keyof VariantRow, value: string) =>
    setVariants(variants.map((v, idx) => (idx === i ? { ...v, [key]: value } : v)));

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const cleaned = variants.map((v) => ({ label: v.label.trim(), price: Number(v.price) }));
    if (cleaned.some((v) => v.price === 0 && variants.length === 0) || cleaned.some((v) => !Number.isFinite(v.price) || v.price < 0)) {
      setError("Enter a valid price for every variant.");
      return;
    }
    setBusy(true);
    const fields = { name: name.trim(), description: description.trim(), category, image: image.trim(), active, variants: cleaned };
    let result;
    if (edit) result = await supabase.from("products").update(fields).eq("id", editId);
    else {
      const id = `${category}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      result = await supabase.from("products").insert({ id, ...fields, sort_order: 100 });
    }
    setBusy(false);
    if (result.error) setError(result.error.message);
    else if (edit) setMessage("Changes saved.");
    else navigate("/admin/products");
  };

  const remove = async () => {
    if (!window.confirm("Delete this product permanently?")) return;
    setBusy(true);
    const { error: err } = await supabase.from("products").delete().eq("id", editId);
    setBusy(false);
    if (err) setError(err.message);
    else navigate("/admin/products");
  };

  if (loading) return <div className="admin-page"><p>Loading product...</p></div>;

  return <div className="admin-page"><button className="admin-back" onClick={() => navigate("/admin/products")}>&larr; Back to products</button><PageHead eyebrow="CATALOGUE" title={edit ? "Edit Product" : "Add Product"} copy={edit ? "Update catalogue information and availability." : "Create a new catalogue entry."} />
    {message && <div className="form-state success">{message}</div>}
    {error && <p role="alert" style={{ color: "#b3261e" }}>{error}</p>}
    <form className="product-admin-form" onSubmit={save}>
      <section><h2>Product information</h2>
        <label className="field">Product Name<input required value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className="field">Description<textarea required value={description} onChange={(e) => setDescription(e.target.value)} /></label>
        <label className="field">Category<select required value={category} onChange={(e) => setCategory(e.target.value)}><option value="" disabled>Select category</option>{["Brownies", "Cheesecakes", "Cookies", "Tub Cakes", "Celebration Cakes", "Sugar-Free Goodies", "Breads", "Savour Jars"].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="field">Image URL<input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." /></label>
      </section>
      <aside><h2>Pricing &amp; status</h2>
        {variants.map((v, i) => <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <label className="field" style={{ flex: 1 }}>Size / label<input value={v.label} onChange={(e) => setVariant(i, "label", e.target.value)} placeholder="e.g. 500 g" /></label>
          <label className="field" style={{ width: 110 }}>Price (&#8377;)<input required type="number" min="0" value={v.price} onChange={(e) => setVariant(i, "price", e.target.value)} /></label>
          {variants.length > 1 && <button type="button" className="admin-secondary" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}>Remove</button>}
        </div>)}
        <button className="admin-secondary" type="button" onClick={() => setVariants([...variants, { label: "", price: "" }])}>+ Add Variant</button>
        <label className="check-line"><input checked={active} onChange={(e) => setActive(e.target.checked)} type="checkbox" /> Product is available</label>
        <button className="admin-primary" type="submit" disabled={busy}>{busy ? "Saving..." : edit ? "Save Changes" : "Add Product"}</button>
        {edit && <button className="admin-secondary" type="button" disabled={busy} onClick={remove}>Delete Product</button>}
      </aside>
    </form></div>;
}

function AdminCategories() {
  const categories = [["Brownies", 4], ["Cheesecakes", 4], ["Cookies", 5], ["Tub Cakes", 4], ["Celebration Cakes", 4], ["Sugar-Free Goodies", 5], ["Breads", 5], ["Savour Jars", 5]];
  return <div className="admin-page"><PageHead eyebrow="CATALOGUE" title="Categories" copy="Organize the eight Épi d’Or menu categories." action={<button className="admin-primary">+ Add Category</button>} /><div className="category-admin-grid">{categories.map(([name, count], i) => <article key={name}><span>0{i + 1}</span><h2>{name}</h2><p>{count} products</p><div><button>Edit</button><button>Manage</button></div></article>)}</div></div>;
}

function AdminCustomers() {
  return <div className="admin-page"><PageHead eyebrow="CUSTOMERS" title="Customer Directory" copy="Customer profiles will appear after authentication is connected." /><div className="admin-table-card"><EmptyAdmin text="No customer database connected" /></div></div>;
}

function AdminSettings() {
  const [saved, setSaved] = useState(false);
  return <div className="admin-page"><PageHead eyebrow="CONFIGURATION" title="Settings" copy="Manage the bakery’s public contact details and fulfilment preferences." />{saved && <div className="form-state success">Settings preview updated for this screen.</div>}<form className="settings-admin-form" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}><h2>Bakery information</h2><label className="field">Brand Name<input defaultValue="Épi d’Or" /></label><label className="field">Phone<input defaultValue="+91 8369301551" /></label><label className="field">Instagram<input defaultValue="@epidor_patisserie" /></label><label className="field">Location<input defaultValue="Mumbai" /></label><h2>Order options</h2><label className="check-line"><input defaultChecked type="checkbox" /> Pickup available</label><label className="check-line"><input type="checkbox" /> Delivery available</label><button className="admin-primary" type="submit">Save Settings</button></form></div>;
}

function EmptyAdmin({ text }: { text: string }) {
  return <div className="admin-empty"><i>○</i><strong>{text}</strong><p>Connect Supabase later to populate this area with live data.</p></div>;
}

export function AdminLogout({ navigate }: { navigate: Navigate }) {
  return <main className="admin-logout"><AdminMark /><div className="success-seal">✓</div><h1>Admin signed out</h1><p>The frontend preview state has ended. No secure session was created.</p><button className="admin-primary" onClick={() => navigate("/admin/login")}>Return to Admin Login</button></main>;
}
