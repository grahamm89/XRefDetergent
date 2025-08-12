
[![Deploy to GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Auto--deploy-blue)](#)
<!-- Replace the line above with this once you know your repo:
[![Deploy to GitHub Pages](https://github.com/<YOUR_USER>/<YOUR_REPO>/actions/workflows/pages.yml/badge.svg)](https://github.com/<YOUR_USER>/<YOUR_REPO>/actions/workflows/pages.yml)
-->

# Detergent Concentration Tool (PWA)

A Progressive Web App for quick reference of detergent drop-to-concentration values.

## Features
- **Offline Ready:** Service worker with network-first strategy for HTML, cache-first for assets.
- **No Install Prompt:** Designed to be launched via Tool Hub.
- **Auto Cache Busting:** Ensures updates are shown without hard-refresh.
- **Version Footer:** Displays last updated timestamp & version.
- **Responsive & Mobile-Friendly:** Works across devices.
- **Print Optimised:** Removes unnecessary UI elements in print view.
- **Accessibility:** Proper labels, `aria` attributes, and keyboard navigation.
- **PWA Manifest:** Configured for standalone display mode with theme colour matching brand.
- **GitHub Pages Deploy Workflow:** Uses latest Actions (`upload-pages-artifact@v3`) for stability.

## Deployment (GitHub UI - No Terminal)
1. **Create Public Repo** (e.g., `detergent-tool`)
2. **Upload Files:**
   - Unzip `detergent-tool-ghpages-complete.zip`
   - Drag and drop **contents** into the repo root.
3. **Enable Pages:**
   - Go to `Settings` → `Pages`.
   - Select **Deploy from a branch** → Branch: `main`, Folder: `/ (root)`.
   - Or use **GitHub Actions** (workflow included).
4. Wait ~1 minute for deployment. The live URL will be shown.

## Updating the Tool
- Edit `index.html` or any other file directly in GitHub and commit.
- For drop data changes, edit the `<script type="application/json" id="detergentData">` block in `index.html`.

## Version
- **Build Version:** 1.0.2
- **Last Updated:** 2025-08-12 03:45:34

## Status Badge
![Deploy](https://github.com/YOUR-USERNAME/YOUR-REPO/actions/workflows/pages.yml/badge.svg)

---
**Note:** Replace `assets/icon-192.png` and `assets/icon-512.png` with your actual icons for branding.


## Changelog
- 2025-08-12 Add README badge placeholder, version footer, and final Pages workflow.
