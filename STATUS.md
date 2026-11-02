Epi d'Or Bakery - Next Steps
Last updated: 2 Nov 2026   Last pushed commit: b1f94d7 (Add real admin forgot password flow)

Rules
* Naya Supabase project, naya repo, DB delete/reset, Git history overwrite KABHI nahi
* Abhi naye features nahi, pehle restore + polish
* Password, API key, token, .env values kabhi paste nahi karna

DONE
* [x] Supabase restore, Products API + Auth health test
* [x] Auth URL Configuration sahi
* [x] Customer login test, GitHub push working
* [x] Saved Addresses (add, persist, delete) - bd50abd
* [x] Test orders #1, #6, #8 delete (orders 5 bache)
* [x] Customer Forgot Password asli + test pass - f5f7e04
* [x] Admin Forgot Password asli + test pass (reset mail, naya password, login) - b1f94d7

NEXT (is order mein)
1. [ ] Admin password pakka hai ya nahi confirm karna (agar throwaway tha toh badalna)
2. [ ] Custom SMTP (Gmail App Password ya Resend/Brevo)
3. [ ] Polish: page title, favicon, SEO, product images
4. [ ] Poora order flow dobara check

BAAD MEIN (abhi nahi)
* [ ] Saved Addresses mein Edit option
* [ ] Razorpay payment

Notes
* Admin email se customer pages pe saare orders dikhte hain, customer test ke liye alag user use karo
* Supabase default email sirf team members ke email pe reset mail bhejti hai (SMTP lagne tak)
* PowerShell mein special characters garbled dikhna sirf display issue hai
