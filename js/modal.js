// Универсальные модалки: карточка упражнения, выбор упражнения, выбор дней недели.

import { EXERCISES, CATEGORIES, getExerciseById } from "./data/exercises.js";
import { mediaHTML } from "./placeholder.js";
import { WEEKDAYS, WEEKDAY_TITLES } from "./db.js";

let root = null;

export function initModalRoot() {
  root = document.getElementById("modal-root");
}

export function closeModal() {
  if (!root) return;
  root.innerHTML = "";
  root.classList.remove("open");
}

function openRaw(innerHTML, onMount) {
  if (!root) return;
  root.innerHTML = `
    <div class="modal-backdrop" data-close="1">
      <div class="modal-sheet" data-sheet>
        <div class="modal-grip"></div>
        ${innerHTML}
      </div>
    </div>
  `;
  root.classList.add("open");
  root.querySelector(".modal-backdrop").addEventListener("click", (e) => {
    if (e.target.dataset.close) closeModal();
  });
  if (onMount) onMount(root);
}

export function openExerciseDetail(exercise, { context } = {}) {
  const cat = CATEGORIES[exercise.category];
  const unitLabel = exercise.unit === "sec" ? "сек" : exercise.unit === "min" ? "мин" : "повт.";
  const weightLine = exercise.defaultWeight
    ? `${exercise.defaultSets} × ${exercise.defaultReps} ${unitLabel} · ${exercise.defaultWeight} кг`
    : `${exercise.defaultSets} × ${exercise.defaultReps} ${unitLabel}`;

  openRaw(`
    <div class="modal-header">
      <span class="chip" style="--cat-color:${cat.color}">${cat.title}</span>
      <button class="icon-btn" data-close="1">✕</button>
    </div>
    ${mediaHTML(exercise, { size: "large" })}
    <h2 class="modal-title">${exercise.name}</h2>
    <p class="modal-sub">${exercise.equipment} · по умолчанию ${weightLine}</p>
    <p class="modal-desc">${exercise.description}</p>
  `, (r) => {
    r.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", closeModal)
    );
  });
}

export function openExercisePicker({ title = "Выбрать упражнение", onPick }) {
  const render = (filterCat, query) => {
    const list = EXERCISES.filter((e) => {
      const matchCat = !filterCat || e.category === filterCat;
      const matchQuery = !query || e.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });

    const catChips = Object.entries(CATEGORIES)
      .map(([key, c]) => `
        <button class="filter-chip ${filterCat === key ? "active" : ""}" data-cat="${key}" style="--cat-color:${c.color}">
          ${c.title}
        </button>
      `).join("");

    return `
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="icon-btn" data-close="1">✕</button>
      </div>
      <input type="text" class="search-input" placeholder="Поиск упражнения…" value="${query || ""}" data-search />
      <div class="filter-row">
        <button class="filter-chip ${!filterCat ? "active" : ""}" data-cat="">Все</button>
        ${catChips}
      </div>
      <div class="picker-list">
        ${list.map((e) => {
          const cat = CATEGORIES[e.category];
          return `
            <div class="picker-item" data-pick="${e.id}">
              ${mediaHTML(e)}
              <div class="picker-item-info">
                <div class="picker-item-name">${e.name}</div>
                <div class="picker-item-sub"><span class="dot" style="background:${cat.color}"></span>${cat.title} · ${e.equipment}</div>
              </div>
            </div>
          `;
        }).join("") || `<p class="empty-hint">Ничего не найдено</p>`}
      </div>
    `;
  };

  let state = { cat: "", query: "" };

  const mount = (r) => {
    r.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
    r.querySelector("[data-search]").addEventListener("input", (e) => {
      state.query = e.target.value;
      update();
    });
    r.querySelectorAll("[data-cat]").forEach((el) =>
      el.addEventListener("click", () => {
        state.cat = el.dataset.cat;
        update();
      })
    );
    r.querySelectorAll("[data-pick]").forEach((el) =>
      el.addEventListener("click", () => {
        const ex = getExerciseById(el.dataset.pick);
        closeModal();
        onPick(ex);
      })
    );
  };

  function update() {
    const sheet = root.querySelector(".modal-sheet");
    const grip = sheet.querySelector(".modal-grip").outerHTML;
    sheet.innerHTML = grip + render(state.cat, state.query);
    mount(root);
    // возвращаем фокус в поле поиска, курсор в конец
    const input = root.querySelector("[data-search]");
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

  openRaw(render(state.cat, state.query), mount);
}

export function openDayPicker({ title = "Добавить в дни", preselected = [], onConfirm }) {
  const selected = new Set(preselected);

  openRaw(`
    <div class="modal-header">
      <h2 class="modal-title">${title}</h2>
      <button class="icon-btn" data-close="1">✕</button>
    </div>
    <div class="day-list">
      ${WEEKDAYS.map((d) => `
        <label class="day-row">
          <input type="checkbox" data-day="${d}" ${selected.has(d) ? "checked" : ""} />
          <span>${WEEKDAY_TITLES[d]}</span>
        </label>
      `).join("")}
    </div>
    <button class="btn-primary" data-confirm>Добавить</button>
  `, (r) => {
    r.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
    r.querySelectorAll("[data-day]").forEach((el) =>
      el.addEventListener("change", () => {
        if (el.checked) selected.add(el.dataset.day);
        else selected.delete(el.dataset.day);
      })
    );
    r.querySelector("[data-confirm]").addEventListener("click", () => {
      closeModal();
      onConfirm(Array.from(selected));
    });
  });
}
