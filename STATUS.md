# Epi d'Or Bakery - Project Status

Last updated: 11 Oct 2026

## NEXT TASK (kal yahin se shuru)
Admin Orders page asli banana (plan step 3): admin sab orders dekhe, order ki details dekhe, aur status update kar sake
(pending -> confirmed -> preparing -> ready -> out_for_delivery -> completed / cancelled).
Pehle AdminScreens.tsx ke Orders wale hisse ki relevant lines dekhni hain.

## DONE
- Cloudflare Pages deploy (https://epi-dor-bakery.pages.dev), auto-deploy har push pe
- Supabase project, products table (36 products), admins table + is_admin() + RLS
- Menu / Home / Custom Cakes DB ke products se
- Admin login asli + route guard + logout
- Admin Products: list, search, category filter, add, edit (variants), delete (image abhi sirf URL)
- Supabase Auth URL Configuration (Site URL + Redirect URLs) saved
- Customer signup/login asli (Supabase Auth), session refresh pe bana rehta hai, logout session band karta hai
- Customer login live pe verified
- Orders tables: orders + order_items (RLS: customer sirf apne, admin sab). Columns: email, scheduled_date, scheduled_time
- Checkout asli order Supabase mein save karta hai (sirf logged-in customer, Pickup/Delivery, Cash on Delivery)
- Confirmation page: Order number + optional "Send order details on WhatsApp" button (bakery number 918369301551)
- Purane demo texts badle (logout page, payment note, confirmation)
- Last pushed commit: 4d4d76a

## PENDING (order mein)
1. Latest deploy (4d4d76a) ka live test: order place, Order # aur WhatsApp button dikhna (status: confirm nahi hua)
2. Admin Orders page asli + status update  <-- NEXT
3. Customer account pages DB se: profile, addresses, order history
4. Custom SMTP real emails ke liye (Supabase built-in mail sirf testing)
5. Forgot/Reset password flow (PasswordFlow abhi demo hai, Supabase se jodna hai)
6. Polish: site.json title ("Figma Make App"), favicon, Open Graph, robots noindex hatana (launch pe), SEO, mobile check, product image upload (Supabase Storage), apni images (Unsplash hotlinked hatani)
7. Baad mein: Razorpay (test mode pehle, live ke liye KYC)

## KNOWN ISSUES / NOTES
- Admin bhi Supabase mein login hota hai, isliye App.tsx admin ko bhi "customer logged in" maan leta hai (baad mein theek karna)
- Test orders (jaise #6 aur crash wale extra order) Table Editor se delete karne hain
- Focaccia ke variant labels "249"/"499" hain, check karna
- Admin dashboard stats aur categories page abhi hardcoded/demo hain
- Cake request form (Custom Cakes) aur Contact enquiry form abhi DB mein save nahi hote
- Account pages (orders, addresses, profile) abhi demo data dikhate hain
- .gitattributes mein almost sab binary types LFS pe hain; 2 PNGs (src/imports) use nahi hote
- Admin wale email se customer signup nahi ho sakta, testing ke liye alag email use karna
- Env change ke baad dev server restart karna padta hai

## SQL HISTORY (Supabase SQL Editor)
01_create_products_table, 02_insert_products_seed, 03_admin_setup, 04_create_orders_tables, 05_orders_schedule_columns