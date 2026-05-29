import {
  loadSiteConfig,
  mountChrome,
  renderFooter,
  renderHeader,
  resolvePageUrl,
  externalLinkAttrs,
} from "./common.js";

const APP_ID = document.body.dataset.appId || "kryptos";

async function init() {
  const config = await loadSiteConfig();
  const app = config.apps.find((a) => a.id === APP_ID);
  if (!app) throw new Error(`Unknown app: ${APP_ID}`);

  const homePath = config.paths?.home || "/";
  const linkAttrs = externalLinkAttrs();
  const supportHref = resolvePageUrl(config, app.supportPath);

  mountChrome(
    "#site-header",
    renderHeader(config, {
      appName: app.name,
      supportPath: app.supportPath,
      privacyPath: app.privacyPath,
      homePath,
    })
  );
  mountChrome(
    "#site-footer",
    renderFooter(config, {
      supportEmail: config.supportEmail,
      supportPath: app.supportPath,
      privacyPath: app.privacyPath,
    })
  );

  document.querySelectorAll(".privacy-inline-link, #privacy-support-link").forEach((link) => {
    link.href = supportHref;
    if (linkAttrs) {
      link.setAttribute("target", "_top");
      link.setAttribute("rel", "noopener");
    }
  });
}

init().catch((error) => {
  console.error(error);
});
