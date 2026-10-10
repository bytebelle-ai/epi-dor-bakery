# Épi d'Or Bakery: Project Status

Last updated: 11 Oct 2026
Last pushed commit: 03d97d2 (Customer account: live profile)

## Stack
React 19 + Vite 8 + TypeScript + Tailwind 4, pnpm. Routing window.location.pathname se. Supabase (Mumbai, RLS on) + Cloudflare Pages (https://epi-dor-bakery.pages.dev, auto-deploy on push).

## Done
- Deploy, products DB, Menu/Home/Custom Cakes DB se
- Admin login asli + guard + logout
- Admin Products (list, search, filter, add, edit, delete; image sirf URL)
- Admin Orders: live list, search (order no / naam / phone / product), status filter
- Admin Order Detail: items, customer, fulfilment, notes, status update (Supabase mein save)
- Admin Dashboard: live stats (today, pending, total, revenue, products, unavailable) + recent orders
- Customer signup/login asli, session refresh pe bana rehta hai, logout
- Checkout asli order save karta hai (Pickup/Delivery, COD), Confirmation page + WhatsApp button
- Latest deploy ka live test verified (login, order, Order #, WhatsApp)
- Customer My Orders + Order Detail DB se (RLS verified: naye user ko sirf apna order dikha)
- Customer Profile (naam, phone user_metadata mein; email read-only)
- admins table ka user_id mismatch fix hua (admin login ab chal raha hai)

## In progress (local, NOT pushed)
- Saved Addresses page (src/AuthScreens.tsx): code likha aur build pass, lekin test baaki
- SQL 06_create_addresses_table chalaya tha, "Success" confirm nahi hua
- Test: naye customer user se /account/addresses (add, make default, delete, refresh). Pass hone par hi commit + push.

## Pending
1. Addresses test + push (upar dekho)
2. Test orders Table Editor se delete (#1, #6, aur #8 jo naye test user ka hai)
3. Custom SMTP real emails ke liye
4. Forgot/Reset password flow asli (PasswordFlow abhi demo)
5. Polish: site.json title ("Figma Make App"), favicon, Open Graph, robots noindex hatana (launch pe), SEO, mobile check, product image upload (Supabase Storage), apni images
6. Razorpay (test mode pehle, live ke liye KYC)

## Known notes
- Admin Supabase mein login hota hai, toh App.tsx admin ko "customer logged in" maan leta hai (baad mein theek karna). Admin email se customer pages pe saare orders dikhte hain (admin RLS), customer test ke liye alag user use karo.
- Admin account ka password temporary set hai, baad mein pakka password set karna (SQL Editor se).
- Customer account Settings page abhi demo hai.
- Admin Categories, Customers, Settings pages demo/hardcoded hain.
- Custom Cakes request form aur Contact enquiry form DB mein save nahi hote.
- Focaccia ke variant labels "₹249"/"₹499" hain, check karna.
- .gitattributes mein almost sab binary types LFS pe hain; 2 PNGs (src/imports) use nahi hote.
- SQL files: 01_create_products_table, 02_insert_products_seed, 03_admin_setup, 04_create_orders_tables, 05_orders_schedule_columns, 06_create_addresses_table (confirm baaki)