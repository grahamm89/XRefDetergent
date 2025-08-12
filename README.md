# XRef Detergent (PWA)

- Detergent concentration lookup tool with offline support
- About modal (version from `manifest.json`, build time, PWA note)
- **Admin page** (password: `apex-admin`) for editing `products.json` (no code edits)
- **Double-press `e`** opens the admin page
- Cache-busted `products.json` + network-first in Service Worker (no hard refresh needed)

## Deploy on GitHub Pages (no terminal)
1. Create a **public** repo named `XRefDetergent` (or any name).
2. Upload **all files** from this folder, preserving structure.
3. Settings → **Pages** → choose **GitHub Actions** (or "Deploy from a branch").
4. Wait for the workflow to finish, then open your Pages URL.

## Update product data (no code)
- Go to `/admin.html` on your site.
- Password: `apex-admin`.
- Edit rows, add/delete, then **Download products.json**.
- In GitHub → Upload the new `products.json` to the repo root and **Commit**.
- Users will see updates on a normal refresh.

## Force asset refresh
If assets like icons/CSS don't update immediately, bump `CACHE_VERSION` in `sw.js` and commit.

