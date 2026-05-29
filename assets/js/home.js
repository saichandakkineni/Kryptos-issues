import { loadSiteConfig, mountChrome, renderFooter, renderHeader, resolvePageUrl, externalLinkAttrs } from "./common.js";

async function init() {
  const config = await loadSiteConfig();
  const homePath = config.paths?.home || "/";

  mountChrome(
    "#site-header",
    renderHeader(config, { appName: "Developer Support", homePath })
  );
  mountChrome(
    "#site-footer",
    renderFooter(config, {
      supportEmail: config.supportEmail,
      supportPath: null,
      privacyPath: null,
    })
  );

  const grid = document.querySelector("#app-grid");
  if (!grid) return;

  const linkAttrs = externalLinkAttrs();
  grid.innerHTML = config.apps
    .map(
      (app) => `
      <a class="app-card" href="${resolvePageUrl(config, app.supportPath)}"${linkAttrs}>
        <h3>${app.name}</h3>
        <p>${app.tagline}</p>
        <p><small>${app.platforms.join(" · ")}</small></p>
      </a>
    `
    )
    .join("");
}

init().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML(
    "beforeend",
    `<p role="alert" style="padding:1rem;color:#f07178;">Failed to load site: ${error.message}</p>`
  );
});
