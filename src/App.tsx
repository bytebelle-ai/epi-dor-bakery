import { useProducts } from "./ProductsContext";
import { useEffect, useMemo, useState } from "react";
import "./index.css";
import {
  CustomerAccount,
  CustomerLogin,
  CustomerSignup,
  AuthenticationGate,
  LogoutState,
  PasswordFlow,
  RoleSelection,
  WelcomeEntry,
} from "./AuthScreens";
import { AdminApp, AdminLogin, AdminLogout } from "./AdminScreens";
import { AdminGuard } from "./AdminGuard";
import { supabase } from "./supabase";

type Variant = { label: string; price: number };
type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  variants: Variant[];
  image: string;
};
type CartItem = Product & { variant: Variant; quantity: number; note?: string };

const photos = {
  hero: "https://images.unsplash.com/photo-1686515266396-080c4939e6b4?auto=format&fit=crop&w=1800&q=88",
  cake: "https://images.unsplash.com/photo-1615796701805-2094ac54bbf9?auto=format&fit=crop&w=1000&q=85",
  slice: "https://images.unsplash.com/photo-1623065561776-b346afc11633?auto=format&fit=crop&w=1000&q=85",
  cookies: "https://images.unsplash.com/photo-1606312619139-03f9d5d27e12?auto=format&fit=crop&w=1000&q=85",
  bakery: "https://images.unsplash.com/photo-1429554513019-6c61c19ffb7e?auto=format&fit=crop&w=1000&q=85",
  patisserie: "https://images.unsplash.com/photo-1731399295775-45dc1fc7e52a?auto=format&fit=crop&w=1000&q=85",
};

