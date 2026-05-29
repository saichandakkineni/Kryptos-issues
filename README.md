# DeveloperSupportSite

Static support hub for App Store–compliant **Support URL** and **Privacy Policy URL** pages. Built after Apple rejected an app that linked to GitHub Issues instead of a real support experience.

## What’s included

| Page | URL path | App Store field |
|------|----------|-----------------|
| Hub | `/` | — |
| Kryptos support | `/kryptos/` | **Support URL** |
| Kryptos privacy | `/kryptos/privacy.html` | **Privacy Policy URL** |

### Interactive features (Apple-friendly)

- Searchable, filterable FAQ accordion
- Contact form (posts to FormSubmit → your email)
- Direct `mailto:` support link
- Mobile-responsive layout, light/dark theme

## Local development

```bash
cd /Users/saichandakkineni/Automation-Utilities/DeveloperSupportSite
npm install
npm run dev
```

Open [http://localhost:5173/kryptos/](http://localhost:5173/kryptos/) to preview.

Production build:

```bash
npm run build
npm run preview   # serves ./dist
```

## Deploy on Google Sites (recommended for you)

Google Sites cannot run this repo’s assets directly. Use the **embed workflow**:

1. Configure `googleSites` in `data/site-config.json`.
2. Run `npm run build:google-sites`.
3. Host `dist-google-sites/` on GitHub Pages (or similar).
4. Embed each HTML URL in a Google Sites page via **Insert → Embed**.
5. Use the **Google Sites page URLs** in App Store Connect.

Full steps: **[GOOGLE-SITES.md](./GOOGLE-SITES.md)**.

## Deploy (other hosts)

### GitHub Pages

1. Create a repo (e.g. `DeveloperSupportSite`) and push this folder.
2. **Settings → Pages →** Deploy from branch `main`, folder `/` (root) or `/docs` if you move files.
3. For a project site (`username.github.io/DeveloperSupportSite/`), set `base` in `vite.config.js`:

   ```js
   export default defineConfig({ base: "/DeveloperSupportSite/" });
   ```

4. Use **Actions** or build locally and push `dist/` to `gh-pages` branch.

### Cloudflare Pages / Netlify

- Build command: `npm run build`
- Output directory: `dist`
- No environment variables required for the default setup.

## App Store Connect URLs

**Google Sites:** use your published `sites.google.com/view/...` page URLs (see [GOOGLE-SITES.md](./GOOGLE-SITES.md)).

**Direct static host:** after deploy, set these for **Kryptos** (replace `YOUR_DOMAIN`):

| Field | Example |
|-------|---------|
| Support URL | `https://YOUR_DOMAIN/kryptos/` |
| Privacy Policy URL | `https://YOUR_DOMAIN/kryptos/privacy.html` |
| Marketing URL (optional) | `https://YOUR_DOMAIN/` |

Update placeholders in `Kryptos-iOS/.../AppStore/METADATA.md` and replace GitHub issue links in `PRIVACY-POLICY-TEMPLATE.md` with the live URLs above.

## Contact form setup

The form uses [FormSubmit](https://formsubmit.co) (`formSubmitEndpoint` in `data/site-config.json`). On first submission, FormSubmit emails you a confirmation link—click it to activate.

To use another provider, change `formSubmitEndpoint` or point the form `action` to Formspree/Web3Forms.

## Add another app

1. Add an entry in `data/site-config.json` under `apps`.
2. Create `data/your-app-faq.json`.
3. Copy `kryptos/index.html` → `your-app/index.html` and set `data-app-id`.
4. Add pages to `vite.config.js` `rollupOptions.input`.
5. Add privacy HTML if needed.

## Configuration

Edit `data/site-config.json`:

- `supportEmail` — shown on site and used for FormSubmit
- `apps[]` — name, paths, FAQ JSON path, accent color

FAQ content: `data/kryptos-faq.json`.
