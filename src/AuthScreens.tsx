import { supabase } from "./supabase";
import { FormEvent, useState } from "react";

type Navigate = (path: string) => void;

const IconArrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M14 7l5 5-5 5" />
  </svg>
);

export function WelcomeEntry({ enterCustomer, enterAdmin }: { enterCustomer: () => void; enterAdmin: () => void }) {
  return <main className="welcome-entry">
    <section className="welcome-visual">
      <img src="https://images.unsplash.com/photo-1686515266396-080c4939e6b4?auto=format&fit=crop&w=1600&q=88" alt="Épi d’Or artisan patisserie selection" />
      <div className="welcome-wordmark"><strong>Épi d’Or</strong><span>ARTISAN PATISSERIE · MUMBAI</span></div>
      <p>Traditional baking.<br /><em>Contemporary flavours.</em></p>
    </section>
    <section className="welcome-choices">
      <div className="welcome-inner">
        <p className="eyebrow">A WARM WELCOME</p>
        <h1>Welcome to <em>Épi d’Or</em></h1>
        <p className="welcome-lede">Discover handcrafted cakes, bakes and treats made with warmth.</p>
        <div className="entry-options">
          <article>
            <span>01</span>
            <div><h2>Customer</h2><p>Explore our menu and discover Épi d’Or.</p></div>
            <button className="btn" onClick={enterCustomer}>Enter as Customer</button>
          </article>
          <article>
            <span>02</span>
            <div><h2>Admin</h2><p>For bakery management.</p></div>
            <button className="entry-admin-btn" onClick={enterAdmin}>Admin Login <IconArrow /></button>
          </article>
        </div>
        <small>100% vegetarian · Handcrafted in Mumbai</small>
      </div>
    </section>
  </main>;
}

export function RoleSelection({ customer, admin }: { customer: () => void; admin: () => void }) {
  return <main className="role-selection">
    <header className="role-header">
      <div className="welcome-wordmark"><strong>Épi d’Or</strong><span>ARTISAN PATISSERIE · MUMBAI</span></div>
      <p>100% vegetarian</p>
    </header>
    <section className="role-content">
      <div className="role-intro">
        <p className="eyebrow">CHOOSE YOUR EXPERIENCE</p>
        <h1>How would you<br />like to <em>enter?</em></h1>
        <p>Choose your experience.</p>
      </div>
      <div className="role-cards">
        <article>
          <span>01 · CUSTOMER</span>
          <div className="role-ornament">É</div>
          <h2>Welcome to<br />the bakery.</h2>
          <p>Explore our freshly baked favourites.</p>
          <button className="btn" onClick={customer}>Continue as Customer <IconArrow /></button>
        </article>
        <article className="admin-role-card">
          <span>02 · ADMIN</span>
          <div className="role-ornament">A</div>
          <h2>Bakery<br />management.</h2>
          <p>Manage Épi d’Or.</p>
          <button className="role-outline-btn" onClick={admin}>Continue as Admin <IconArrow /></button>
        </article>
      </div>
    </section>
    <footer className="role-footer"><span>Traditional baking · Contemporary flavours</span><span>Mumbai</span></footer>
  </main>;
}

export function AuthenticationGate({ login, signup, close }: { login: () => void; signup: () => void; close: () => void }) {
  return <div className="auth-gate-layer" role="dialog" aria-modal="true" aria-labelledby="auth-gate-title">
    <button className="auth-gate-scrim" aria-label="Continue browsing" onClick={close} />
    <section className="auth-gate">
      <button className="gate-close" aria-label="Close" onClick={close}>×</button>
      <div className="gate-mark">É</div>
      <p className="eyebrow">YOUR ORDER AWAITS</p>
      <h2 id="auth-gate-title">Sign in to continue</h2>
      <p>Create an account or sign in to continue with your order.</p>
      <div className="gate-actions"><button className="btn" onClick={login}>Login</button><button className="gate-signup" onClick={signup}>Create Account</button></div>
      <button className="gate-browse" onClick={close}>Continue browsing</button>
      <small>Your selection will be waiting for you.</small>
    </section>
  </div>;
}

function AuthShell({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <main className="auth-page page">
      <section className="auth-editorial">
        <img
          src="https://images.unsplash.com/photo-1731399295775-45dc1fc7e52a?auto=format&fit=crop&w=1200&q=86"
          alt="An elegant display of handcrafted pastries"
        />
        <div>
          <p className="eyebrow light">ÉPI D’OR PATISSERIE</p>
          <blockquote>“A little warmth,<br />baked into every day.”</blockquote>
          <span>100% vegetarian · Mumbai</span>
        </div>
      </section>
      <section className="auth-content">
        <div className="auth-card">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-lede">{copy}</p>
          {children}
        </div>
      </section>
    </main>
  );
}