const make = (
  category: string,
  name: string,
  description: string,
  variants: Variant[],
  image: string,
): Product => ({
  id: `${category}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  category,
  name,
  description,
  variants,
  image,
});

export const fallbackProducts: Product[] = [
  make("Brownies", "Classic Chocolate Brownie", "Dense, fudgy and made with rich dark chocolate", [{ label: "Per Piece", price: 129 }], photos.slice),
  make("Brownies", "Blondie", "Buttery, golden, with notes of vanilla and brown sugar", [{ label: "Per Piece", price: 149 }], photos.cookies),
  make("Brownies", "Oats & Caramel Brownie", "Toasted oats folded in with a ribbon of salted caramel", [{ label: "Per Piece", price: 199 }], photos.slice),
  make("Brownies", "Peanut Butter M&M Brownie", "Swirled peanut butter, studded with crunchy M&Ms", [{ label: "Per Piece", price: 225 }], photos.slice),
  make("Cheesecakes", "Classic Cheesecake", "Silken and creamy on a buttery biscuit base", [{ label: "500 g", price: 799 }, { label: "1 kg", price: 1599 }], photos.cake),
  make("Cheesecakes", "Burnt Basque Cheesecake", "Caramelised top, molten centre, no crust", [{ label: "500 g", price: 1199 }, { label: "1 kg", price: 2399 }], photos.cake),
  make("Cheesecakes", "Chocolate Burnt Basque Cheesecake", "Our Basque classic, deepened with dark chocolate", [{ label: "500 g", price: 1399 }, { label: "1 kg", price: 2799 }], photos.slice),
  make("Cheesecakes", "Berry Vanilla Cheesecake", "Fresh berry compote over a vanilla bean filling", [{ label: "500 g", price: 999 }, { label: "1 kg", price: 1999 }], photos.cake),
  make("Cookies", "Dark Chocolate Chip Cookie", "Chewy, buttery dough loaded with dark chocolate chunks", [{ label: "500 g", price: 749 }], photos.cookies),
  make("Cookies", "Milk Chocolate Chip Cookie", "Soft and golden, packed with milk chocolate chips", [{ label: "500 g", price: 749 }], photos.cookies),
  make("Cookies", "Pistachio White Cookie", "Nutty pistachio dough studded with white chocolate", [{ label: "500 g", price: 799 }], photos.cookies),
  make("Cookies", "Palmiers", "Crisp, caramelised puff pastry hearts", [{ label: "500 g", price: 799 }], photos.patisserie),
  make("Cookies", "Cookie Tub", "A shareable tub of warm, gooey baked cookie dough", [{ label: "500 g", price: 799 }], photos.cookies),
  make("Tub Cakes", "Chocolate Tub Cake", "Layers of moist chocolate sponge and silky ganache", [{ label: "", price: 749 }], photos.slice),
  make("Tub Cakes", "Black Forest Tub Cake", "Chocolate sponge, whipped cream and cherries in every spoon", [{ label: "", price: 749 }], photos.cake),
  make("Tub Cakes", "Tiramisu Tub Cake", "Coffee-soaked sponge layered with mascarpone cream", [{ label: "", price: 799 }], photos.cake),
  make("Tub Cakes", "Citrus Cocoa Tub Cake", "Dark chocolate sponge brightened with fresh orange", [{ label: "", price: 799 }], photos.slice),
  make("Celebration Cakes", "Classic Chocolate Cake", "A timeless favourite, rich and generously layered", [{ label: "500 g", price: 799 }, { label: "1 kg", price: 1599 }], photos.cake),
  make("Celebration Cakes", "Chocolate Orange Cake", "Dark chocolate sponge brightened with fresh orange", [{ label: "500 g", price: 899 }, { label: "1 kg", price: 1799 }], photos.slice),
  make("Celebration Cakes", "Carrot Cream Cake", "Warmly spiced carrot sponge with cream cheese frosting", [{ label: "500 g", price: 699 }, { label: "1 kg", price: 1399 }], photos.cake),
  make("Celebration Cakes", "Vanilla Caramel Cake", "Soft vanilla sponge layered with silky caramel cream", [{ label: "500 g", price: 799 }, { label: "1 kg", price: 1599 }], photos.cake),
  make("Sugar-Free Goodies", "Dark Chocolate Chip Cookie", "Chewy, buttery dough loaded with dark chocolate chunks", [{ label: "500 g", price: 1149 }], photos.cookies),
  make("Sugar-Free Goodies", "Milk Chocolate Chip Cookie", "Soft and golden, packed with milk chocolate chips", [{ label: "500 g", price: 1149 }], photos.cookies),
  make("Sugar-Free Goodies", "Pistachio White Cookie", "Nutty pistachio dough studded with white chocolate", [{ label: "500 g", price: 1399 }], photos.cookies),
  make("Sugar-Free Goodies", "Classic Cheesecake", "Silken and creamy on a buttery biscuit base", [{ label: "500 g", price: 1399 }], photos.cake),
  make("Sugar-Free Goodies", "Burnt Basque Cheesecake", "Caramelised top, molten centre, no crust", [{ label: "500 g", price: 1599 }], photos.cake),
  make("Breads", "Focaccia", "Olive oil, seasalt and herbs baked into an airy crumb", [{ label: "₹249", price: 249 }, { label: "₹499", price: 499 }], photos.bakery),
  make("Breads", "White Bread Loaf", "A soft everyday loaf baked fresh each morning", [{ label: "", price: 119 }], photos.bakery),
  make("Breads", "Brown Bread Loaf", "Wholesome and hearty, lightly nutty in flavour", [{ label: "", price: 149 }], photos.bakery),
  make("Breads", "Garlic Loaf", "Roasted garlic and herb butter swirled through soft bread", [{ label: "", price: 199 }], photos.bakery),
  make("Breads", "Korean Cream Cheese Bun", "Pillowy milkbread filled with whipped cream cheese", [{ label: "", price: 79 }], photos.bakery),
  make("Savour Jars", "Basil Pesto", "Fresh basil, nuts and olive oil", [{ label: "", price: 199 }], photos.patisserie),
  make("Savour Jars", "Pizza Sauce", "Slow-simmered tomatoes with garlic and Italian herbs", [{ label: "", price: 199 }], photos.patisserie),
  make("Savour Jars", "Chilli Oil", "A fiery, aromatic blend for finishing any dish", [{ label: "", price: 199 }], photos.patisserie),
  make("Savour Jars", "Orange Marmalade", "Bright and tangy, made with whole citrus peel", [{ label: "", price: 249 }], photos.patisserie),
  make("Savour Jars", "Berry Jam", "Slow-cooked mixed berries, naturally sweet", [{ label: "", price: 249 }], photos.patisserie),
];

const categories = ["Brownies", "Cheesecakes", "Cookies", "Tub Cakes", "Celebration Cakes", "Sugar-Free Goodies", "Breads", "Savour Jars"];
const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Icon({ name }: { name: "search" | "bag" | "user" | "menu" | "arrow" | "close" | "plus" | "minus" }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bag: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    menu: <><path d="M4 8h16M4 16h16" /></>,
    close: <path d="m5 5 14 14M19 5 5 19" />,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function Button({ children, kind = "primary", onClick, type = "button" }: { children: React.ReactNode; kind?: "primary" | "light" | "text"; onClick?: () => void; type?: "button" | "submit" }) {
  return <button type={type} className={`btn btn-${kind}`} onClick={onClick}>{children}</button>;
}

function Logo({ onClick }: { onClick: () => void }) {
  return <button className="logo" onClick={onClick}><span>Épi</span><i> d’Or</i><small>ARTISAN PATISSERIE</small></button>;
}

function Header({ page, navigate, count, openCart, loggedIn, logout }: { page: string; navigate: (p: string) => void; count: number; openCart: () => void; loggedIn: boolean; logout: () => void }) {
  const [mobile, setMobile] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (p: string) => { navigate(p); setMobile(false); };
  return <header className={`${scrolled ? "header compact" : "header"} ${page === "home" && !scrolled ? "home-header" : ""}`}>
    <div className="nav-shell">
      <Logo onClick={() => go("home")} />
      <nav className={mobile ? "nav-links open" : "nav-links"}>
        {["Home", "Menu", "About", "Custom Cakes", "Contact"].map((label) => {
          const id = label.toLowerCase().replace(" ", "-");
          return <button key={label} className={page === id ? "active" : ""} onClick={() => go(id)}>{label}</button>;
        })}
        <button className="mobile-account-link" onClick={() => go(loggedIn ? "/account" : "/login")}>{loggedIn ? "My Account" : "Login / Create Account"}</button>
        <button className="mobile-switch-link" onClick={() => go("/select-role")}>Switch / Change Access</button>
        <Button onClick={() => go("menu")}>Order Now</Button>
      </nav>
      <div className="nav-actions">
        <button className="icon-btn desktop-icon" aria-label="Search" onClick={() => go("menu")}><Icon name="search" /></button>
        <div className="account-menu-wrap">
          <button className="icon-btn desktop-icon" aria-label="Account" onClick={() => setAccountOpen(!accountOpen)}><Icon name="user" /></button>
          {accountOpen && <div className="account-popover">
            <p className="eyebrow">{loggedIn ? "YOUR ACCOUNT" : "WELCOME"}</p>
            {loggedIn ? <>
              <button onClick={() => { go("/account"); setAccountOpen(false); }}>My Profile</button>
              <button onClick={() => { go("/account/orders"); setAccountOpen(false); }}>My Orders</button>
              <button onClick={() => { go("/account/addresses"); setAccountOpen(false); }}>Saved Addresses</button>
              <button onClick={() => { go("/account/settings"); setAccountOpen(false); }}>Account Settings</button>
              <button onClick={() => { go("/select-role"); setAccountOpen(false); }}>Switch / Change Access</button>
              <button className="popover-logout" onClick={() => { logout(); setAccountOpen(false); }}>Logout</button>
            </> : <>
              <button onClick={() => { go("/login"); setAccountOpen(false); }}>Login</button>
              <button onClick={() => { go("/signup"); setAccountOpen(false); }}>Create Account</button>
              <button onClick={() => { go("/select-role"); setAccountOpen(false); }}>Switch / Change Access</button>
            </>}
          </div>}
        </div>
        <button className="icon-btn bag" aria-label="Cart" onClick={openCart}><Icon name="bag" />{count > 0 && <b>{count}</b>}</button>
        <div className="desktop-order"><Button onClick={() => go("menu")}>Order Now</Button></div>
        <button className="icon-btn mobile-toggle" aria-label="Toggle menu" onClick={() => setMobile(!mobile)}><Icon name={mobile ? "close" : "menu"} /></button>
      </div>
    </div>
  </header>;
}

function ProductCard({ product, view, add }: { product: Product; view: (p: Product) => void; add: (p: Product, v: Variant) => void }) {
  const [variant, setVariant] = useState(product.variants[0]);
  return <article className="product-card">
    <button className="product-image" onClick={() => view(product)}>
      <img src={product.image} alt={product.name} />
      <span>{product.category}</span>
    </button>
    <div className="product-info">
      <p className="eyebrow">{variant.label || product.category}</p>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      {product.variants.length > 1 && <div className="variant-row">
        {product.variants.map((v) => <button key={v.label} className={variant.label === v.label ? "selected" : ""} onClick={() => setVariant(v)}>{v.label}</button>)}
      </div>}
      <div className="card-bottom">
        <strong>{money(variant.price)}</strong>
        <button className="text-link" onClick={() => view(product)}>View details <Icon name="arrow" /></button>
        <button className="add-btn" aria-label={`Add ${product.name} to cart`} onClick={() => add(product, variant)}><Icon name="plus" /></button>
      </div>
    </div>
  </article>;
}

function Home({ navigate, view, add }: { navigate: (p: string, category?: string) => void; view: (p: Product) => void; add: (p: Product, v: Variant) => void }) {
  const products = useProducts();
  const featuredNames = ["Classic Chocolate Brownie", "Classic Cheesecake", "Pistachio White Cookie", "Chocolate Tub Cake", "Classic Chocolate Cake"];
  const featured = featuredNames.map((n, i) => products.find((p) => p.name === n && (i !== 2 || p.category === "Cookies"))!).filter(Boolean);
  return <main>
    <section className="hero">
      <img src={photos.hero} alt="An elegant display of artisan pastries" />
      <div className="hero-overlay" />
      <div className="hero-copy">
        <p className="eyebrow light">HANDCRAFTED IN MUMBAI</p>
        <h1>Freshly Baked.<br /><em>Beautifully Made.</em></h1>
        <p>Discover handcrafted cakes, brownies, breads and wholesome treats made with warmth and care.</p>
        <div className="hero-actions"><Button kind="light" onClick={() => navigate("menu")}>Explore Menu</Button><button className="ghost-btn" onClick={() => navigate("menu")}>Order Now <Icon name="arrow" /></button></div>
      </div>
      <div className="hero-note"><span>100%</span><p>Vegetarian<br />Artisanal bakery</p></div>
    </section>

    <section className="intro section">
      <p className="eyebrow">THE ÉPI D’OR WAY</p>
      <h2>Small moments, made <em>extraordinary.</em></h2>
      <p>Where the essence of traditional baking meets contemporary flavours, bringing joy and comfort to every customer.</p>
    </section>

    <section className="section featured">
      <div className="section-heading"><div><p className="eyebrow">OUR FAVOURITES</p><h2>Made to be savoured</h2></div><button className="text-link" onClick={() => navigate("menu")}>View the full menu <Icon name="arrow" /></button></div>
      <div className="product-grid">{featured.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} view={view} add={add} />)}</div>
    </section>

    <section className="category-section">
      <div className="section category-inner">
        <div className="section-heading inverse"><div><p className="eyebrow light">FIND YOUR FAVOURITE</p><h2>Shop by category</h2></div><p>From rich, fudgy brownies to fresh loaves and celebration centrepieces.</p></div>
        <div className="category-grid">{categories.map((c, i) => <button key={c} onClick={() => navigate("menu", c)}><span>0{i + 1}</span><strong>{c}</strong><Icon name="arrow" /></button>)}</div>
      </div>
    </section>

    <section className="story section">
      <div className="story-image"><img src={photos.bakery} alt="Fresh artisan breads in a bakery" /><span>BAKED WITH CARE</span></div>
      <div className="story-copy"><p className="eyebrow">OUR STORY</p><h2>A warm welcome to<br /><em>Épi d’Or</em></h2><p>Established with a passion for creating wholesome products, Épi d’Or is growing into a beloved bakery brand known for its rich, heart-filling offerings.</p><Button kind="text" onClick={() => navigate("about")}>Discover our story <Icon name="arrow" /></Button></div>
    </section>
  </main>;
}

function MenuPage({ initialCategory, view, add }: { initialCategory: string; view: (p: Product) => void; add: (p: Product, v: Variant) => void }) {
  const products = useProducts();
  const [category, setCategory] = useState(initialCategory || "All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const list = useMemo(() => {
    let result = products.filter((p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "low") result = [...result].sort((a, b) => a.variants[0].price - b.variants[0].price);
    if (sort === "high") result = [...result].sort((a, b) => b.variants[0].price - a.variants[0].price);
    return result;
  }, [category, query, sort]);
  return <main className="page">
    <section className="page-title"><p className="eyebrow">HANDCRAFTED WITH CARE</p><h1>Our Menu</h1><p>Thoughtful bakes for everyday rituals and special celebrations.</p></section>
    <section className="menu-tools section">
      <div className="search-box"><Icon name="search" /><input aria-label="Search menu" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search our menu" /></div>
      <select aria-label="Sort menu" value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Sort: Featured</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option></select>
      <div className="filter-row">{["All", ...categories].map((c) => <button key={c} className={category === c ? "selected" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div>
      <div className="results-line"><span>{list.length} handcrafted selections</span><i /></div>
      {list.length ? <div className="product-grid">{list.map((p) => <ProductCard key={p.id} product={p} view={view} add={add} />)}</div> : <div className="empty"><h2>Nothing found</h2><p>Try another search or category.</p></div>}
    </section>
  </main>;
}

function Detail({ product, add, buyNow, back }: { product: Product; add: (p: Product, v: Variant, quantity?: number, note?: string) => void; buyNow: (p: Product, v: Variant, quantity?: number, note?: string) => void; back: () => void }) {
  const [variant, setVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const celebration = product.category === "Celebration Cakes";
  return <main className="page detail section">
    <button className="back-link" onClick={back}>← Back to menu</button>
    <div className="detail-grid">
      <div className="detail-image"><img src={product.image} alt={product.name} /><span>100% VEGETARIAN</span></div>
      <div className="detail-copy">
        <p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="detail-desc">{product.description}</p>
        <strong className="detail-price">{money(variant.price)}</strong>
        {product.variants.length > 1 && <fieldset><legend>{product.name === "Focaccia" ? "Select option" : "Select size"}</legend><div className="size-options">{product.variants.map((v) => <button className={variant.label === v.label ? "selected" : ""} key={v.label} onClick={() => setVariant(v)}><span>{v.label}</span>{!v.label.startsWith("₹") && <b>{money(v.price)}</b>}</button>)}</div></fieldset>}
        {celebration && <label className="field">Message or customization (optional)<textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tell us how you would like it personalised" /></label>}
        <div className="purchase-row"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Icon name="minus" /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}><Icon name="plus" /></button></div><Button onClick={() => add(product, variant, quantity, note)}>Add to Cart — {money(variant.price * quantity)}</Button></div>
        <button className="buy-now" onClick={() => buyNow(product, variant, quantity, note)}>Buy Now</button>
        {celebration && <p className="request-note">Vegan, gluten-free and sugar-free options are available upon request and require advance notice.</p>}
      </div>
    </div>
  </main>;
}

function CustomCakes({ add }: { add: (p: Product, v: Variant, quantity?: number, note?: string) => void }) {
  const products = useProducts();
  const cakes = products.filter((p) => p.category === "Celebration Cakes");
  const [cake, setCake] = useState(cakes[0]);
  const [variant, setVariant] = useState(cakes[0].variants[0]);
  const [diet, setDiet] = useState("None");
  const [message, setMessage] = useState("");
  return <main className="page">
    <section className="custom-hero"><img src={photos.cake} alt="Artisan celebration cake" /><div><p className="eyebrow light">MADE FOR YOUR MOMENT</p><h1>Your celebration,<br /><em>beautifully baked.</em></h1><p>Choose from our celebration cake catalogue and share your preferences with our bakers.</p></div></section>
    <section className="custom-builder section">
      <div className="custom-intro"><p className="eyebrow">PERSONALISE YOUR CAKE</p><h2>Tell us what you have in mind</h2><p>All cakes can be personalized to your preference. Any flavor can be customized to suit your taste with advance notice.</p></div>
      <form className="cake-form" onSubmit={(e) => { e.preventDefault(); add(cake, variant, 1, `${diet}${message ? ` · ${message}` : ""}`); }}>
        <fieldset className="cake-step">
          <legend><span>1.</span> Choose Your Cake</legend>
          <div className="cake-choice-grid">{cakes.map((item) => <button type="button" className={cake.id === item.id ? "selected" : ""} key={item.id} onClick={() => { setCake(item); setVariant(item.variants[0]); }}>
            <img src={item.image} alt="" /><span><strong>{item.name}</strong><small>From {money(item.variants[0].price)}</small></span><i />
          </button>)}</div>
        </fieldset>

        <fieldset className="cake-step compact-step">
          <legend><span>2.</span> Select Size</legend>
          <div className="size-choice-row">{cake.variants.map((item) => <button type="button" className={variant.label === item.label ? "selected" : ""} key={item.label} onClick={() => setVariant(item)}><strong>{item.label}</strong><span>{money(item.price)}</span></button>)}</div>
        </fieldset>

        <fieldset className="cake-step">
          <legend><span>3.</span> Personalization</legend>
          <label className="field">Message on cake<input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Happy Birthday, Congratulations..." /></label>
          <div className="field"><span>Dietary preference</span><div className="diet-row">{["None", "Vegan", "Gluten-Free", "Sugar-Free"].map((d) => <button type="button" className={diet === d ? "selected" : ""} key={d} onClick={() => setDiet(d)}>{d}</button>)}</div><small>Available upon request. Requires advance notice.</small></div>
          <label className="field">Flavor / customization<input placeholder="Share your preferred flavor or customization" /></label>
          <label className="field">Special instructions<textarea placeholder="Any additional details about decoration, colours, theme..." /></label>
        </fieldset>

        <fieldset className="cake-step">
          <legend><span>4.</span> Date &amp; Contact</legend>
          <div className="contact-field-grid">
            <label className="field">Required date *<input required type="date" /></label>
            <label className="field">Full name *<input required autoComplete="name" /></label>
            <label className="field">Phone *<input required type="tel" autoComplete="tel" /></label>
            <label className="field">Email<input type="email" autoComplete="email" /></label>
          </div>
        </fieldset>

        <div className="cake-form-submit"><div><small>SELECTED CAKE</small><strong>{cake.name} · {variant.label}</strong><span>{money(variant.price)}</span></div><Button type="submit">Continue with Request</Button></div>
      </form>
    </section>
  </main>;
}

function About() {
  return <main className="page">
    <section className="editorial-hero section"><div><p className="eyebrow">OUR STORY</p><h1>Baking warmth<br />into <em>every day.</em></h1></div><p>Welcome to the world of Épi d’Or, where every bite is a journey to warmth and delight.</p></section>
    <section className="about-image"><img src={photos.patisserie} alt="Épi d’Or's patisserie inspiration" /></section>
    <section className="philosophy section"><div><p className="eyebrow">OUR PHILOSOPHY</p><h2>Traditional baking.<br /><em>Contemporary flavours.</em></h2></div><div><p>Established with a passion for creating wholesome products, Épi d’Or is growing into a beloved bakery brand known for its rich, heart-filling offerings.</p><p>Here, the essence of traditional baking meets contemporary flavors, bringing joy and comfort to every customer.</p><strong>100% Vegetarian</strong></div></section>
  </main>;
}

function Contact() {
  return <main className="page contact section">
    <div className="contact-copy"><p className="eyebrow">WE’D LOVE TO HEAR FROM YOU</p><h1>Let’s make something<br /><em>beautiful.</em></h1><p>Questions about an order or planning a celebration? Get in touch with Épi d’Or in Mumbai.</p><div className="contact-list"><a href="tel:+918369301551"><span>CALL US</span>+91 8369301551</a><a href="https://instagram.com/epidor_patisserie" target="_blank" rel="noreferrer"><span>INSTAGRAM</span>@epidor_patisserie</a><div><span>LOCATION</span>Mumbai</div></div></div>
    <form className="contact-form" onSubmit={(e) => e.preventDefault()}><h2>Send an enquiry</h2><label className="field">Your name<input required /></label><label className="field">Phone<input required type="tel" /></label><label className="field full">How can we help?<textarea required /></label><Button type="submit">Send Enquiry</Button><a className="whatsapp" href="https://wa.me/918369301551">Continue on WhatsApp</a></form>
  </main>;
}

function Cart({ items, close, change, remove, checkout }: { items: CartItem[]; close: () => void; change: (i: number, n: number) => void; remove: (i: number) => void; checkout: () => void }) {
  const subtotal = items.reduce((s, i) => s + i.variant.price * i.quantity, 0);
  return <div className="cart-layer"><button className="cart-scrim" onClick={close} aria-label="Close cart" /><aside className="cart-panel">
    <div className="cart-head"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag <span>({items.reduce((s, i) => s + i.quantity, 0)})</span></h2></div><button className="icon-btn" onClick={close}><Icon name="close" /></button></div>
    <div className="cart-items">{items.length === 0 ? <div className="empty"><h2>Your bag is empty</h2><p>Something lovely is waiting in our menu.</p><Button onClick={close}>Explore Menu</Button></div> : items.map((item, i) => <div className="cart-item" key={`${item.id}-${item.variant.label}-${i}`}><img src={item.image} alt="" /><div><h3>{item.name}</h3>{item.variant.label && <p>{item.variant.label}</p>}{item.note && <small>{item.note}</small>}<div className="quantity small"><button onClick={() => change(i, item.quantity - 1)}><Icon name="minus" /></button><span>{item.quantity}</span><button onClick={() => change(i, item.quantity + 1)}><Icon name="plus" /></button></div><button className="remove" onClick={() => remove(i)}>Remove</button></div><strong>{money(item.variant.price * item.quantity)}</strong></div>)}</div>
    {items.length > 0 && <div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Delivery or pickup details are confirmed at checkout.</p><Button onClick={checkout}>Proceed to Checkout</Button></div>}
  </aside></div>;
}

function Checkout({ items, done }: { items: CartItem[]; done: () => void }) {
  const total = items.reduce((s, i) => s + i.variant.price * i.quantity, 0);
  const [type, setType] = useState("Pickup");
  return <main className="page checkout section">
    <div className="checkout-form"><p className="eyebrow">SECURE CHECKOUT</p><h1>Complete your order</h1><form onSubmit={(e) => { e.preventDefault(); done(); }}>
      <h3>Customer details</h3><div className="two-col"><label className="field">Full name<input required /></label><label className="field">Phone<input required type="tel" /></label></div><label className="field">Email<input required type="email" /></label>
      <h3>Order type</h3><div className="diet-row">{["Pickup", "Delivery"].map((t) => <button type="button" key={t} className={type === t ? "selected" : ""} onClick={() => setType(t)}>{t}</button>)}</div>
      {type === "Delivery" && <><label className="field">Address<input required /></label><div className="two-col"><label className="field">City<input required defaultValue="Mumbai" /></label><label className="field">Pincode<input required inputMode="numeric" /></label></div><label className="field">Delivery instructions<textarea /></label></>}
      <div className="two-col"><label className="field">Date<input required type="date" /></label><label className="field">Time<input required type="time" /></label></div>
      <div className="payment-note"><strong>Payment</strong><p>Payment integration requires the bakery owner’s connected payment provider. No card credentials are stored by this website.</p></div>
      <Button type="submit">Place Order — {money(total)}</Button>
    </form></div>
    <aside className="order-summary"><p className="eyebrow">ORDER SUMMARY</p>{items.map((i, n) => <div className="summary-item" key={n}><img src={i.image} alt="" /><span>{i.quantity} × {i.name}<small>{i.variant.label}</small></span><b>{money(i.variant.price * i.quantity)}</b></div>)}<div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div></aside>
  </main>;
}

function Confirmation({ navigate }: { navigate: (p: string) => void }) {
  return <main className="page confirmation section"><div className="confirm-mark">✓</div><p className="eyebrow">ORDER RECEIVED</p><h1>Thank you for your order.</h1><p>Your order request has been received. Final availability, order number, timing and payment will be confirmed by the bakery.</p><div className="status-line">{["Order Placed", "Confirmed", "Preparing", "Ready", "Completed"].map((s, i) => <div className={i === 0 ? "current" : ""} key={s}><i>{i + 1}</i><span>{s}</span></div>)}</div><Button onClick={() => navigate("home")}>Return Home</Button></main>;
}

function Footer({ navigate }: { navigate: (p: string) => void }) {
  return <footer><div className="footer-main"><Logo onClick={() => navigate("home")} /><p>Wholesome bakes, contemporary flavours and heartfelt moments—made in Mumbai.</p><div><button onClick={() => navigate("menu")}>Menu</button><button onClick={() => navigate("custom-cakes")}>Custom Cakes</button><button onClick={() => navigate("about")}>Our Story</button><button onClick={() => navigate("contact")}>Contact</button></div><div><a href="tel:+918369301551">+91 8369301551</a><a href="https://instagram.com/epidor_patisserie">@epidor_patisserie</a><span>Mumbai</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Épi d’Or</span><span>100% Vegetarian</span></div></footer>;
}

export default function App() {
  const products = useProducts();
  const [path, setPath] = useState(window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/$/, ""));
  const [entryChosen, setEntryChosen] = useState(() => sessionStorage.getItem("epidor-entry") === "customer");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [demoLoggedIn, setDemoLoggedIn] = useState(false);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [authDestination, setAuthDestination] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{ product: Product; variant: Variant; quantity: number; note: string; next: "cart" | "checkout"; returnPath: string } | null>(null);
  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/$/, ""));
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);
  const routeMap: Record<string, string> = {
    home: "/", menu: "/menu", about: "/about", "custom-cakes": "/custom-cakes",
    contact: "/contact", checkout: "/checkout", confirmation: "/confirmation",
  };
  const navigate = (destination: string, c = "") => {
    const next = routeMap[destination] || destination;
    window.history.pushState({}, "", next);
    setPath(next);
    setCategory(c);
    setSelected(null);
    setCartOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const page = path === "/" ? "home" : path.slice(1);
  const view = (p: Product) => { setSelected(p); window.history.pushState({}, "", `/menu/${p.id}`); setPath(`/menu/${p.id}`); window.scrollTo(0, 0); };
  const addAuthenticated = (p: Product, variant: Variant, quantity = 1, note = "", openCart = true) => {
    setCart((items) => [...items, { ...p, variant, quantity, note }]);
    if (openCart) setCartOpen(true);
  };
  const requestOrderAction = (p: Product, variant: Variant, quantity = 1, note = "", next: "cart" | "checkout" = "cart") => {
    if (demoLoggedIn) {
      addAuthenticated(p, variant, quantity, note, next === "cart");
      if (next === "checkout") navigate("/checkout");
      return;
    }
    setPendingAction({ product: p, variant, quantity, note, next, returnPath: path });
    setAuthGateOpen(true);
  };
  const add = (p: Product, variant: Variant, quantity = 1, note = "") => requestOrderAction(p, variant, quantity, note, "cart");
  const buyNow = (p: Product, variant: Variant, quantity = 1, note = "") => requestOrderAction(p, variant, quantity, note, "checkout");
  const checkout = () => {
    if (!demoLoggedIn) {
      setCartOpen(false);
      setAuthDestination("/checkout");
      setAuthGateOpen(true);
      return;
    }
    setCartOpen(false);
    navigate("checkout");
  };
  const complete = () => { setCart([]); navigate("confirmation"); };
  const customerAuthRoute = ["/login", "/signup", "/forgot-password", "/reset-password"].includes(path);
  const accountRoute = path.startsWith("/account");
  const adminRoute = path.startsWith("/admin");
  const logoutCustomer = () => { setDemoLoggedIn(false); setCart([]); navigate("/logout"); };
  const logoutAdmin = () => { navigate("/admin/logout"); supabase.auth.signOut(); };
  const completeCustomerAuthentication = () => {
    setDemoLoggedIn(true);
    if (pendingAction) {
      addAuthenticated(pendingAction.product, pendingAction.variant, pendingAction.quantity, pendingAction.note, false);
      const destination = pendingAction.next === "checkout" ? "/checkout" : pendingAction.returnPath;
      const shouldOpenCart = pendingAction.next === "cart";
      setPendingAction(null);
      navigate(destination);
      if (shouldOpenCart) window.setTimeout(() => setCartOpen(true), 0);
    } else if (authDestination) {
      const destination = authDestination;
      setAuthDestination(null);
      navigate(destination);
    } else {
      navigate("/account");
    }
  };

  if (adminRoute) {
    if (path === "/admin/login") return <AdminLogin navigate={navigate} />;
    if (path === "/admin/forgot-password") return <AdminLogin navigate={navigate} forgot />;
    if (path === "/admin/logout") return <AdminLogout navigate={navigate} />;
    return <AdminGuard navigate={navigate}><AdminApp path={path} navigate={navigate} logout={logoutAdmin} /></AdminGuard>;
  }

  if (path === "/" && !entryChosen) {
    return <WelcomeEntry enterCustomer={() => {
      sessionStorage.setItem("epidor-entry", "customer");
      setEntryChosen(true);
    }} enterAdmin={() => navigate("/admin/login")} />;
  }

  if (path === "/select-role") {
    return <RoleSelection customer={() => {
      sessionStorage.setItem("epidor-entry", "customer");
      setEntryChosen(true);
      navigate("/");
    }} admin={() => navigate("/admin/login")} />;
  }

  return <div>
    <Header page={page} navigate={navigate} count={cart.reduce((s, i) => s + i.quantity, 0)} openCart={() => setCartOpen(true)} loggedIn={demoLoggedIn} logout={logoutCustomer} />
    {page === "home" && <Home navigate={navigate} view={view} add={add} />}
    {page === "menu" && <MenuPage initialCategory={category} view={view} add={add} />}
    {path.startsWith("/menu/") && (selected || products.find((product) => `/menu/${product.id}` === path)) && <Detail product={(selected || products.find((product) => `/menu/${product.id}` === path))!} add={add} buyNow={buyNow} back={() => navigate("menu", (selected || products.find((product) => `/menu/${product.id}` === path))!.category)} />}
    {page === "custom-cakes" && <CustomCakes add={add} />}
    {page === "about" && <About />}
    {page === "contact" && <Contact />}
    {page === "checkout" && (demoLoggedIn ? <Checkout items={cart} done={complete} /> : <CustomerLogin navigate={navigate} onDemoLogin={() => { setDemoLoggedIn(true); navigate("/checkout"); }} />)}
    {page === "confirmation" && <Confirmation navigate={navigate} />}
    {path === "/login" && <CustomerLogin navigate={navigate} onDemoLogin={completeCustomerAuthentication} />}
    {path === "/signup" && <CustomerSignup navigate={navigate} onDemoLogin={completeCustomerAuthentication} />}
    {path === "/forgot-password" && <PasswordFlow navigate={navigate} />}
    {path === "/reset-password" && <PasswordFlow navigate={navigate} reset />}
    {accountRoute && <CustomerAccount path={path} navigate={navigate} logout={logoutCustomer} />}
    {path === "/logout" && <LogoutState navigate={navigate} />}
    {!["checkout", "confirmation"].includes(page) && !customerAuthRoute && !accountRoute && path !== "/logout" && <Footer navigate={navigate} />}
    {cartOpen && <Cart items={cart} close={() => setCartOpen(false)} change={(i, n) => n < 1 ? setCart((x) => x.filter((_, k) => k !== i)) : setCart((x) => x.map((v, k) => k === i ? { ...v, quantity: n } : v))} remove={(i) => setCart((x) => x.filter((_, k) => k !== i))} checkout={checkout} />}
    {authGateOpen && <AuthenticationGate close={() => setAuthGateOpen(false)} login={() => { setAuthGateOpen(false); navigate("/login"); }} signup={() => { setAuthGateOpen(false); navigate("/signup"); }} />}
  </div>;
}
