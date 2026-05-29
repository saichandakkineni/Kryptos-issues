import siteConfigInline from "../../data/site-config.json";

const THEME_KEY = "dss-theme";
const isGoogleSites = import.meta.env.VITE_GOOGLE_SITES === "true";
const inlineData = import.meta.env.VITE_INLINE_DATA === "true";

export async function loadSiteConfig() {
  if (inlineData) return siteConfigInline;
  const response = await fetch(`${import.meta.env.BASE_URL}data/site-config.json`);
  if (!response.ok) throw new Error("Could not load site configuration.");
  return response.json();
}

/** Link attributes when pages run inside a Google Sites iframe. */
export function externalLinkAttrs() {
  return isGoogleSites ? ' target="_top" rel="noopener"' : "";
}

function joinUrl(base, segment) {
  const trimmedBase = base.replace(/\/$/, "");
  const trimmedSegment = (segment || "").replace(/^\//, "");
  if (!trimmedSegment) return trimmedBase;
  return `${trimmedBase}/${trimmedSegment}`;
}

function googleSitesUrl(config, pageKey) {
  const gs = config.googleSites;
  if (!gs?.siteUrl) return null;
  const segment = gs.pages?.[pageKey];
  if (segment === undefined) return null;
  return joinUrl(gs.siteUrl, segment);
}

function appBySupportPath(config, path) {
  return config.apps?.find((app) => app.supportPath === path);
}

/**
 * Resolves internal paths to relative build URLs or absolute Google Sites URLs.
 */
export function resolvePageUrl(config, path) {
  if (!path) return "#";
  if (/^https?:\/\//i.test(path)) return path;

  if (isGoogleSites && config.googleSites?.siteUrl) {
    if (path === config.paths?.home || path === "/") {
      return googleSitesUrl(config, "home") || path;
    }
    const app = appBySupportPath(config, path);
    if (app?.googleSitesUrls?.support) return app.googleSitesUrls.support;
    if (path === app?.privacyPath && app?.googleSitesUrls?.privacy) {
      return app.googleSitesUrls.privacy;
    }
    if (app) {
      const supportUrl = googleSitesUrl(config, `${app.id}Support`);
      if (supportUrl && path === app.supportPath) return supportUrl;
      const privacyUrl = googleSitesUrl(config, `${app.id}Privacy`);
      if (privacyUrl && path === app.privacyPath) return privacyUrl;
    }
  }

  if (path.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${path.slice(1)}`;
  }
  return path;
}

export function initThemeToggle(button) {
  const stored = localStorage.getItem(THEME_KEY);
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const theme = stored || (prefersLight ? "light" : "dark");
  applyTheme(theme);

  button?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  document.querySelectorAll("[data-theme-toggle]").forEach((el) => {
    el.setAttribute("aria-label", label);
    el.textContent = theme === "light" ? "🌙" : "☀️";
  });
}

export function renderHeader(config, { appName, supportPath, privacyPath, homePath = "/" }) {
  const linkAttrs = externalLinkAttrs();
  const brandLabel = appName || "Developer Support";
  const homeHref = resolvePageUrl(config, homePath);
  const supportHref = supportPath ? resolvePageUrl(config, supportPath) : null;
  const privacyHref = privacyPath ? resolvePageUrl(config, privacyPath) : null;

  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${homeHref}"${linkAttrs}>
          <span class="brand-icon" aria-hidden="true">◆</span>
          <span>${brandLabel}</span>
        </a>
        <div class="header-actions">
          ${supportHref ? `<a class="nav-link" href="${supportHref}"${linkAttrs}>Support</a>` : ""}
          ${privacyHref ? `<a class="nav-link" href="${privacyHref}"${linkAttrs}>Privacy</a>` : ""}
          <button type="button" class="icon-btn" data-theme-toggle aria-label="Toggle theme">☀️</button>
        </div>
      </div>
    </header>
  `;
}

export function renderFooter(config, { supportEmail, privacyPath, supportPath }) {
  const linkAttrs = externalLinkAttrs();
  const year = new Date().getFullYear();
  const supportHref = supportPath ? resolvePageUrl(config, supportPath) : null;
  const privacyHref = privacyPath ? resolvePageUrl(config, privacyPath) : null;

  return `
    <footer class="site-footer">
      <div class="footer-links">
        ${supportHref ? `<a href="${supportHref}"${linkAttrs}>Support</a>` : ""}
        ${privacyHref ? `<a href="${privacyHref}"${linkAttrs}>Privacy Policy</a>` : ""}
        <a href="mailto:${supportEmail}">${supportEmail}</a>
      </div>
      <p>© ${year} Developer Support. We typically respond within 2 business days.</p>
    </footer>
  `;
}

export function mountChrome(target, html) {
  const root = document.querySelector(target);
  if (!root) return;
  root.innerHTML = html;
  initThemeToggle(root.querySelector("[data-theme-toggle]"));
}