export function CustomerLogin({ navigate, onDemoLogin }: { navigate: Navigate; onDemoLogin: () => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;
    const password = (form.querySelector('input[type="password"]') as HTMLInputElement).value;
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) { setError("Invalid email or password."); return; }
    onDemoLogin();
  };
  return (
    <AuthShell eyebrow="CUSTOMER ACCOUNT" title="Welcome Back" copy="Sign in to continue your Épi d’Or experience.">
      {error && <div className="form-state error">{error}</div>}
      <form className="auth-form" onSubmit={submit}>
        <label className="field">Email Address<input required type="email" autoComplete="email" placeholder="you@example.com" /></label>
        <label className="field">Password<input required type="password" autoComplete="current-password" placeholder="Enter your password" /></label>
        <div className="form-options">
          <label><input type="checkbox" /> Remember me</label>
          <button type="button" onClick={() => navigate("/forgot-password")}>Forgot Password?</button>
        </div>
        <button className="btn" type="submit" disabled={busy}>{busy ? "Signing in..." : "Login"}</button>
      </form>
      <div className="auth-switch"><span>Don’t have an account?</span><button onClick={() => navigate("/signup")}>Create Account</button></div>
      <button className="guest-link" onClick={() => navigate("/checkout")}>Continue as Guest <IconArrow /></button>
    </AuthShell>
  );
}

export function CustomerSignup({ navigate, onDemoLogin }: { navigate: Navigate; onDemoLogin: () => void }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const get = (sel: string) => (form.querySelector(sel) as HTMLInputElement).value;
    const passwords = form.querySelectorAll('input[type="password"]');
    const password = (passwords[0] as HTMLInputElement).value;
    if (password !== (passwords[1] as HTMLInputElement).value) { setError("Passwords do not match."); return; }
    setBusy(true);
    setError("");
    const { data, error: err } = await supabase.auth.signUp({
      email: get('input[type="email"]'),
      password,
      options: { data: { full_name: get('input[autocomplete="name"]'), phone: get('input[type="tel"]'), dob: get('input[type="date"]') } },
    });
    setBusy(false);
    if (err) { setError(err.message); return; }
    if (data.session) { setSuccess(true); window.setTimeout(() => onDemoLogin(), 700); }
    else setInfo("Check your email to confirm your account, then log in.");
  };
  return (
    <AuthShell eyebrow="BECOME PART OF ÉPI D’OR" title="Create Your Account" copy="Join Épi d’Or and keep your favourite orders close.">
      {success && <div className="form-state success">Account preview created. Opening your account…</div>}
      {error && <div className="form-state error">{error}</div>}
      {info && <div className="form-state success">{info}</div>}
      <form className="auth-form signup-form" onSubmit={submit}>
        <label className="field">Full Name<input required autoComplete="name" /></label>
        <label className="field">Email Address<input required type="email" autoComplete="email" /></label>
        <label className="field">Phone Number<input required type="tel" autoComplete="tel" /></label>
        <label className="field">Date of Birth <small>Optional</small><input type="date" /></label>
        <label className="field">Password<input required type="password" autoComplete="new-password" minLength={8} /></label>
        <label className="field">Confirm Password<input required type="password" autoComplete="new-password" minLength={8} /></label>
        <label className="check-line"><input required type="checkbox" /> <span>I agree to the Terms &amp; Privacy Policy</span></label>
        <button className="btn" type="submit" disabled={busy}>{busy ? "Creating..." : "Create Account"}</button>
      </form>
      <div className="auth-switch"><span>Already have an account?</span><button onClick={() => navigate("/login")}>Login</button></div>
    </AuthShell>
  );
}

