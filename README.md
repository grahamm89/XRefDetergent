# XRefDetergent

A Progressive Web App (PWA) designed to help users quickly reference detergent concentration data.

## Overview
This tool allows staff to look up detergent product details, usage instructions, and concentration references. 
It includes a protected admin page for updating the product list without any coding knowledge.

## Features
- **Mobile & Desktop Ready** – Works on any modern browser.
- **Offline Access** – Can be installed as an app and used without internet.
- **Searchable Product List** – Select from the dropdown to view details.
- **Admin Editor** – Easily update products via a browser form (password protected).
- **Automatic Updates** – Changes are instantly available to all users.

## Installation (Recommended/Essential For Content Updates - as an App)
1. Open the app in your browser.
2. If prompted, select **"Install"** or **"Add to Home Screen"**.
3. Once installed, you can launch it like a normal app, even offline.

## User Instructions
1. **Access the Tool**  
   - Visit the provided web link in your browser.
   - The homepage will display a **Product Selection Dropdown**.

2. **Select a Product**  
   - Click the dropdown menu.
   - Scroll or type to find the product name.
   - Select the product to view concentration data.

3. **Read the Information**  
   - The table will display recommended concentrations, notes, and usage guidance.
   - All text is black on a white background for clarity.

4. **No Search Bar**  
   - The product list is dropdown-only. There is no reverse lookup or partial match search.

5. **Offline Use**  
   - If installed as a PWA, you can use it without internet access.

## Admin Instructions (Updating Products)
> **Note:** Only authorised users should access the admin panel.

1. **Open the Admin Page**  
   - Go to: `yourdomain.com/admin.html`  
   - Enter the admin password.

2. **Add or Edit Products**  
   - Use the form to enter the product name, code, and concentration details.
   - Click **Save Changes**.

3. **Publishing Changes**  
   - Updates are saved to the `products.json` file.
   - Users will see the updated list automatically next time they load the app.

4. **Do Not Edit Code**  
   - All updates are done in the admin panel—no coding required.

## File Structure
```
index.html       → Main app interface
admin.html       → Admin editor page
products.json    → Product data (editable via admin page)
style.css        → Styling for the app
app.js           → Main app logic
js/admin.js      → Admin page logic
sw.js            → Service Worker for offline use
manifest.json    → PWA manifest
assets/          → Icons and images
```

## Technical Notes
- This app uses a Service Worker (`sw.js`) for caching offline assets.
- `manifest.json` enables the PWA install prompt.
- JSON files store product data for easy updates without touching HTML or JS.

## Support
For help or technical issues, contact the development/support team.
