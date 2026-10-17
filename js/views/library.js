import { EXERCISES, CATEGORIES } from "../data/exercises.js";
import { mediaHTML } from "../placeholder.js";
import { addExerciseToDay } from "../db.js";
import { openDayPicker } from "../modal.js";

let state = { cat: "", query: "" };

export function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>Библиотека</h1>
      <p class="page-sub">Все упражнения. Выберите и добавьте в план на нужные дни.</p>
    </div>

    <input type="text" class="search-input" placeholder="Поиск упражнения…" value="${state.query}" data-search />

    <div class="filter-row">
      <button class="filter-chip ${!state.cat ? "active" : ""}" data-cat="">Все</button>
      ${Object.entries(CATEGORIES).map(([key, c]) => `
        <button class="filter-chip ${state.cat === key ? "active" : ""}" data-cat="${key}" style="--cat-color:${c.color}">
          ${c.title}
        </button>
      `).join("")}
    </div>

    <div class="card-list" data-list>
      ${filteredExercises().map((ex) => libraryCardHTML(ex)).join("") || `<p class="empty-hint">Ничего не найдено</p>`}
    </div>
  `;

  container.querySelector("[data-search]").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderList(container);
  });

  container.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.cat = btn.dataset.cat;
      render(container);
    });
  });

  bindCards(container);
}

function filteredExercises() {
  return EXERCISES.filter((e) => {
    const matchCat = !state.cat || e.category === state.cat;
    const matchQuery = !state.query || e.name.toLowerCase().includes(state.query.toLowerCase());
    return matchCat && matchQuery;
  });
}

function renderList(container) {
  const list = container.querySelector("[data-list]");
  list.innerHTML = filteredExercises().map((ex) => libraryCardHTML(ex)).join("") || `<p class="empty-hint">Ничего не найдено</p>`;
  bindCards(container);
}

function libraryCardHTML(ex) {
  const cat = CATEGORIES[ex.category];
  return `
    <div class="ex-card library-item" data-ex="${ex.id}">
      <div class="ex-card-media">${mediaHTML(ex)}</div>
      <div class="ex-card-body">
        <span class="chip" style="--cat-color:${cat.color}">${cat.title}</span>
        <div class="ex-card-name">${ex.name}</div>
        <div class="ex-card-sub">${ex.equipment}</div>
      </div>
      <button class="icon-btn add" data-add="${ex.id}" title="Добавить в план">+</button>
    </div>
  `;
}

function bindCards(container) {
  container.querySelectorAll("[data-ex]").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-add]")) return;
      const ex = EXERCISES.find((x) => x.id === card.dataset.ex);
      import("../modal.js").then(({ openExerciseDetail }) => openExerciseDetail(ex));
    });
  });

  container.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const ex = EXERCISES.find((x) => x.id === btn.dataset.add);
      openDayPicker({
        title: `Добавить «${ex.name}» в дни`,
        onConfirm: (days) => {
          days.forEach((d) => addExerciseToDay(d, ex));
        },
      });
    });
  });
}