export function PasswordFlow({ reset = false, admin = false, navigate }: { reset?: boolean; admin?: boolean; navigate: Navigate }) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };
  const loginPath = admin ? "/admin/login" : "/login";
  return (
    <AuthShell
      eyebrow={admin ? "ADMIN ACCESS" : "ACCOUNT RECOVERY"}
      title={reset ? "Create New Password" : "Reset Your Password"}
      copy={reset ? "Choose a new password for your Épi d’Or account." : "Enter your email and we’ll prepare a password reset link."}
    >
      <div className="prototype-note">Frontend preview only — no email is sent and no password is stored.</div>
      {sent ? (
        <div className="recovery-success">
          <div className="success-seal">✓</div>
          <h2>{reset ? "Password Changed" : "Reset Link Prepared"}</h2>
          <p>{reset ? "Your password change is represented in this preview." : "The password reset sent state is ready for backend integration."}</p>
          <button className="btn" onClick={() => navigate(loginPath)}>Return to Login</button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          {!reset ? (
            <label className="field">Email Address<input required type="email" autoComplete="email" /></label>
          ) : (
            <>
              <label className="field">New Password<input required type="password" autoComplete="new-password" minLength={8} /></label>
              <label className="field">Confirm New Password<input required type="password" autoComplete="new-password" minLength={8} /></label>
            </>
          )}
          <button className="btn" type="submit">{reset ? "Change Password" : "Send Reset Link"}</button>
        </form>
      )}
      {!sent && <button className="back-auth" onClick={() => navigate(loginPath)}>← Back to login</button>}
    </AuthShell>
  );
}

const demoOrders = [
  { id: "Order preview 01", date: "Sample date", products: "Classic Chocolate Cake · 500 g", total: "₹799", status: "Preparing" },
  { id: "Order preview 02", date: "Sample date", products: "Classic Chocolate Brownie × 2", total: "₹258", status: "Completed" },
];

const accountItems = [
  { path: "/account", label: "Overview" },
  { path: "/account/orders", label: "My Orders" },
  { path: "/account/addresses", label: "Saved Addresses" },
  { path: "/account/profile", label: "Profile Information" },
  { path: "/account/settings", label: "Account Settings" },
];

function AccountShell({ path, navigate, logout, children }: { path: string; navigate: Navigate; logout: () => void; children: React.ReactNode }) {
  return (
    <main className="account-page page section">
      <header className="account-header">
        <div><p className="eyebrow">MY ÉPI D’OR</p><h1>Hello, Guest Preview</h1><p>Your account area is ready to connect to real customer data.</p></div>
        <span className="preview-pill">UI PREVIEW</span>
      </header>
      <div className="account-layout">
        <aside className="account-nav">
          {accountItems.map((item) => <button className={path === item.path ? "active" : ""} key={item.path} onClick={() => navigate(item.path)}>{item.label}<span>→</span></button>)}
          <button onClick={() => navigate("/select-role")}>Switch / Change Access<span>↗</span></button>
          <button className="logout-link" onClick={logout}>Logout</button>
        </aside>
        <section className="account-panel">{children}</section>
      </div>
    </main>
  );
}

export function CustomerAccount({ path, navigate, logout }: { path: string; navigate: Navigate; logout: () => void }) {
  if (path.includes("/orders/")) return <OrderDetail path={path} navigate={navigate} logout={logout} />;
  let content: React.ReactNode;
  if (path === "/account/orders") {
    content = <><PanelTitle title="My Orders" copy="View and revisit your recent orders." /><OrderList navigate={navigate} /></>;
  } else if (path === "/account/addresses") {
    content = <Addresses />;
  } else if (path === "/account/profile") {
    content = <Profile />;
  } else if (path === "/account/settings") {
    content = <Settings navigate={navigate} />;
  } else {
    content = <Overview navigate={navigate} />;
  }
  return <AccountShell path={path} navigate={navigate} logout={logout}>{content}</AccountShell>;
}

function PanelTitle({ title, copy }: { title: string; copy: string }) {
  return <div className="panel-title"><p className="eyebrow">ACCOUNT</p><h2>{title}</h2><p>{copy}</p></div>;
}

function Overview({ navigate }: { navigate: Navigate }) {
  return <>
    <PanelTitle title="Your account at a glance" copy="A quiet place for your orders, details and delivery preferences." />
    <div className="account-cards">
      <button onClick={() => navigate("/account/orders")}><span>01</span><h3>My Orders</h3><p>View, track and reorder.</p><b>Explore →</b></button>
      <button onClick={() => navigate("/account/addresses")}><span>02</span><h3>Saved Addresses</h3><p>Manage delivery locations.</p><b>Manage →</b></button>
      <button onClick={() => navigate("/account/profile")}><span>03</span><h3>Profile Information</h3><p>Keep your details current.</p><b>Edit →</b></button>
      <button onClick={() => navigate("/account/settings")}><span>04</span><h3>Account Settings</h3><p>Preferences and password.</p><b>Review →</b></button>
    </div>
    <div className="recent-orders"><div className="list-heading"><h3>Recent orders</h3><button onClick={() => navigate("/account/orders")}>View all</button></div><OrderList navigate={navigate} compact /></div>
  </>;
}

