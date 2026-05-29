# Hosting on Google Sites — step-by-step guide

This guide walks you through the full setup: build the site on your computer, host the interactive pages on **free GitHub Pages**, embed them in **Google Sites**, and use the Google Sites URLs in **App Store Connect**.

---

## What you are building (read this first)

Google Sites cannot run this project’s JavaScript, CSS, or FAQ data by itself. You use **two services**:

| Layer | Service | Role | Cost |
|-------|---------|------|------|
| **Public URLs** | Google Sites | What users and Apple see (`sites.google.com/...`) | Free |
| **Interactive UI** | GitHub Pages | Hosts the built HTML you embed in iframes (`*.github.io/...`) | Free |

```text
App Store / user browser
        │
        ▼
https://sites.google.com/view/info-kryptos/kryptos-support   ← Support URL in App Store Connect
        │
        └── iframe embed ──► https://saichandakkineni.github.io/Kryptos-issues/kryptos/index.html
```

**Important:** In App Store Connect, enter the **Google Sites** URLs, not the GitHub Pages URLs.

---

## Your progress (Kryptos)

| Item | Value |
|------|--------|
| Google Sites site | [info-kryptos](https://sites.google.com/view/info-kryptos) |
| Home | […/home](https://sites.google.com/view/info-kryptos/home) |
| Support page | […/kryptos-support](https://sites.google.com/view/info-kryptos/kryptos-support) |
| Privacy page | […/kryptos-privacy](https://sites.google.com/view/info-kryptos/kryptos-privacy) |
| GitHub repo | [saichandakkineni/Kryptos-issues](https://github.com/saichandakkineni/Kryptos-issues) |
| Embed host (GitHub Pages) | `https://saichandakkineni.github.io/Kryptos-issues` |
| Support embed URL | `https://saichandakkineni.github.io/Kryptos-issues/kryptos/index.html` |
| Privacy embed URL | `https://saichandakkineni.github.io/Kryptos-issues/kryptos/privacy.html` |
| Support email | `kryptos.enquiry@gmail.com` |

GitHub Pages deploy workflow is on `main`. **First run failed** until Pages is enabled — finish **Step 6** below, then re-run the workflow.

---

## Checklist (tick as you go)

- [x] **Step 1** — Plan site name and page slugs  
- [x] **Step 2** — Create Google Site and pages (`home`, `kryptos-support`, `kryptos-privacy`)  
- [x] **Step 3** — Edit `data/site-config.json` (first pass)  
- [x] **Step 4** — Install Node and build locally  
- [x] **Step 5** — Push code to [Kryptos-issues](https://github.com/saichandakkineni/Kryptos-issues) (includes deploy workflow)  
- [ ] **Step 6** — Turn on GitHub Pages (Actions) and confirm deploy succeeds — **you are here**  
- [x] **Step 7** — `embedHost` set to `https://saichandakkineni.github.io/Kryptos-issues` (in repo; CI rebuilds on push)  
- [ ] **Step 8** — Add iframe embeds on Google Sites pages (after Step 6 URLs work)  
- [ ] **Step 9** — Publish Google Sites (if not already public)  
- [ ] **Step 10** — Activate FormSubmit email  
- [ ] **Step 11** — Test everything  
- [ ] **Step 12** — Paste URLs into App Store Connect  

---

## Before you start

You will need:

1. A **Google account** (for Google Sites and Gmail `kryptos.enquiry@gmail.com`).
2. A **GitHub account** (free) — [https://github.com/signup](https://github.com/signup).
3. **Node.js** on your Mac — [https://nodejs.org](https://nodejs.org) (choose the LTS installer).  
   After installing, open Terminal and run `node -v` — you should see a version like `v20.x.x`.

This project folder on your machine:

```text
/Users/saichandakkineni/Automation-Utilities/DeveloperSupportSite
```

---

## Step 1 — Plan your URLs

Pick names now. You will use them in config and when creating Google Sites pages.

### 1.1 Google Sites site name

When you create a site, Google assigns a URL like:

```text
https://sites.google.com/view/YOUR_SITE_NAME
```

**Example:** If you name the site `kryptos-support`, the base URL is:

```text
https://sites.google.com/view/kryptos-support
```

Write yours here: `https://sites.google.com/view/________________`

### 1.2 Page slugs (path after the site name)

Create **three pages** in Google Sites. The slug is the part after `/view/YOUR_SITE_NAME/` in the browser address bar.

| Purpose | Suggested page title in editor | Suggested slug | Example full URL |
|---------|-------------------------------|----------------|------------------|
| Hub (app list) | Home | *(empty or `home`)* | `.../view/kryptos-support` or `.../home` |
| Kryptos support | Kryptos Support | `kryptos-support` | `.../kryptos-support` |
| Kryptos privacy | Kryptos Privacy | `kryptos-privacy` | `.../kryptos-privacy` |

**Write your three public URLs (you will use them in App Store Connect):**

1. Hub: `________________________________`
2. Support: `________________________________`
3. Privacy: `________________________________`

### 1.3 GitHub repo name

If your GitHub username is `johndoe` and the repo is `DeveloperSupportSite`, GitHub Pages will be:

```text
https://johndoe.github.io/DeveloperSupportSite/
```

Write yours: `https://________________.github.io/________________/`

---

## Step 2 — Create your Google Site (shell only)

You will add embeds later; for now just create the site and pages.

1. Open [https://sites.google.com](https://sites.google.com).
2. Click **Blank** (or **Template**) to create a new site.
3. Top left: click the site title and rename it (e.g. **Kryptos Developer Support**).
4. Click **Pages** (left panel) → **Add page** three times:
   - Page 1: **Home** (or leave as default home)
   - Page 2: **Kryptos Support**
   - Page 3: **Kryptos Privacy**
5. For each page, open it and check the browser URL — note the slug (e.g. `kryptos-support`).
6. **Do not publish yet** — you will embed content in Step 8.

If your slugs differ from the table in Step 1, update `data/site-config.json` to match (Step 3).

---

## Step 3 — Edit `data/site-config.json` (first pass)

Open this file in your editor:

```text
DeveloperSupportSite/data/site-config.json
```

Update the `googleSites` section. Replace the `REPLACE_...` placeholders with your real values from Step 1.

**Example** (adjust to match your site):

```json
"googleSites": {
  "siteUrl": "https://sites.google.com/view/kryptos-support",
  "embedHost": "https://johndoe.github.io/DeveloperSupportSite",
  "pages": {
    "home": "",
    "kryptosSupport": "/kryptos-support",
    "kryptosPrivacy": "/kryptos-privacy"
  }
}
```

| Field | What to put |
|-------|-------------|
| `siteUrl` | Base URL from Step 1.1 (no trailing slash) |
| `embedHost` | GitHub Pages URL from Step 1.3 (no trailing slash). If the repo is not created yet, use your **expected** URL and fix it in Step 7 after Pages is live. |
| `pages.home` | Slug for hub: `""` if home is the site root, or `"/home"` if the URL ends with `/home` |
| `pages.kryptosSupport` | Must match your support page slug, e.g. `"/kryptos-support"` |
| `pages.kryptosPrivacy` | Must match your privacy page slug, e.g. `"/kryptos-privacy"` |

`supportEmail` and `formSubmitEndpoint` should already be `kryptos.enquiry@gmail.com` — leave those unless you change email.

Save the file.

---

## Step 4 — Build on your Mac

Open **Terminal** and run:

```bash
cd /Users/saichandakkineni/Automation-Utilities/DeveloperSupportSite
npm install
npm run build:google-sites
```

**Expected result:** A folder `dist-google-sites/` with:

```text
dist-google-sites/
  index.html
  kryptos/
    index.html
    privacy.html
```

Each file is one self-contained page (CSS, JS, and FAQs inlined).

### Preview before deploying (optional)

```bash
npm run preview:google-sites
```

Open the URL Terminal prints (usually `http://localhost:4173/`) and click through the pages.

Stop the preview with `Ctrl+C` in Terminal.

### If `npm` is not found

Install Node from [https://nodejs.org](https://nodejs.org), quit and reopen Terminal, then run the commands again.

---

## Step 5 — Put the project on GitHub

**Done for this project.** Repo: [github.com/saichandakkineni/Kryptos-issues](https://github.com/saichandakkineni/Kryptos-issues) · branch `main`.

To push future changes from your Mac:

```bash
cd /Users/saichandakkineni/Automation-Utilities/DeveloperSupportSite
git add .
git commit -m "Describe your change"
git push origin main
```

### 5.1 Create a new repository (reference only)

Skip if you already use **Kryptos-issues**.

1. Go to [https://github.com/new](https://github.com/new).
2. **Repository name:** e.g. `Kryptos-issues`.
3. **Public** repository (required for free Pages on free accounts).
4. Do **not** add a README, .gitignore, or license (you already have files locally).
5. Click **Create repository**.

### 5.2 Push your local folder (reference only)

```bash
cd /Users/saichandakkineni/Automation-Utilities/DeveloperSupportSite
git init
git add .
git commit -m "Initial commit: Kryptos developer support site"
git branch -M main
git remote add origin https://github.com/saichandakkineni/Kryptos-issues.git
git push -u origin main
```

If Git asks you to sign in, use GitHub’s browser login or a [Personal Access Token](https://github.com/settings/tokens) with **repo** and **workflow** scopes.

---

## Step 6 — Enable GitHub Pages (automatic deploy)

This repo includes a workflow that builds and publishes `dist-google-sites/` on every push to `main`.

The workflow [already ran once](https://github.com/saichandakkineni/Kryptos-issues/actions) but **deploy failed** because GitHub Pages was not enabled yet. Complete the steps below, then re-run it.

1. Open [Kryptos-issues → Settings → Pages](https://github.com/saichandakkineni/Kryptos-issues/settings/pages).
2. Under **Build and deployment** → **Source**, choose **GitHub Actions** (not “Deploy from a branch”).
3. Go to [Actions](https://github.com/saichandakkineni/Kryptos-issues/actions) → **Deploy Google Sites embed** → **Re-run all jobs** (or **Run workflow**).
4. Wait until the run shows a **green** checkmark (about 1–2 minutes).
5. Return to **Settings** → **Pages**. You should see:  
   `https://saichandakkineni.github.io/Kryptos-issues/`

### Verify the host works

Open these in your browser:

- [index.html](https://saichandakkineni.github.io/Kryptos-issues/index.html)
- [kryptos/index.html](https://saichandakkineni.github.io/Kryptos-issues/kryptos/index.html)
- [kryptos/privacy.html](https://saichandakkineni.github.io/Kryptos-issues/kryptos/privacy.html)

You should see the styled support/privacy pages. If you get **404**, finish enabling Pages in step 2 above, re-run the workflow, wait 2–5 minutes, and refresh.

---

## Step 7 — Set `embedHost` and rebuild

**Done.** `data/site-config.json` already has:

```json
"embedHost": "https://saichandakkineni.github.io/Kryptos-issues"
```

Every push to `main` rebuilds via GitHub Actions. To change URLs later, edit `site-config.json`, commit, and push.

After Step 6 succeeds, hard-refresh the three test URLs from Step 6.

Navigation links inside the embed now point to your Google Sites pages (once those exist and match `siteUrl` + `pages`).

---

## Step 8 — Embed each page in Google Sites

For each row below, open the matching Google Sites page and insert an iframe.

### 8.1 Home / hub page

1. [Google Sites](https://sites.google.com) → your site → open **Home**.
2. **Insert** → **Embed** → choose **Embed code** (wording may vary).
3. Paste:

```html
<iframe
  src="https://saichandakkineni.github.io/Kryptos-issues/index.html"
  width="100%"
  height="900"
  style="border:0;max-width:100%;"
  loading="lazy"
  title="Developer Support"
></iframe>
```

4. Click **Next** / **Insert**.
5. Select the embed → use **Width** → **Full width** if available.
6. Increase height if content is cut off (edit the `height="900"` value).

### 8.2 Kryptos Support page

Same steps on the **Kryptos Support** page:

```html
<iframe
  src="https://saichandakkineni.github.io/Kryptos-issues/kryptos/index.html"
  width="100%"
  height="2400"
  style="border:0;max-width:100%;"
  loading="lazy"
  title="Kryptos Support"
></iframe>
```

Support page is taller (FAQ + form) — `height="2400"` is a starting point; increase if the bottom is clipped.

### 8.3 Kryptos Privacy page

On the **Kryptos Privacy** page:

```html
<iframe
  src="https://saichandakkineni.github.io/Kryptos-issues/kryptos/privacy.html"
  width="100%"
  height="3200"
  style="border:0;max-width:100%;"
  loading="lazy"
  title="Kryptos Privacy Policy"
></iframe>
```

### 8.4 If “Embed code” is not available

Use **Insert** → **Embed** → **By URL** and paste the same `src` URL from the iframe (the `https://...github.io/.../index.html` link only).

---

## Step 9 — Publish Google Sites

1. Click **Publish** (top right).
2. Choose who can view the site — for App Store, use **Anyone on the web** / public.
3. Confirm the published web address matches `googleSites.siteUrl` in your config.
4. Open each of your three public URLs in an **incognito/private** window and confirm the embed loads.

---

## Step 10 — Activate the contact form (FormSubmit)

The form sends to `kryptos.enquiry@gmail.com` via [FormSubmit](https://formsubmit.co).

1. On the **published** Kryptos Support page, scroll to **Contact support**.
2. Submit a short test message (use a real reply email you can check).
3. In the **kryptos.enquiry@gmail.com** inbox, open FormSubmit’s **activation** email and click the confirmation link.
4. Submit the form again — you should receive the message.

Until activation completes, submissions may not arrive.

---

## Step 11 — Test checklist

| Test | How | Pass? |
|------|-----|-------|
| Hub loads | Open your Google Sites home URL | ☐ |
| Support loads | Open `.../kryptos-support` (or your slug) | ☐ |
| Privacy loads | Open `.../kryptos-privacy` | ☐ |
| FAQ search | Type “AutoFill” on support page | ☐ |
| FAQ expand | Click a question | ☐ |
| Theme toggle | Click sun/moon in header | ☐ |
| Header **Privacy** | Opens privacy Google Sites page (not stuck in iframe only) | ☐ |
| Contact form | Test submit after FormSubmit activation | ☐ |
| Mobile | Open support URL on iPhone Safari | ☐ |

---

## Step 12 — App Store Connect URLs

In [App Store Connect](https://appstoreconnect.apple.com) → your app → **App Information** / version metadata:

| Field | URL to use |
|-------|------------|
| **Support URL** | Your Google Sites **Kryptos Support** page (Step 1.2) |
| **Privacy Policy URL** | Your Google Sites **Kryptos Privacy** page |
| **Marketing URL** (optional) | Your Google Sites home/hub page |

**Do not** use `github.io` links here unless Apple specifically asked for them — reviewers expect the Support/Privacy URLs you submit to show support and policy content directly.

Example:

```text
Support:  https://sites.google.com/view/kryptos-support/kryptos-support
Privacy:  https://sites.google.com/view/kryptos-support/kryptos-privacy
```

(Your exact paths depend on the slugs you chose.)

---

## Updating the site later

When you change FAQs, email, or copy:

1. Edit files in this project (e.g. `data/kryptos-faq.json`).
2. Commit and push to `main` on GitHub.
3. Wait for the **Deploy Google Sites embed** action to finish.
4. Google Sites embeds update automatically (users may need to refresh). No need to re-paste iframes unless you change the GitHub repo name or paths.

If you change Google Sites page slugs or `siteUrl`, update `data/site-config.json`, run `npm run build:google-sites` locally or push to trigger CI, then verify links.

---

## Optional: privacy without an iframe

If you prefer a plain-text privacy page on Google Sites (no embed):

1. Open `google-sites/native/KRYPTOS-PRIVACY.md`.
2. Copy sections into your **Kryptos Privacy** Google Sites page using normal text blocks.
3. Keep **Kryptos Support** as an embed so FAQs and the form still work.
4. App Store **Privacy Policy URL** remains that Google Sites page.

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| **Blank embed on Google Sites** | Open the `github.io` URL directly. If it fails, fix GitHub Pages first (Step 6). If it works, re-insert the iframe with the correct URL. |
| **404 on github.io** | Repo must be **public**. Check **Settings → Pages → Source: GitHub Actions**. Re-run the workflow under **Actions**. |
| **Actions workflow failed** | Open the failed run → read the red step log. Often missing `npm install` or Node issue — fix and push again. |
| **Links open wrong page** | `siteUrl` and `pages.*` in `site-config.json` must match published Google Sites URLs exactly. Rebuild and push after fixing. |
| **Form never arrives** | Confirm FormSubmit activation in `kryptos.enquiry@gmail.com`. Check spam. Test from the **published** site, not localhost. |
| **Thank-you page wrong** | Rebuild after updating `googleSites` URLs (`npm run build:google-sites` + push). |
| **`npm: command not found`** | Install Node.js LTS and restart Terminal. |

---

## Quick reference — file map

| File / folder | Purpose |
|---------------|---------|
| `data/site-config.json` | Email, Google Sites URLs, embed host |
| `data/kryptos-faq.json` | FAQ content |
| `dist-google-sites/` | Built output (deployed by GitHub Actions) |
| `.github/workflows/deploy-google-sites.yml` | Auto-deploy to GitHub Pages |
| `google-sites/native/KRYPTOS-PRIVACY.md` | Copy-paste privacy (optional) |

---

## Hosting without Google Sites later

If you skip Google Sites and host only on GitHub Pages (or Netlify, Cloudflare):

```bash
npm run build
```

Deploy the `dist/` folder instead. Use `https://your-domain/kryptos/` in App Store Connect directly.
