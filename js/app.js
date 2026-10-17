import { initModalRoot } from "./modal.js";
import { getSettings, saveSettings } from "./db.js";
import * as todayView from "./views/today.js";
import * as plannerView from "./views/planner.js";
import * as libraryView from "./views/library.js";
import * as historyView from "./views/history.js";

const ROUTES = {
  "#/today": { view: todayView, label: "Сегодня" },
  "#/plan": { view: plannerView, label: "План" },
  "#/library": { view: libraryView, label: "Библиотека" },
  "#/history": { view: historyView, label: "История" },
};

const outlet = document.getElementById("view-outlet");
const navButtons = document.querySelectorAll("[data-nav]");

function currentRoute() {
  return ROUTES[location.hash] ? location.hash : "#/today";
}

function renderRoute() {
  const hash = currentRoute();
  const route = ROUTES[hash];
  navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.nav === hash));
  route.view.render(outlet);
  outlet.scrollTop = 0;
}

window.addEventListener("hashchange", renderRoute);

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    location.hash = btn.dataset.nav;
  });
});

function initInstallBanner() {
  const banner = document.getElementById("install-banner");
  if (!banner) return;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;
  const settings = getSettings();

  if (!isIOS || isStandalone || settings.installBannerDismissed) {
    banner.remove();
    return;
  }

  banner.classList.add("visible");
  banner.querySelector("[data-dismiss]").addEventListener("click", () => {
    banner.classList.remove("visible");
    saveSettings({ ...settings, installBannerDismissed: true });
  });
}

function initServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol === "file:") return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((err) => {
      console.warn("Service worker не зарегистрирован:", err);
    });
  });
}

function init() {
  initModalRoot();
  initInstallBanner();
  initServiceWorker();
  if (!location.hash) location.hash = "#/today";
  renderRoute();
}

init();