function OrderList({ navigate, compact = false }: { navigate: Navigate; compact?: boolean }) {
  return <div className="order-list">{demoOrders.slice(0, compact ? 1 : 2).map((order, index) => <article key={order.id}>
    <div><span>ORDER NUMBER</span><strong>{order.id}</strong></div><div><span>ORDER DATE</span><strong>{order.date}</strong></div><div className="order-products"><span>PRODUCTS</span><strong>{order.products}</strong></div><div><span>TOTAL</span><strong>{order.total}</strong></div><i className={`status ${order.status.toLowerCase()}`}>{order.status}</i>
    <div className="order-actions"><button onClick={() => navigate(`/account/orders/${index + 1}`)}>View Order</button><button onClick={() => navigate(`/account/orders/${index + 1}`)}>Track Order</button><button>Reorder</button></div>
  </article>)}</div>;
}

function OrderDetail({ path, navigate, logout }: { path: string; navigate: Navigate; logout: () => void }) {
  const order = demoOrders[Number(path.split("/").pop()) - 1] || demoOrders[0];
  return <AccountShell path="/account/orders" navigate={navigate} logout={logout}>
    <button className="back-auth" onClick={() => navigate("/account/orders")}>← Back to orders</button>
    <PanelTitle title={order.id} copy={`${order.date} · ${order.status}`} />
    <div className="order-detail-card">
      <div className="detail-product"><div className="sample-thumb" /><span><strong>{order.products}</strong><small>Product details from order</small></span><b>{order.total}</b></div>
      <div className="detail-meta"><div><span>FULFILMENT</span><strong>Details pending connection</strong></div><div><span>CONTACT</span><strong>Customer profile details</strong></div><div><span>TOTAL</span><strong>{order.total}</strong></div></div>
    </div>
    <div className="order-track"><h3>Order status</h3>{["Order Placed", "Confirmed", "Preparing", "Ready", "Completed"].map((step, index) => <div className={index < 3 ? "complete" : ""} key={step}><i>{index < 3 ? "✓" : index + 1}</i><span>{step}</span></div>)}</div>
  </AccountShell>;
}

function Profile() {
  const [saved, setSaved] = useState(false);
  return <><PanelTitle title="Profile Information" copy="Keep your contact details up to date." /><form className="profile-form" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}>
    {saved && <div className="form-state success">Profile preview updated.</div>}
    <label className="field">Name<input defaultValue="Guest Preview" /></label>
    <label className="field">Email<input type="email" placeholder="Connect account to populate" /></label>
    <label className="field">Phone<input type="tel" placeholder="Connect account to populate" /></label>
    <button className="btn" type="submit">Save Changes</button>
  </form></>;
}

function Addresses() {
  const [showForm, setShowForm] = useState(false);
  return <><div className="panel-title action-title"><div><p className="eyebrow">ACCOUNT</p><h2>Saved Addresses</h2><p>Add and manage your delivery locations.</p></div><button className="btn" onClick={() => setShowForm(!showForm)}>Add Address</button></div>
    {showForm && <form className="address-form" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}><label className="field">Address label<input required placeholder="Home, work…" /></label><label className="field">Address<input required /></label><label className="field">City<input required defaultValue="Mumbai" /></label><label className="field">Pincode<input required inputMode="numeric" /></label><label className="check-line"><input type="checkbox" /> Set as default address</label><button className="btn" type="submit">Save Address</button></form>}
    <div className="empty-address"><span>⌂</span><h3>No saved addresses yet</h3><p>Your saved delivery addresses will appear here.</p></div>
  </>;
}

function Settings({ navigate }: { navigate: Navigate }) {
  return <><PanelTitle title="Account Settings" copy="Manage your preferences and account access." /><div className="settings-list">
    <div><span><strong>Email preferences</strong><small>Product news and order updates</small></span><input aria-label="Email preferences" type="checkbox" /></div>
    <div><span><strong>Password</strong><small>Change your account password</small></span><button onClick={() => navigate("/reset-password")}>Change</button></div>
    <div className="danger-setting"><span><strong>Delete account</strong><small>Requires confirmation when backend is connected</small></span><button>Request</button></div>
  </div></>;
}

export function LogoutState({ navigate }: { navigate: Navigate }) {
  return <main className="page logout-state section"><div className="success-seal">✓</div><p className="eyebrow">SIGNED OUT</p><h1>Until next time.</h1><p>You have been signed out successfully. See you again soon.</p><button className="btn" onClick={() => navigate("/login")}>Return to Login</button></main>;
}
