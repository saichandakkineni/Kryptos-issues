import { loadSiteConfig, mountChrome, renderFooter, renderHeader, resolvePageUrl } from "./common.js";

const APP_ID = document.body.dataset.appId || "kryptos";
const inlineData = import.meta.env.VITE_INLINE_DATA === "true";
const faqModules = import.meta.glob("../../data/*-faq.json", { eager: true });

async function loadFaq(faqPath, appId) {
  if (inlineData) {
    const key = `../../data/${appId}-faq.json`;
    const data = faqModules[key];
    if (!data) throw new Error(`Could not load FAQ data for ${appId}.`);
    return data.default ?? data;
  }
  const response = await fetch(faqPath);
  if (!response.ok) throw new Error("Could not load FAQ data.");
  return response.json();
}

function renderFaq(items) {
  const list = document.querySelector("#faq-list");
  const count = document.querySelector("#faq-count");
  if (!list) return;

  list.innerHTML = items
    .map(
      (item, index) => `
      <article class="faq-item" data-category="${item.category}" data-index="${index}">
        <button type="button" class="faq-question" aria-expanded="false" aria-controls="faq-a-${index}" id="faq-q-${index}">
          <span><span class="faq-tag">${item.category}</span><br>${item.question}</span>
        </button>
        <div class="faq-answer" id="faq-a-${index}" role="region" aria-labelledby="faq-q-${index}" hidden>
          <p>${item.answer}</p>
        </div>
      </article>
    `
    )
    .join("");

  count.textContent = `${items.length} articles`;

  list.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => toggleFaq(button));
  });
}

function toggleFaq(button) {
  const expanded = button.getAttribute("aria-expanded") === "true";
  const answer = document.getElementById(button.getAttribute("aria-controls"));
  button.setAttribute("aria-expanded", String(!expanded));
  answer.hidden = expanded;
  button.closest(".faq-item")?.toggleAttribute("open", !expanded);
}

function updateFaqVisibility(items) {
  const list = document.querySelector("#faq-list");
  const count = document.querySelector("#faq-count");
  const query = document.querySelector("#faq-search")?.value || "";
  const category = document.querySelector("#faq-category")?.value || "";
  const normalized = query.trim().toLowerCase();
  let visible = 0;

  list.querySelectorAll(".faq-item").forEach((el, index) => {
    const item = items[index];
    const matchesCategory = !category || item.category === category;
    const haystack = `${item.category} ${item.question} ${item.answer}`.toLowerCase();
    const matchesQuery = !normalized || haystack.includes(normalized);
    const show = matchesCategory && matchesQuery;
    el.hidden = !show;
    if (show) visible += 1;
  });

  count.textContent = `${visible} of ${items.length} articles`;
}

function initFaqFilters(items) {
  const search = document.querySelector("#faq-search");
  const category = document.querySelector("#faq-category");
  const categories = [...new Set(items.map((i) => i.category))].sort();

  category.innerHTML =
    `<option value="">All topics</option>` +
    categories.map((c) => `<option value="${c}">${c}</option>`).join("");

  const refresh = () => updateFaqVisibility(items);
  search.addEventListener("input", refresh);
  category.addEventListener("change", refresh);
}

function thankYouUrl(config, app) {
  const supportUrl = resolvePageUrl(config, app.supportPath);
  const separator = supportUrl.includes("?") ? "&" : "?";
  return `${supportUrl}${separator}sent=1`;
}

function initContactForm(config, app) {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  if (!form) return;

  form.action = config.formSubmitEndpoint;
  form.querySelector('[name="_subject"]').value = `${app.name} Support Request`;
  form.querySelector('[name="_next"]').value = thankYouUrl(config, app);
  form.querySelector('[name="_template"]').value = "table";

  const params = new URLSearchParams(window.location.search);
  if (params.get("sent") === "1") {
    status.hidden = false;
    status.className = "form-status success";
    status.textContent = "Thank you. Your message was sent. We will reply to the email you provided.";
  }

  form.addEventListener("submit", (event) => {
    const email = form.querySelector('[name="email"]').value.trim();
    if (!email || !email.includes("@")) {
      event.preventDefault();
      status.hidden = false;
      status.className = "form-status error";
      status.textContent = "Please enter a valid email address so we can reply.";
    }
  });
}

async function init() {
  const config = await loadSiteConfig();
  const app = config.apps.find((a) => a.id === APP_ID);
  if (!app) throw new Error(`Unknown app: ${APP_ID}`);

  const homePath = config.paths?.home || "/";
  document.documentElement.style.setProperty("--accent", app.accent || "#5b8def");

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

  const faqPath = inlineData
    ? null
    : `${import.meta.env.BASE_URL}${(app.faqData || "").replace(/^\//, "")}`;
  const faqItems = await loadFaq(faqPath, app.id);
  renderFaq(faqItems);
  initFaqFilters(faqItems);
  initContactForm(config, app);

  document.querySelector("#support-email").href = `mailto:${config.supportEmail}?subject=${encodeURIComponent(app.name + " Support")}`;
  document.querySelector("#support-email").textContent = config.supportEmail;
}

init().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML(
    "beforeend",
    `<p role="alert" style="padding:1rem;color:#f07178;">Failed to load support page: ${error.message}</p>`
  );
});
